import React, { useEffect, useMemo, useState } from 'react';
import { addReview, fetchEventReviewsByRole } from '../api/reviewAPI';
import { showToast } from './ToastContainer.jsx';
import '../styles/EventReviews.css';

const TABS = ['participants', 'volunteers', 'donors'];

/* ---------- Helpers ---------- */
function clampRating(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 0;
  return Math.max(-2, Math.min(2, x));
}
const toStars = (r /* -2..2 */) => Math.max(1, Math.min(5, clampRating(r) + 3)); // 1..5
const fromStars = (s /* 1..5 */) => Math.max(-2, Math.min(2, Number(s) - 3));    // -2..2

function flattenByRole(data) {
  if (!data) return [];
  const { volunteers = [], participants = [], donors = [] } = data;
  const map = new Map();
  [...volunteers, ...participants, ...donors].forEach((r) => {
    const id = r._id || r.id;
    if (!map.has(id)) map.set(id, r);
  });
  return [...map.values()];
}

function computeStatsStars(reviews) {
  const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (!reviews?.length) return { avgStars: 0, count: 0, buckets, maxBucket: 0 };
  let sum = 0;
  for (const r of reviews) {
    const s = toStars(r.rating);
    sum += s;
    buckets[s] = (buckets[s] || 0) + 1;
  }
  const maxBucket = Math.max(...Object.values(buckets));
  return { avgStars: sum / reviews.length, count: reviews.length, buckets, maxBucket };
}

function roleBadges(r) {
  const out = [];
  if (r.isParticipant) out.push({ t: 'Participant', k: 'participant' });
  if (r.isVolunteer) out.push({ t: 'Volunteer', k: 'volunteer' });
  if (r.isDonor) out.push({ t: 'Donor', k: 'donor' });
  return out;
}

