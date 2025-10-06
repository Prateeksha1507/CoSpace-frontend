import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/EventDetails.css";
import { fetchEventById } from "../api/eventAPI";
import { getOrgById } from "../dummy/db"; // to fetch org info linked with event

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [org, setOrg] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      const data = await fetchEventById(id);
      if (!data) return;

      setEvent(data);
      const orgInfo = getOrgById(data.conductingOrgId);
      setOrg(orgInfo);
    }
    loadEvent();
  }, [id]);

  if (!event) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading event...</p>;
  }

  const comments = [
    {
      name: "Olivia Carter",
      time: "2 weeks ago",
      text: "I’m excited to participate! Is there a specific meeting point within the venue?",
      avatar: "/images/olivia.png",
    },
    {
      name: "Liam Harper",
      time: "1 week ago",
      text: "Can we bring our own gloves and trash bags?",
      avatar: "/images/liam.png",
    },
  ];

  return (
    <main className="ed-container">
      {/* Banner */}
      <img src="/images/cleanup-banner.jpg" alt="Event banner" className="ed-banner" />

      {/* Title + org */}
      <h1 className="ed-title">{event.name}</h1>
      {org && (
        <div className="ed-org">
          <img
            src="/images/helpinghands.png"
            alt={org.name}
            className="ed-org-logo"
          />
          <div>
            <p className="ed-org-name">{org.name}</p>
            <p className="ed-org-type">{org.type}</p>
          </div>
        </div>
      )}

      {/* Details */}
      <section className="ed-section">
        <h3 className="ed-heading">Event Details</h3>
        <div className="ed-details-grid">
          <div>
            <span className="ed-label">Date</span>
            <span className="ed-value">{event.date}</span>
          </div>
          <div>
            <span className="ed-label">Venue</span>
            <span className="ed-value">{event.venue}</span>
          </div>
        </div>
      </section>

      {/* Map */}
      <div className="ed-map">
        <iframe
          title="Event location"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "8px" }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(event.venue)}&output=embed`}
        ></iframe>
      </div>

      {/* Description */}
      <p className="ed-desc">{event.description}</p>

      {/* Skills (optional, dummy placeholder) */}
      <section className="ed-section">
        <h3 className="ed-heading">Required Skills</h3>
        <div className="ed-tags">
          {["Teamwork", "Communication", "Time Management"].map((s, i) => (
            <span key={i} className="ed-tag">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="ed-actions">
        <button className="secondary-btn">Volunteer</button>
        <button className="primary-btn">Donate</button>
        <button className="secondary-btn">Participate</button>
      </div>

      {/* Comments */}
      <section className="ed-section">
        <h3 className="ed-heading">Comments & FAQs</h3>
        <div className="ed-comments">
          {comments.map((c, i) => (
            <div key={i} className="ed-comment">
              <img src={c.avatar} alt={c.name} className="ed-avatar" />
              <div>
                <p className="ed-comment-meta">
                  <strong>{c.name}</strong> <span>{c.time}</span>
                </p>
                <p className="ed-comment-text">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
