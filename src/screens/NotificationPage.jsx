import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from "react";
import "../styles/NotificationPage.css";
import {
  fetchMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notificationAPI"; // adjust path if needed

function formatDate(dt) {
  if (!dt) return "";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return String(dt);
  }
}

// optional: tiny icon mapper by type
function iconFor(type) {
  switch (type) {
    case "EVENT_CREATED":
    case "EVENT_REMINDER":
      return "📅";
    case "VOLUNTEER_APPROVED":
      return "✅";
    case "VOLUNTEER_REJECTED":
      return "❌";
    case "CHAT_MESSAGE":
      return "💬";
    case "DONATION_RECEIVED":
      return "💲";
    case "VOLUNTEER_APPLIED":
      return "👤";
    case "FOLLOW_ORG":
      return "⭐";
    case "COLLAB_REQUEST":
      return "🤝";
    case "COLLAB_ACCEPTED":
      return "✅";
    case "COLLAB_REJECTED":
      return "❌";
    case "COLLAB_CANCELLED":
      return "🚫";
    case "ATTEND_EVENT":
      return "🙋";
    case "EVENT_REVIEW":
      return "📝";
    default:
      return "🔔";
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");

  const unreadCount = useMemo(
    () => items.filter(n => !n.readAt).length,
    [items]
  );

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyNotifications({ page: 1, limit: 50 });
      // your backend returns either array or {items: []}; handle both
      const list = Array.isArray(data) ? data : (data?.items || []);
      setItems(list);
    } catch (e) {
      setError(e.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(n) {
    if (n.readAt) return; // already read, do nothing
    try {
      await markNotificationAsRead(n._id);
      setItems(prev =>
        prev.map(x =>
          x._id === n._id ? { ...x, readAt: new Date().toISOString() } : x
        )
      );
    } catch (e) {
      console.warn("mark read failed:", e.message);
    }
  }

  async function handleRedirect(n) {
    await handleMarkRead(n);
    if (["COLLAB_ACCEPTED", "COLLAB_REJECTED", "COLLAB_REQUEST", "COLLAB_CANCELLED", "ATTEND_EVENT", "VOLUNTEER_APPLIED", "VOLUNTEER_APPROVED", "VOLUNTEER_REJECTED"]
    .includes(n.type)){
      const destination = `/event/${n.entityId}`
      navigate(destination);
    } else if (["DONATION_RECEIVED"].includes(n.type)){
      const destination = `/profile/user/${n.data.donorId}`
      navigate(destination);
    } else if (["FOLLOW_ORG"].includes(n.type)) {
      const destination = `/profile/user/${n.data.followerId}`
      navigate(destination);
    }
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await markAllNotificationsAsRead();
      setItems(prev =>
        prev.map(n => (n.readAt ? n : { ...n, readAt: new Date().toISOString() }))
      );
    } catch (e) {
      console.warn("mark all read failed:", e.message);
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <section className="notif-container">
      <div className="notif-header">
        <div>
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">
            Stay updated on events, volunteer opportunities, and donations.
          </p>
        </div>

        <button
          className="notif-markall-btn"
          onClick={handleMarkAllRead}
          disabled={markingAll || unreadCount === 0}
          title={unreadCount === 0 ? "No unread notifications" : "Mark all as read"}
        >
          {markingAll ? "Marking..." : `Mark all read (${unreadCount})`}
        </button>
      </div>

      {loading && (
        <div className="notif-state">
          Loading notifications...
        </div>
      )}

      {!loading && error && (
        <div className="notif-state notif-error">
          {error}
          <button className="notif-retry-btn" onClick={loadNotifications}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="notif-state">
          No notifications yet.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="notif-list">
          {items.map((n) => {
            const unread = !n.readAt;
            const icon = iconFor(n.type);
            const title = n.title || n.type;
            const date = formatDate(n.createdAt);

            return (
              <div
                key={n._id}
                className={`notif-item ${unread ? "unread" : "read"}`}
                onClick={() => handleRedirect(n)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" ? handleMarkRead(n) : null)}
              >
                <div className="notif-left">
                  <span className="notif-icon">{icon}</span>
                  <div className="notif-texts">
                    <p className="notif-title-text">{title}</p>
                    {n.body && <p className="notif-body">{n.body}</p>}
                    <p className="notif-date">{date}</p>
                  </div>
                </div>

                <span className="notif-check">
                  {unread ? "●" : "✔"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
