import React from "react";
import "../styles/OrgProfile.css";

export default function OrgProfile() {
  const org = {
    name: "Helping Hands Foundation",
    type: "Non-profit organization",
    followers: "10K followers",
    logo: "/images/helpinghands.png",
    contact: "contact@helpinghands.org",
    website: "helpinghands.org",
    founded: "2010",
    about:
      "Helping Hands Foundation is dedicated to providing support and resources to underserved communities. Our mission is to empower individuals and families through education, healthcare, and sustainable development programs.",
  };

  const upcomingEvents = [
    {
      title: "Community Cleanup Drive",
      date: "July 20, 2024",
      desc: "Join us for a community cleanup drive to help keep our neighborhood clean and green. We’ll provide all the necessary supplies, including gloves and trash bags. Your participation will make a big difference!",
      mode: "In-person",
      image: "/images/cleanup.jpg",
    },
  ];

  const pastEvents = [
    {
      title: "Annual Charity Gala",
      date: "March 15, 2024",
      desc: "Our annual charity gala was a huge success, raising over $50,000 for our programs. Thank you to everyone who attended and supported our cause!",
      mode: "In-person",
      image: "/images/gala.jpg",
    },
    {
      title: "Back-to-School Supply Drive",
      date: "August 10, 2023",
      desc: "We collected and distributed school supplies to over 500 students in need, ensuring they have the tools they need to succeed in the upcoming school year.",
      mode: "In-person",
      image: "/images/school.jpg",
    },
  ];

  return (
    <main className="org-container">
      {/* Header */}
      <section className="org-header">
        <img src={org.logo} alt={org.name} className="org-logo" />
        <div className="org-info">
          <h2 className="org-name">{org.name}</h2>
          <p className="org-type">{org.type}</p>
          <p className="org-followers">{org.followers}</p>
        </div>
        <div className="org-actions">
          <button className="secondary-btn">Follow</button>
          <button className="primary-btn">Donate</button>
          <button className="secondary-btn">Chat with us</button>
        </div>
      </section>

      {/* Tabs */}
      <div className="org-tabs">
        <button className="org-tab active">About</button>
        <button className="org-tab">Events</button>
      </div>

      {/* About */}
      <section className="org-section">
        <h3>About</h3>
        <p>{org.about}</p>
        <div className="org-details">
          <p><strong>Contact</strong><br />{org.contact}</p>
          <p><strong>Website</strong><br />{org.website}</p>
          <p><strong>Founded</strong><br />{org.founded}</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="org-section">
        <h3>Upcoming Events</h3>
        {upcomingEvents.map((e, i) => (
          <div key={i} className="org-event">
            <div>
              <p className="org-event-mode">{e.mode}</p>
              <h4>{e.title}</h4>
              <p>{e.desc}</p>
              <button className="secondary-btn">View Details</button>
            </div>
            <img src={e.image} alt={e.title} className="org-event-img" />
          </div>
        ))}
      </section>

      {/* Past Events */}
      <section className="org-section">
        <h3>Past Events</h3>
        {pastEvents.map((e, i) => (
          <div key={i} className="org-event">
            <div>
              <p className="org-event-mode">{e.mode}</p>
              <h4>{e.title}</h4>
              <p>{e.desc}</p>
              <button className="secondary-btn">View Details</button>
            </div>
            <img src={e.image} alt={e.title} className="org-event-img" />
          </div>
        ))}
      </section>
    </main>
  );
}
