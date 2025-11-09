// EventDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, fetchEventStats } from "../api/eventAPI";
import { fetchOrgById } from "../api/orgAPI";
import { verify } from "../api/authAPI";
import EventSection from "../components/EventSection";
import { getAttendeeDetails } from "../api/attendanceAPI";
import "../styles/EventDetails.css";
import {
  listVolunteers,
  approveVolunteer,
  rejectVolunteer,
} from "../api/volunteerAPI";
import {
  requestCollab,
  getMyCollabStatus,
  listCollabRequests,
  acceptCollabRequest,
  rejectCollabRequest,
  cancelMyCollabRequest,
  COLLAB_STATUS,
  canRequestFromStatus,
} from "../api/collabAPI";
import { showToast } from "../components/ToastContainer.jsx"
import EventReviews from "../components/EventReviews";
import CenterSpinner from "../components/LoadingSpinner.jsx";


export default function EventDetails() {
  const { id } = useParams();
  const [stats, setStats] = useState({ participants: 0, volunteers: 0 });
  const [event, setEvent] = useState(null);
  const [org, setOrg] = useState(null);
  const [actorId, setActorId] = useState(null);
  const [actorType, setActorType] = useState(null);

  const [activeTab, setActiveTab] = useState("participants");
  const [participants, setParticipants] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);

  // --- Collaboration UI state ---
  const [collabStatus, setCollabStatus] = useState(null);
  const [collabRequests, setCollabRequests] = useState([]);
  const [collabLoading, setCollabLoading] = useState(false);
  const [requestNote, setRequestNote] = useState("");

  const isOwner = useMemo(() => {
    if (actorType !== "org") return false;
    const me = String(actorId || "");
    const conducting = String(event?.conductingOrgId || "");
    const collaborating = String(event?.collaboratingOrgId || "");
    return !!me && (me === conducting || me === collaborating);
  }, [actorType, actorId, event?.conductingOrgId, event?.collaboratingOrgId]);

  const isConductingOrg = useMemo(
    () =>
      actorType === "org" &&
      actorId &&
      event?.conductingOrgId &&
      String(actorId) === String(event.conductingOrgId),
    [actorType, actorId, event]
  );

  const isOtherOrg = useMemo(
    () =>
      actorType === "org" &&
      actorId &&
      event?.conductingOrgId &&
      String(actorId) !== String(event.conductingOrgId),
    [actorType, actorId, event]
  );

  const errMsg = (e, fallback) =>
    e?.response?.data?.message || e?.message || fallback;

  const normalizeAttendees = (raw) => {
    const arr = Array.isArray(raw?.attendees)
      ? raw.attendees
      : Array.isArray(raw)
      ? raw
      : [];
    return arr.map((a, idx) => {
      const u = a.user || a;
      const id = u?.id || u?._id || a?.id || a?._id || String(idx);
      return {
        id: String(id),
        name: u?.name || a?.name || "—",
        email: u?.email || a?.email || "—",
        joinedAt: a?.joinedAt || a?.createdAt || null,
      };
    });
  };

  const normalizeVolunteers = (raw) => {
    const arr = Array.isArray(raw?.volunteers)
      ? raw.volunteers
      : Array.isArray(raw)
      ? raw
      : [];
    return arr.map((v, idx) => {
      const u = v.user || {};
      const userId = v.userId || u.id || u._id || v.id || v._id || String(idx);
      return {
        userId: String(userId),
        name: v.name || u.name || "—",
        email: v.email || u.email || "—",
        profilePicture: v.profilePicture || u.profilePicture || "",
        status: v.status || "pending",
        joinedAt: v.joinedAt || v.createdAt || null,
      };
    });
  };

  const isEventInPast = (e) => {
    if (!e?.date) return false;
    try {
      const date = new Date(e.date);
      // if time provided as HH:mm, combine for a stricter check
      if (e.time && /^\d{2}:\d{2}$/.test(e.time)) {
        const [hh, mm] = e.time.split(":").map((x) => parseInt(x, 10));
        date.setHours(hh, mm, 0, 0);
      }
      return date.getTime() < Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEventById(id);
        if (!data) {
          showToast("Event not found", "error");
          return;
        }
        setEvent(data);
        const [orgInfo, auth] = await Promise.all([
          fetchOrgById(data.conductingOrgId),
          verify().catch(() => null),
        ]);
        setOrg(orgInfo || null);
        setActorId(auth?.actor?.id || null);
        setActorType(auth?.actor?.type || null);
      } catch (e) {
        showToast(errMsg(e, "Failed to load event"), "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!event?._id) return;
      if (isOwner) return;
      try {
        const s = await fetchEventStats(event._id);
        setStats({ participants: s.participants || 0, volunteers: s.volunteers || 0 });
      } catch {
        setStats({ participants: 0, volunteers: 0 });
      }
    })();
  }, [event?._id, isOwner]);

  const loadLists = async () => {
    if (!event?._id) return;
    setLoadingLists(true);
    try {
      const [att, vol] = await Promise.all([
        getAttendeeDetails(event._id),
        listVolunteers(event._id),
      ]);
      setParticipants(normalizeAttendees(att));
      setVolunteers(normalizeVolunteers(vol));
    } catch (e) {
      showToast(errMsg(e, "Failed to load attendees/volunteers"), "error");
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    if (event?._id && isOwner) loadLists();
  }, [event?._id, isOwner]);

  // ---------- Collaboration: data loaders ----------
  const loadMyCollabStatus = async () => {
    if (!event?._id || !isOtherOrg) return;
    try {
      setCollabLoading(true);
      const res = await getMyCollabStatus(event._id);
      setCollabStatus(res?.status || null);
    } catch (e) {
      showToast(errMsg(e, "Failed to fetch collaboration status"), "error");
    } finally {
      setCollabLoading(false);
    }
  };

  const loadIncomingRequests = async () => {
    if (!event?._id || !isConductingOrg) return;
    try {
      setCollabLoading(true);
      const res = await listCollabRequests(event._id);
      setCollabRequests(Array.isArray(res?.items) ? res.items : []);
    } catch (e) {
      showToast(errMsg(e, "Failed to fetch collaboration requests"), "error");
    } finally {
      setCollabLoading(false);
    }
  };

  useEffect(() => {
    if (!event?._id) return;
    if (isConductingOrg) {
      loadIncomingRequests();
    } else if (isOtherOrg) {
      loadMyCollabStatus();
    }
  }, [event?._id, isConductingOrg, isOtherOrg]);

  // ---------- Collaboration: actions ----------
  const onSendRequest = async () => {
    if (!event?._id) return;
    try {
      setCollabLoading(true);
      await requestCollab(event._id, { note: requestNote?.trim() || undefined });
      showToast("Collaboration request sent", "success");
      setRequestNote("");
      await loadMyCollabStatus();
    } catch (e) {
      showToast(errMsg(e, "Failed to send request"), "error");
    } finally {
      setCollabLoading(false);
    }
  };

  const onCancelMyRequest = async () => {
    // For simplicity, we’ll cancel the most recent pending request by fetching the list from status endpoint again.
    // If you want a dedicated “requestId” in status, update backend to return it and wire here.
    try {
      setCollabLoading(true);
      // Quick fetch to find pending request (conducting-only list won't help here).
      const res = await getMyCollabStatus(event._id);
      const reqId = res?.request?._id || res?.request?.id;
      if (!reqId || res?.status !== COLLAB_STATUS.PENDING) {
        showToast("No pending request to cancel");
      } else {
        await cancelMyCollabRequest(event._id, reqId);
        showToast("Request cancelled", "success");
        await loadMyCollabStatus();
      }
    } catch (e) {
      showToast(errMsg(e, "Failed to cancel request"), "error");
    } finally {
      setCollabLoading(false);
    }
  };

  const onAccept = async (requestId) => {
    try {
      setCollabLoading(true);
      await acceptCollabRequest(event._id, requestId);
      showToast("Collaboration accepted", "success");
      await Promise.all([loadIncomingRequests()]);
      // also refresh event to see collaborator reflected
      const fresh = await fetchEventById(event._id);
      setEvent(fresh);
    } catch (e) {
      showToast(errMsg(e, "Failed to accept request"), "error");
    } finally {
      setCollabLoading(false);
    }
  };

  const onReject = async (requestId) => {
    try {
      setCollabLoading(true);
      await rejectCollabRequest(event._id, requestId);
      showToast("Request rejected", "success");
      await loadIncomingRequests();
    } catch (e) {
      showToast(errMsg(e, "Failed to reject request"), "error");
    } finally {
      setCollabLoading(false);
    }
  };

  const getVolunteerById = (uid) =>
    volunteers.find((x) => String(x.userId) === String(uid));

  const onConfirm = async (userId) => {
    const v = getVolunteerById(userId);
    if (!v) return showToast("Volunteer not found", "error");
    if (v.status !== "pending")
      return showToast("Action available only for pending volunteers");
    try {
      await approveVolunteer(event._id, userId);
      setVolunteers((prev) =>
        prev.map((x) =>
          String(x.userId) === String(userId) ? { ...x, status: "confirmed" } : x
        )
      );
      showToast("Volunteer confirmed", "success");
    } catch (e) {
      showToast(errMsg(e, "Failed to confirm volunteer"), "error");
    }
  };

  const onRejectVolunteer = async (userId) => {
    const v = getVolunteerById(userId);
    if (!v) return showToast("Volunteer not found", "error");
    if (v.status !== "pending")
      return showToast("Action available only for pending volunteers");
    try {
      await rejectVolunteer(event._id, userId);
      setVolunteers((prev) =>
        prev.map((x) =>
          String(x.userId) === String(userId) ? { ...x, status: "rejected" } : x
        )
      );
      showToast("Volunteer rejected", "success");
    } catch (e) {
      showToast(errMsg(e, "Failed to reject volunteer"), "error");
    }
  };

  if (loading || !event || !org) {
    return <CenterSpinner label="Loading event…" />;
  }

  const past = isEventInPast(event);
  const collaboratorChosen =
    !!event.collaboratingOrgId &&
    String(event.collaboratingOrgId) !== String(actorId || "");

  // ---------- UI ----------
  return (
    <section>
      <EventSection
        banner={event.image}
        name={event.name}
        orgProfilePicture={org.profilePicture}
        orgName={org.name}
        orgType={org.type || org.orgType}
        date={event.date}
        isVirtual={event.isVirtual}
        venue={event.venue}
        description={event.description}
        skills={event.skills}
        clickable={true}
        orgId={org._id}
        eventId={event._id}
        actorId={actorId}
        actorType={actorType}
      />

{isOtherOrg && (
  <section className="user-card ed-collab">
    <div className="ed-collab-head">
      <h3 className="ed-heading">Collaboration</h3>
      {past && <span className="ed-chip muted" title="Event has passed">Closed</span>}
    </div>

    {/* Status banners */}
    {collabStatus === COLLAB_STATUS.ACCEPTED && (
      <div className="ed-alert success">You are the accepted collaborator for this event.</div>
    )}
    {collabStatus === COLLAB_STATUS.PENDING && (
      <div className="ed-alert info">
        Your request is pending.
        <button
          className="secondary-btn ed-inline-btn"
          onClick={onCancelMyRequest}
          disabled={collabLoading}
        >
          {collabLoading ? 'Cancelling…' : 'Cancel Request'}
        </button>
      </div>
    )}
    {collabStatus === COLLAB_STATUS.REJECTED && (
      <div className="ed-alert warn">Your previous request was rejected.</div>
    )}
    {collabStatus === COLLAB_STATUS.CANCELLED && (
      <div className="ed-alert neutral">Your previous request was cancelled.</div>
    )}
    {collabStatus === COLLAB_STATUS.BLOCKED && (
      <div className="ed-alert muted">
        Collaboration closed: another organization has already been accepted.
      </div>
    )}

    {/* Request form (only when allowed & no collaborator chosen) */}
    {canRequestFromStatus(collabStatus) && !collaboratorChosen && (
      <div className="ed-collab-row">
        <input
          type="text"
          placeholder="Optional note to conducting org"
          value={requestNote}
          onChange={(e) => setRequestNote(e.target.value)}
          className="ed-input"
          disabled={collabLoading}
        />
        <button
          className="primary-btn ed-primary-btn"
          onClick={onSendRequest}
          disabled={collabLoading || past}
          title={past ? 'Event is in the past' : undefined}
        >
          {collabLoading ? 'Sending…' : 'Request Collaboration'}
        </button>
      </div>
    )}
  </section>
)}


{isOwner && (
  <section className="ed-owner user-card">
    <div className="ed-owner-tabs">
      <button
        className={activeTab === 'participants' ? 'primary-btn' : 'secondary-btn'}
        onClick={() => setActiveTab('participants')}
      >
        Participants ({participants.length})
      </button>

      <button
        className={activeTab === 'volunteers' ? 'primary-btn' : 'secondary-btn'}
        onClick={() => setActiveTab('volunteers')}
      >
        Volunteers ({volunteers.length})
      </button>

      {isConductingOrg && (
        <button
          className={activeTab === 'collab' ? 'primary-btn' : 'secondary-btn'}
          onClick={() => {
            setActiveTab('collab');
            loadIncomingRequests();
          }}
        >
          Collaboration {collabRequests.length ? `(${collabRequests.length})` : ''}
        </button>
      )}

      <button className="secondary-btn" onClick={loadLists} disabled={loadingLists}>
        {loadingLists ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>

    {activeTab === 'participants' && (
      <div className="ed-owner-card user-card">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {participants.length ? (
              participants.map((p) => (
                <tr key={p.id || p.email}>
                  <td>
                    {p.id ? (
                      <a href={`/profile/user/${p.id}`} className="user-link">
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </td>
                  <td className="user-muted">{p.email}</td>
                  <td className="user-muted">
                    {p.joinedAt ? new Date(p.joinedAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="user-muted">
                  No participants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}

    {activeTab === 'volunteers' && (
      <div className="ed-owner-card user-card">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              {isConductingOrg && <th className="user-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {volunteers.length ? (
              volunteers.map((v, i) => (
                <tr key={v.userId || v.email || i}>
                  <td>{v.name}</td>
                  <td className="user-muted">{v.email}</td>
                  <td>
                    <span className={`tag ${v.status} ed-pill`}>{v.status}</span>
                  </td>
                  {isConductingOrg && (
                    <td className="user-right">
                      {v.status === 'pending' ? (
                        <div className="ed-row-actions">
                          <button
                            className="secondary-btn"
                            onClick={() => onConfirm(v.userId)}
                          >
                            Confirm
                          </button>
                          <button
                            className="secondary-btn"
                            onClick={() => onRejectVolunteer(v.userId)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="user-muted">—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isConductingOrg ? 4 : 3} className="user-muted">
                  No volunteers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}

    {activeTab === 'collab' && isConductingOrg && (
      <div className="ed-owner-card user-card">
        <div className="ed-owner-header">
          <h3>Collaboration Requests</h3>
          <button
            className="secondary-btn"
            onClick={loadIncomingRequests}
            disabled={collabLoading}
          >
            {collabLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Note</th>
              <th>Status</th>
              <th className="user-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collabRequests.length ? (
              collabRequests.map((r) => (
                <tr key={r._id || r.id}>
                  <td>
                    {r.requesterOrgId?._id ? (
                      <a
                        className="user-link"
                        href={`/profile/org/${r.requesterOrgId._id}`}
                      >
                        {r.requesterOrgId?.name || 'Org'}
                      </a>
                    ) : (
                      r.requesterOrgId?.name || 'Org'
                    )}
                  </td>
                  <td className="user-muted ed-note-cell">{r.note || '—'}</td>
                  <td>
                    <span className={`tag ${r.status} ed-pill`}>{r.status}</span>
                  </td>
                  <td className="user-right">
                    {r.status === COLLAB_STATUS.PENDING ? (
                      <div className="ed-row-actions">
                        <button
                          className="secondary-btn"
                          onClick={() => onAccept(r._id || r.id)}
                          disabled={collabLoading}
                        >
                          Accept
                        </button>
                        <button
                          className="secondary-btn"
                          onClick={() => onReject(r._id || r.id)}
                          disabled={collabLoading}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="user-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="user-muted">
                  No collaboration requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </section>
)}


      {!isOwner && (
        <section className="event-stats-simple">
          <h3>Event Stats</h3>
          <div className="event-stats-boxes">
            <div className="event-stat-box">
              <span className="stat-value">{stats.participants}</span>
              <div className="label">Participants</div>
            </div>
            <div className="event-stat-box">
              <span className="stat-value">{stats.volunteers}</span>
              <div className="label">Volunteers</div>
            </div>
          </div>
        </section>
      )}
{/* Show reviews only after the event has passed. No banner otherwise. */}
{isEventInPast(event) && (
  <EventReviews
    eventId={event._id}
    eventDate={event.date}
    eventTime={event.time}
    actorType={actorType}
    actorId={actorId}
  />
)}

    </section>
  );
}
