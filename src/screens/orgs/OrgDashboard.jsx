import React, { useEffect, useState } from "react";
import "../../styles/org/OrgDashboard.css";
import { fetchMyOrgDashboard, fetchMyOrgEvents } from "../../api/orgAPI";
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        // 1) Dashboard bundle for meta + followerCount/totals
        // 2) Paged events for the table (you can raise limit as needed)
        const [dash, evPage] = await Promise.all([
          fetchMyOrgDashboard(),                                  // -> { org, followerCount, totals: { events, followers }, upcomingEvents }
          fetchMyOrgEvents({ sort: "date:asc", page: 1, limit: 200 }) // -> { items, page, total, ... }
        ]);

        const items = Array.isArray(evPage?.items) ? evPage.items : [];
        setOrg(dash.org);

        // Build the stats array your UI expects
        const today = new Date();
        const activeCount = items.filter(e => new Date(e.date) >= today).length;

        setStats([
          { label: "Total Followers", value: dash.followerCount ?? 0 },
          { label: "Total Events", value: dash.totals?.events ?? items.length },
          { label: "Active Events", value: activeCount },
        ]);

        setEvents(items);
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
  const filteredEvents =
    tab === "upcoming"
      ? events.filter(e => new Date(e.date) >= now)
      : events.filter(e => new Date(e.date) < now);

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
    <main className="od-container">
      <h1 className="od-title">{org ? `${org.name} Dashboard` : "Organization Dashboard"}</h1>
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

      {/* Events */}
      <section className="od-section">
        <table className="od-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((e) => {
              const isOpen = new Date(e.date) > now;
              return (
                <tr key={e.eventId}>
                  <td><a href={`event/${e.eventId}`}>{e.name}</a></td>
                  <td>{fmt(e.date)}</td>
                  <td>{e.venue}</td>
                  <td>{e.totalAttending}</td>
                  <td>
                    <span className={`od-status ${isOpen ? "open" : "closed"}`}>
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td>
                    <button className="secondary-btn od-small-btn">Edit</button>
                  </td>
                </tr>
              );
            })}
            {!loading && !error && filteredEvents.length === 0 && (
              <tr>
                <td colSpan={6} style={{ opacity: 0.7, textAlign: "center" }}>
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
    </main>
  );
}
