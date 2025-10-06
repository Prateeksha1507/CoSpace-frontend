import React, { useEffect, useState } from "react";
import "../../styles/Home.css";
import EventCard from "../../components/EventCard";
import { fetchOrgEvents } from "../../api/orgAPI.js";

function OrgHome() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const result = await fetchOrgEvents();
      setEvents(result);
    }
    loadEvents();
  }, []);

  const handleScroll = () => {
    const section = document.getElementById("event-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Connect, Contribute, and Create Change</h1>
          <p>
            Reach volunteers, manage your events, and build your organization’s impact.
            Post new events, view analytics, and connect with contributors.
          </p>
          <div>
            <a href="/create-event" className="primary-btn">Post an Event</a>
            <a href="/dashboard" className="secondary-btn">See Dashboard</a>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 20px" }} id="event-section">
        <h2>Upcoming Events</h2>

        <div className="filters">
          <select><option>Category</option></select>
          <select><option>Date</option></select>
          <select><option>Location</option></select>
        </div>

        <div className="events">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.name}
              description={event.description}
              image="/event-image.png"
              eventId={event.eventId}
            />
          ))}
          {events.length === 0 && (
            <p style={{ opacity: 0.7 }}>You haven’t created any events yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default OrgHome;
