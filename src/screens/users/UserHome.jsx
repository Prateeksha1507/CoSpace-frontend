import React, { useEffect, useState } from "react";
import "../../styles/Home.css";
import EventCard from "../../components/EventCard";
import { fetchAllEvents } from "../../api/eventAPI";

function UserHome() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const result = await fetchAllEvents();
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
            Join a vibrant network of organizations and individuals dedicated to making a difference.
            Post events, volunteer your time, or donate to causes you care about.
          </p>
          <div className="hero-actions">
            <a href="/my-profile" className="primary-btn">
              Check your profile
            </a>
            <a className="secondary-btn" onClick={handleScroll}>
              Find Opportunities
            </a>
          </div>
        </div>
        <div className="hero-art" aria-hidden />
      </section>

      <section style={{ padding: "40px 20px" }} id="event-section">
        <h2>Upcoming Events</h2>

        <div className="filters">
          <select>
            <option>Category</option>
          </select>
          <select>
            <option>Date</option>
          </select>
          <select>
            <option>Location</option>
          </select>
        </div>

        <div className="events">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.name}
              description={event.description}
              image="/event-image.png"
              eventId={event._id}
            />
          ))}
          {events.length === 0 && <p>No upcoming events available.</p>}
        </div>
      </section>
    </div>
  );
}

export default UserHome;
