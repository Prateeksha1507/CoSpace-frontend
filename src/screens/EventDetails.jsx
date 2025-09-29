import React from "react";
import "../styles/EventDetails.css";

export default function EventDetails() {
  const event = {
    banner: "/images/cleanup-banner.jpg",
    orgLogo: "/images/helpinghands.png",
    orgName: "Helping Hands Foundation",
    orgType: "Non-profit organization",
    title: "Community Cleanup Drive",
    date: "Saturday, July 20, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "Central Park, New York, NY",
    description:
      "Join us for a community cleanup drive to help keep our neighborhood clean and green. We’ll provide all the necessary supplies, including gloves and trash bags. Your participation will make a big difference!",
    skills: ["Teamwork", "Communication", "Physical Stamina"],
    mapUrl:
      "https://maps.googleapis.com/maps/api/staticmap?center=Central+Park,NY&zoom=13&size=600x300&key=YOUR_API_KEY", // or embed an <iframe>
  };

  const comments = [
    {
      name: "Olivia Carter",
      time: "2 weeks ago",
      text: "I’m excited to participate! Is there a specific meeting point within Central Park?",
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
      <img src={event.banner} alt="Event banner" className="ed-banner" />

      {/* Title + org */}
      <h1 className="ed-title">{event.title}</h1>
      <div className="ed-org">
        <img src={event.orgLogo} alt={event.orgName} className="ed-org-logo" />
        <div>
          <p className="ed-org-name">{event.orgName}</p>
          <p className="ed-org-type">{event.orgType}</p>
        </div>
      </div>

      {/* Details */}
      <section className="ed-section">
        <h3 className="ed-heading">Event Details</h3>
        <div className="ed-details-grid">
          <div>
            <span className="ed-label">Date</span>
            <span className="ed-value">{event.date}</span>
          </div>
          <div>
            <span className="ed-label">Time</span>
            <span className="ed-value">{event.time}</span>
          </div>
          <div>
            <span className="ed-label">Location</span>
            <span className="ed-value">{event.location}</span>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.9856488626455!2d-73.96535528459485!3d40.78286444130033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f5c0b1a5f%3A0xd8d5c6b6b8d2d9a5!2sCentral%20Park!5e0!3m2!1sen!2sus!4v1671234567890"
        ></iframe>
      </div>

      {/* Description */}
      <p className="ed-desc">{event.description}</p>

      {/* Skills */}
      <section className="ed-section">
        <h3 className="ed-heading">Required Skills</h3>
        <div className="ed-tags">
          {event.skills.map((s, i) => (
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
