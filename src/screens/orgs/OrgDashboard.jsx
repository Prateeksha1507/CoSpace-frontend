import React, { useEffect, useState } from "react";
import "../../styles/org/OrgDashboard.css";
import { fetchMyOrgDashboard } from "../../api/orgAPI";
import { useNavigate } from 'react-router-dom';
import Warning from "../../components/Warning";
import { deleteEvent } from "../../api/eventAPI";
import { showToast } from "../../components/ToastContainer";

export default function OrgDashboard() {
  const navigate = useNavigate();
  const handleCreateEvent = ()=>{
    navigate("/create-event")
  }
  const [tab, setTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  const handleDelete = (eventId) => {
    setEventToDelete(eventId);
    setIsWarningOpen(true);
  };

const confirmDelete = async () => {
  try {
    if (!eventToDelete) return;
    await deleteEvent(eventToDelete);

    setEvents(prev => prev.filter(ev => ev._id !== eventToDelete));

    setStats(prev => prev.map(s => {
      if (s.label === "Total Events") return { ...s, value: Math.max(0, s.value - 1) };
      if (s.label === "Active Events") return{ ...s, value: Math.max(0, s.value - 1) };
      return s;
    }));

    setIsWarningOpen(false);
    setEventToDelete(null);
  } catch (error) {
    console.error('Error deleting event:', error);
    showToast(error?.message || 'Failed to delete event. Please try again.', "error");
  }
};

  const cancelDelete = () => {
    setIsWarningOpen(false);
    setEventToDelete(null);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const dash = await fetchMyOrgDashboard();
        setOrg(dash.org);

        const allEvents = [
          ...(dash.upcomingEvents || []),
          ...(dash.pastEvents || [])
        ];

        setEvents(allEvents);

        setStats([
          { label: "Total Followers", value: dash.followerCount ?? 0 },
          { label: "Total Events", value: dash.totals?.events ?? allEvents.length },
          { label: "Active Events", value: dash.upcomingEvents?.length ?? 0 },
        ]);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError(err?.message || "Failed to load dashboard.");
        setOrg(null);
        setEvents([]);
        setStats([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const now = new Date();
  const filteredEvents = tab === "upcoming"
    ? (events.filter(e => new Date(e.date) >= now))
    : (events.filter(e => new Date(e.date) < now));

  const hasOpenEvents = filteredEvents.some(e => new Date(e.date) > now);

  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  return (
    <section className="od-container">
      <h1 className="od-title">{org ? `${org.name}'s Dashboard` : "My Dashboard"}</h1>
      <p className="od-subtitle">Manage your events, volunteers, and track your impact.</p>

      {loading && <p>Loading…</p>}
      {error && (
        <p style={{ color: "red", marginTop: 8 }}>
          {error} {error.toLowerCase().includes("unauthorized") && (<a href="/login">Login</a>)}
        </p>
      )}

      {/* Tabs */}
      <div className="od-tabs">
        <button
          className={`od-tab ${tab === "upcoming" ? "active" : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`od-tab ${tab === "past" ? "active" : ""}`}
          onClick={() => setTab("past")}
        >
          Past Events
        </button>
      </div>

      <section className="od-section">
        <table className="od-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Participants</th>
              <th>Status</th>
              {hasOpenEvents && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((e) => {
              const isOpen = new Date(e.date) > now;
              return (
                <tr key={e._id}>
                  <td><a href={`event/${e._id}`}>{e.name}</a></td>
                  <td>{fmt(e.date)}</td>
                  <td>{e.venue}</td>
                  <td>{e.totalAttending}</td>
                  <td>
                    <span className={`od-status ${isOpen ? "open" : "closed"}`}>
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  </td>
                  {isOpen && hasOpenEvents && (
                    <td>
                      <button 
                        className="secondary-btn od-small-btn "
                        onClick={() => { if (isOpen) navigate(`/edit-event/${e._id}`); }}
                      >
                        Edit
                      </button>
                      
                      <button 
                        className="red-btn od-small-btn "
                        onClick={() => { handleDelete(e._id) }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {!loading && !error && filteredEvents.length === 0 && (
              <tr>
                <td colSpan={hasOpenEvents ? 6 : 5} style={{ opacity: 0.7, textAlign: "center" }}>
                  No {tab === "upcoming" ? "upcoming" : "past"} events.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="primary-btn od-create-btn" onClick={handleCreateEvent}>Create New Event</button>
      </section>

      {/* Analytics */}
      <section className="od-section">
        <h3 className="od-heading">Key Analytics</h3>
        <div className="od-stats">
          {stats.map((s, i) => (
            <div key={i} className="od-stat-card">
              <div className="od-stat-value">{s.value}</div>
              <div className="od-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <Warning
        isOpen={isWarningOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this event? This action is non-reversible"
      />
    </section>
  );
}
