import React from "react";
import Avatar from "./Avatar.jsx";
import "../styles/EventDetails.css";
import { useNavigate } from "react-router-dom";

export default function EventSection({
  banner,
  name,
  orgProfilePicture,
  orgName,
  orgType,
  date,
  isVirtual,
  venue,
  description,
  skills = [],
  clickable = true,
  orgId,
}) {
    const navigate = useNavigate();
    const handleClick = () => {
      navigate(`/profile/org/${orgId}`);
    };

  return (
    <main className="ed-container">
      {/* Banner */}
      <img
        src={banner || "/default-event.jpg"}
        alt="Event banner"
        className="ed-banner"
      />

      {/* Title */}
      <h1 className="ed-title">{name}</h1>

      {/* Organization Info */}
      {orgName && (
        <div className={`ed-org ${clickable ? "clickable" : ""}`}>
          <Avatar
            src={orgProfilePicture}
            alt={orgName}
            className="ed-org-logo"
          />
          {clickable ? (
            <div onClick={handleClick} className="clickable">
              <p className="ed-org-name">{orgName}</p>
              <p className="ed-org-type">{orgType}</p>
            </div>
          ) : (
            <div>
              <p className="ed-org-name">{orgName}</p>
              <p className="ed-org-type">{orgType}</p>
            </div>
          )}
        </div>
      )}

      {/* Event Details */}
      <section className="ed-section">
        <h3 className="ed-heading">Event Details</h3>
        <div className="ed-details-grid">
          <div>
            <span className="ed-label">Date</span>
            <span className="ed-value">{date}</span>
          </div>
          <div>
            <span className="ed-label">Venue</span>
            {isVirtual ? (
              <span className="ed-value">Virtual Event</span>
            ) : (
              <span className="ed-value">{venue || "Not specified"}</span>
            )}
          </div>
        </div>
      </section>

      {/* Map / Virtual Info */}
      <div className="ed-map">
        {isVirtual ? (
          <div className="ed-virtual-box">
            <h3>Virtual Event</h3>
            {venue ? (
              <p>
                Join link:{" "}
                <a
                  href={venue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-virtual-link"
                >
                  {venue}
                </a>
              </p>
            ) : (
              <p>
                This is a virtual event. The organizer will share a meeting link
                soon.
              </p>
            )}
          </div>
        ) : (
          <iframe
            title="Event location"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: "8px" }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              venue
            )}&output=embed`}
          ></iframe>
        )}
      </div>

      {/* Description */}
      <p className="ed-desc">{description}</p>

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="ed-section">
          <h3 className="ed-heading">Required Skills</h3>
          <div className="ed-tags">
            {skills.map((s, i) => (
              <span key={i} className="ed-tag">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="ed-actions">
        <button className="secondary-btn" disabled={!clickable}>
          Volunteer
        </button>
        <button className="primary-btn" disabled={!clickable}>
          Donate
        </button>
        <button className="secondary-btn" disabled={!clickable}>
          Participate
        </button>
      </div>
    </main>
  );
}