/* ---------- Star components ---------- */
function Stars({ value = 0, size = 18, readOnly = true, onChange }) {
  // value should be 1..5 (can be float for averages, we’ll round for fill)
  const [hover, setHover] = useState(0);
  const filled = hover || Math.round(value);

  return (
    <div
      className="rv-stars"
      role={readOnly ? undefined : 'radiogroup'}
      aria-label={readOnly ? undefined : 'Rating from 1 to 5 stars'}
      onMouseLeave={() => setHover(0)}
      style={{ fontSize: size }}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const isFilled = i <= filled;
        const props = readOnly
          ? {}
          : {
              role: 'radio',
              'aria-checked': i === value,
              tabIndex: 0,
              onClick: () => onChange?.(i),
              onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') onChange?.(i);
                if (e.key === 'ArrowLeft') onChange?.(Math.max(1, (hover || value || 0) - 1));
                if (e.key === 'ArrowRight') onChange?.(Math.min(5, (hover || value || 0) + 1));
              },
              onMouseEnter: () => setHover(i),
            };
        return (
          <span
            key={i}
            className={`rv-star ${isFilled ? 'filled' : ''} ${readOnly ? 'ro' : 'ed'}`}
            {...props}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

/* ---------- Component ---------- */
export default function EventReviews({
  eventId,
  eventDate,
  eventTime,
  actorType, // "user" | "org"
}) {
  const [byRole, setByRole] = useState({ volunteers: [], participants: [], donors: [] });
  const [viewerEligible, setViewerEligible] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const [loading, setLoading] = useState(false);
  const [otherError, setOtherError] = useState('');

  const [myStars, setMyStars] = useState(0); // 1..5 selection
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allReviews = useMemo(() => flattenByRole(byRole), [byRole]);
  const stats = useMemo(() => computeStatsStars(allReviews), [allReviews]);

  const isPast = useMemo(() => {
    if (!eventDate) return false;
    try {
      const dt = new Date(eventDate);
      if (eventTime && /^\d{2}:\d{2}$/.test(eventTime)) {
        const [hh, mm] = eventTime.split(':').map(Number);
        dt.setHours(hh, mm, 0, 0);
      }
      return dt.getTime() <= Date.now();
    } catch {
      return false;
    }
  }, [eventDate, eventTime]);

  const canAddReview = actorType === 'user' && isPast && viewerEligible;

  async function load() {
    if (!eventId) return;
    setLoading(true);
    setOtherError('');
    try {
      const res = await fetchEventReviewsByRole(eventId);
      setByRole({
        volunteers: Array.isArray(res?.volunteers) ? res.volunteers : [],
        participants: Array.isArray(res?.participants) ? res.participants : [],
        donors: Array.isArray(res?.donors) ? res.donors : [],
      });
      setViewerEligible(!!res?.viewerEligible);
    } catch (e) {
      const msg = e?.message || '';
      setOtherError(
        msg.includes('404')
          ? 'Could not load reviews (404).'
          : 'Could not load reviews. Please try again.'
      );
      setByRole({ volunteers: [], participants: [], donors: [] });
      setViewerEligible(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (!myStars) return showToast('Pick a rating by clicking on the stars', 'error');
    const rating = fromStars(myStars); // convert back to -2..2 for backend
    try {
      setSubmitting(true);
      await addReview(eventId, { rating, comment: myComment?.trim() || undefined });
      showToast('Review submitted', 'success');
      setMyStars(0);
      setMyComment('');
      await load();
    } catch (err) {
      showToast(err?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const list = byRole[activeTab] || [];

  return (
    <section className="rv-wrap">
      {/* Header */}
      <div className="rv-head">
        <h3 className="rv-title">Reviews</h3>
        <div className="rv-summary">
          {/* average as stars */}
          <Stars value={stats.count ? stats.avgStars : 0} size={18} readOnly />
          <span className="rv-muted">
            avg from {stats.count} review{stats.count === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Histogram (1..5 stars) */}
      <div className="rv-hist">
        {[5, 4, 3, 2, 1].map((s) => {
          const count = stats.buckets[s] || 0;
          const percent = stats.maxBucket ? Math.round((count / stats.maxBucket) * 100) : 0;
          return (
            <div className="rv-hist-item" key={s}>
              <div className="rv-hist-label" title={`${s} star${s === 1 ? '' : 's'}`}>
                {s}★
              </div>
              <div className="rv-hist-bar">
                <div className="rv-hist-fill" style={{ width: `${percent}%` }} />
              </div>
              <div className="rv-hist-count">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Add review form (stars) */}
      {canAddReview && (
        <div className="rv-form">
          <div className="rv-form-head">
            <h4>Add your review</h4>
          </div>
          <form onSubmit={onSubmit} className="rv-form-grid rv-form-grid--stars">
            <div className="rv-star-picker">
              <Stars
                value={myStars}
                readOnly={false}
                size={22}
                onChange={(val) => setMyStars(val)}
              />
            </div>
            <input
              type="text"
              placeholder="Optional comment"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              className="rv-input"
              disabled={submitting}
            />
            <button className="primary-btn rv-submit" type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="rv-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`rv-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
            <span className="rv-tab-count">{(byRole[t] || []).length}</span>
          </button>
        ))}
        <button className="rv-tab ghost" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {otherError && <div className="rv-softerror">{otherError}</div>}

      {/* List */}
      {list.length === 0 ? (
        <div className="rv-empty">
          <div className="rv-empty-text">No reviews yet.</div>
        </div>
      ) : (
        <ul className="rv-list">
          {list.map((r, idx) => {
            const u = r.user || {};
            const name = u?.username || u?.name || 'User';
            const uid = u?._id || u?.id;
            const time = r.createdAt ? new Date(r.createdAt).toLocaleString() : '—';
            const roles = roleBadges(r);
            const stars = toStars(r.rating);

            return (
              <li className="rv-item" key={r._id || r.id || idx}>
                <div className="rv-avatar">
                  {(name || '?').slice(0, 1).toUpperCase()}
                </div>
                <div className="rv-body">
                  <div className="rv-row">
                    <div className="rv-user">
                      {uid ? (
                        <a className="user-link" href={`/profile/user/${uid}`}>
                          {name}
                        </a>
                      ) : (
                        <span>{name}</span>
                      )}
                      <div className="rv-badges">
                        {roles.map((b) => (
                          <span key={b.k} className={`rv-badge ${b.k}`}>{b.t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rv-meta">
                      <Stars value={stars} size={16} readOnly />
                      <span className="rv-time">{time}</span>
                    </div>
                  </div>
                  <div className="rv-comment">
                    {r.comment || <span className="rv-muted">No comment</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
