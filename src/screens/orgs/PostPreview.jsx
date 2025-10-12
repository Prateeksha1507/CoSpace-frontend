import React from "react";
import "../../styles/org/PostPreview.css";

/**
 * Pass event data via props OR route state.
 * If nothing is passed, it falls back to sample content.
 */
export default function PostPreview({ data }) {
  const event = data || {
    banner: "/images/preview-banner.jpg",
    title: "Community Cleanup Drive",
    description:
      "Join us for a community cleanup drive at Central Park. We’ll be picking up litter, planting trees, and making our park a cleaner, greener space for everyone. All volunteers are welcome!",
    date: "July 20, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "Central Park, New York",
    roles: "Cleanup Crew, Tree Planters, Event Coordinators",
    goal: "$500",
  };

  const handlePublish = () => {
    // Wire this to your publish API
    alert(`Event published! Preview:\n${JSON.stringify(
        { ...form, image: form.image ? form.image.name : null },
        null,
        2
      )}`);
  };

  return (
    <main className="pp-container">
      {/* Banner */}
      <div className="pp-banner-wrap">
        <img src={event.banner} alt="Event banner" className="pp-banner" />
      </div>

      {/* Title + description */}
      <h1 className="pp-title">{event.title}</h1>
      <p className="pp-desc">{event.description}</p>

      {/* Event details */}
      <section className="pp-section">
        <h3 className="pp-section-heading">Event Details</h3>
        <div className="pp-details-grid">
          <div className="pp-detail">
            <span className="pp-label">Date</span>
            <span className="pp-value">{event.date}</span>
          </div>
          <div className="pp-detail">
            <span className="pp-label">Time</span>
            <span className="pp-value">{event.time}</span>
          </div>
          <div className="pp-detail">
            <span className="pp-label">Location</span>
            <span className="pp-value">{event.location}</span>
          </div>
          <div className="pp-detail">
            <span className="pp-label">Volunteer Roles</span>
            <span className="pp-value">{event.roles}</span>
          </div>
          <div className="pp-detail">
            <span className="pp-label">Donation Goal</span>
            <span className="pp-value">{event.goal}</span>
          </div>
        </div>
      </section>

      {/* Collaborators */}
      <section className="pp-section">
        <h3 className="pp-section-heading">Collaborators</h3>
        <label className="pp-collab-label">Collaborator Email/Organization Name</label>
        <input
          className="pp-input"
          placeholder="Enter  email or organization name"
          type="text"
        />
      </section>

      {/* Actions */}
      <div className="pp-actions">
        <a href="/create-event" className="secondary-btn ep-btn">Edit</a>
        <button onClick={handlePublish} className="primary-btn ep-btn">Publish</button>
      </div>
    </main>
  );
}
