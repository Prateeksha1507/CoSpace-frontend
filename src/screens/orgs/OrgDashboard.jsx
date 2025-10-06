import React, { useEffect, useState } from "react";
import "../../styles/org/OrgDashboard.css";
import { fetchOrgDashboardData } from "../../api/orgAPI";

export default function OrgDashboard() {
  const [tab, setTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [org, setOrg] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { org, events, stats } = await fetchOrgDashboardData();
        setOrg(org);
        setEvents(events);
        setStats(stats);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    }
    loadData();
  }, []);

  const filteredEvents =
    tab === "upcoming"
      ? events.filter(e => new Date(e.date) >= new Date())
      : events.filter(e => new Date(e.date) < new Date());

  return (
    <main className="od-container">
      <h1 className="od-title">{org ? `${org.name} Dashboard` : "Organization Dashboard"}</h1>
      <p className="od-subtitle">Manage your events, volunteers, and track your impact.</p>

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
            {filteredEvents.map((e, i) => (
              <tr key={i}>
                <td>{e.name}</td>
                <td>{e.date}</td>
                <td>{e.venue}</td>
                <td>{e.totalAttending}</td>
                <td>
                  <span
                    className={`od-status ${
                      new Date(e.date) > new Date() ? "open" : "closed"
                    }`}
                  >
                    {new Date(e.date) > new Date() ? "Open" : "Closed"}
                  </span>
                </td>
                <td>
                  <button className="secondary-btn od-small-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="primary-btn od-create-btn">Create New Event</button>
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
