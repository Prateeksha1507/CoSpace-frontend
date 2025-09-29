import React, { useState } from "react";
import "../../styles/org/OrgDashboard.css";

export default function OrgDashboard() {
  const [tab, setTab] = useState("upcoming");

  const events = [
    { name: "Community Cleanup Drive", date: "July 20, 2024", location: "Central Park", volunteers: 10, status: "Open" },
    { name: "Food Bank Assistance", date: "June 15, 2024", location: "Downtown Food Bank", volunteers: 15, status: "Open" },
    { name: "Environmental Awareness Campaign", date: "May 5, 2024", location: "City Hall", volunteers: 20, status: "Closed" },
  ];

  const applications = [
    { name: "Ethan Carter", event: "Community Cleanup Drive", date: "July 10, 2024", status: "Pending" },
    { name: "Olivia Harper", event: "Food Bank Assistance", date: "June 5, 2024", status: "Approved" },
    { name: "Liam Bennett", event: "Environmental Awareness Campaign", date: "April 25, 2024", status: "Rejected" },
  ];

  const stats = [
    { label: "Total Volunteers", value: "500" },
    { label: "Donations Received", value: "$10,000" },
    { label: "Event Reach", value: "2,500" },
  ];

  return (
    <main className="od-container">
      <h1 className="od-title">Organization Dashboard</h1>
      <p className="od-subtitle">Manage your events, volunteers, and track your impact.</p>

      {/* Tabs */}
      <div className="od-tabs">
        <button className={`od-tab ${tab === "upcoming" ? "active" : ""}`} onClick={() => setTab("upcoming")}>
          Upcoming Events
        </button>
        <button className={`od-tab ${tab === "past" ? "active" : ""}`} onClick={() => setTab("past")}>
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
              <th>Location</th>
              <th>Volunteers Needed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i}>
                <td>{e.name}</td>
                <td>{e.date}</td>
                <td>{e.location}</td>
                <td>{e.volunteers}</td>
                <td>
                  <span className={`od-status ${e.status.toLowerCase()}`}>{e.status}</span>
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

      {/* Volunteer Applications */}
      <section className="od-section">
        <h3 className="od-heading">Volunteer Applications</h3>
        <table className="od-table">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Event</th>
              <th>Application Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a, i) => (
              <tr key={i}>
                <td>{a.name}</td>
                <td className="od-link">{a.event}</td>
                <td>{a.date}</td>
                <td>
                  <span className={`od-status ${a.status.toLowerCase()}`}>{a.status}</span>
                </td>
                <td>
                  <button className="secondary-btn od-small-btn">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
