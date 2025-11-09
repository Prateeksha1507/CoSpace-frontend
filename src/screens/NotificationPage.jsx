import React from "react";
import "../styles/NotificationPage.css";

const notifications = [
  {
    icon: "📅",
    title: "Community Cleanup Drive - New Event",
    date: "July 20, 2024, 2:30 PM",
  },
  {
    icon: "✅",
    title: "Food Bank Assistance - Application Approved",
    date: "June 15, 2024, 10:00 AM",
  },
  {
    icon: "💬",
    title: "Environmental Awareness Campaign - Comment Received",
    date: "May 5, 2024, 5:45 PM",
  },
  {
    icon: "💲",
    title: "Donation Received - $100",
    date: "April 25, 2024, 11:15 AM",
  },
  {
    icon: "👤",
    title: "Volunteer Application - Ethan Carter",
    date: "March 10, 2024, 3:00 PM",
  },
  {
    icon: "📅",
    title: "Community Cleanup Drive - New Event",
    date: "February 1, 2024, 1:00 PM",
  },
  {
    icon: "✅",
    title: "Food Bank Assistance - Application Approved",
    date: "January 15, 2024, 10:00 AM",
  },
  {
    icon: "💬",
    title: "Environmental Awareness Campaign - Comment Received",
    date: "December 5, 2023, 5:45 PM",
  },
  {
    icon: "💲",
    title: "Donation Received - $100",
    date: "November 25, 2023, 11:15 AM",
  },
  {
    icon: "👤",
    title: "Volunteer Application - Ethan Carter",
    date: "October 10, 2023, 3:00 PM",
  },
];

export default function NotificationsPage() {
  return (
    <section className="notif-container">
      <h1 className="notif-title">Notifications</h1>
      <p className="notif-subtitle">
        Stay updated on events, volunteer opportunities, and donations.
      </p>

      <div className="notif-list">
        {notifications.map((n, idx) => (
          <div key={idx} className="notif-item">
            <div className="notif-left">
              <span className="notif-icon">{n.icon}</span>
              <div className="notif-texts">
                <p className="notif-title-text">{n.title}</p>
                <p className="notif-date">{n.date}</p>
              </div>
            </div>
            <span className="notif-check">✔</span>
          </div>
        ))}
      </div>
    </section>
  );
}
