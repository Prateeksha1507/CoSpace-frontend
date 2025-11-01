import React, { useEffect, useState } from "react";
import "../../styles/Home.css";
import EventCard from "../../components/EventCard";
import { fetchMyOrgEvents } from "../../api/orgAPI";  // no token param needed

function OrgHome() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        // Already resolves current org from cospace_auth_token via authAPI.verify()
        const { items } = await fetchMyOrgEvents({ sort: "date:asc", page: 1, limit: 20 });
        setEvents(items || []);
      } catch (e) {
        setEvents([]);
        setError(e?.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Connect, Contribute, and Create Change</h1>
          <p>
            Reach volunteers, manage your events, and build your organization’s impact.
            Post new events, view analytics, and connect with contributors.
          </p>
          <div className="hero-actions">
            <a href="/create-event" className="primary-btn">Post an Event</a>
            <a href="/dashboard" className="secondary-btn">See Dashboard</a>
          </div>
        </div>
        <div className="hero-art" aria-hidden />
      </section>

      {/* <section style={{ padding: "40px 20px" }} id="event-section">
        <h2>Upcoming Events</h2>

        <div className="filters">
          <select><option>Category</option></select>
          <select><option>Date</option></select>
          <select><option>Location</option></select>
        </div>

        {loading && <p>Loading events...</p>}

        {error && (
          <div className="error">
            <p style={{ color: "red", marginBottom: 8 }}>{error}</p>
            <a href="/login" className="secondary-btn">Login as Organization</a>
          </div>
        )}

        <div className="events">
          {events.map((event) => (
            <EventCard
              key={event.eventId}
              title={event.name}
              description={event.description}
              image="/event-image.png"
              eventId={event.eventId}
            />
          ))}

          {!loading && !error && events.length === 0 && (
            <p style={{ opacity: 0.7 }}>You haven’t created any events yet.</p>
          )}
        </div>
      </section>  */}


    </div>
  );
}

export default OrgHome;
