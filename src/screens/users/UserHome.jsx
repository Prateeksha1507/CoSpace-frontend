import React from "react";
import "../../styles/Home.css"
import EventCard from "../../components/EventCard";

const events = [
  {
    title: "Community Cleanup at Central Park",
    description:
      "Join Green Earth Initiative for a park cleanup event. Help us remove litter and maintain the beauty of Central Park.",
    image: "/event-image.png",
    eventId: "abcdefgh"
  },
  {
    title: "Educational Workshop on Sustainable Living",
    description:
      "Attend an informative workshop hosted by EcoMind on sustainable practices for everyday life.",
    image: "/event-image.png",
    eventId: "abcdefgh"
  },
  {
    title: "Social Gathering for Mental Health Awareness",
    description:
      "Connect with others and support mental health awareness at this social event organized by Mindful Hearts.",
    image: "/event-image.png",
    eventId: "abcdefgh"
  },
  {
    title: "Fundraising Run for Children’s Hospital",
    description:
      "Participate in a charity run to raise funds for the local Children's Hospital, organized by Hope Runners.",
    image: "/event-image.png",
    eventId: "abcdefgh"
  },
  {
    title: "Environmental Conservation Hike",
    description:
      "Explore nature and contribute to conservation efforts with this hike organized by Nature Guardians.",
    image: "/event-image.png",
    eventId: "abcdefgh"
  },
];

function UserHome() {
  const handleScroll = () => {
    const section = document.getElementById('event-section');
    section?.scrollIntoView({ behavior: 'smooth' }); // smooth scroll!
  };

  return (
    <div className="page-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Connect, Contribute, and Create Change</h1>
          <p>
            Join a vibrant network of organizations and individuals dedicated to making a difference. Post events, volunteer your time, or donate to causes you care about.
          </p>
          <div>
            <a href="/my-profile" className="primary-btn">Check your profile</a>
            <button className="secondary-btn" onClick={handleScroll}>Find Opportunities</button>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 20px" }} id="event-section">
        <h2>
          Upcoming Events
        </h2>
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
              title={event.title}
              description={event.description}
              image={event.image}
              eventId={event.eventId}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default UserHome;
