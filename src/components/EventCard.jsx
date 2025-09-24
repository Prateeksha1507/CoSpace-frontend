import React from "react";
import "../styles/EventCard.css";

function EventCard({ title, description, image }) {
  return (
    <div className="event-card">
      <div className="event-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="secondary-btn">Learn More/Volunteer</button>
      </div>
      <img src={image} alt={title} />
    </div>
  );
}

export default EventCard;
