import React from "react";
import "../styles/EventCard.css";
import { useNavigate } from 'react-router-dom';

function EventCard({ title, description, image, eventId }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="event-card">
      <div className="event-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <button href={`/event/${eventId}`} className="secondary-btn" onClick={handleClick}>Learn More/Volunteer</button>
      </div>
      <img src={image} alt={title} />
    </div>
  );
}

export default EventCard;
