import React from "react";
import "../styles/UserProfile.css";

export default function UserProfile() {
  const volunteer = {
    name: "Sophia Bennett",
    role: "Community Volunteer",
    avatar: "/images/sophia.png", // replace with your asset
    totalHours: 150,
    totalDonations: 500,
  };

  const volunteering = [
    { event: "Community Cleanup Drive", date: "July 20, 2024", hours: 3 },
    { event: "Food Bank Assistance", date: "June 15, 2024", hours: 5 },
    { event: "Environmental Awareness Campaign", date: "May 5, 2024", hours: 4 },
  ];

  const donations = [
    { amount: 250, date: "August 10, 2024", receiptUrl: "#" },
    { amount: 250, date: "July 5, 2024", receiptUrl: "#" },
  ];

  return (
    <main className="user-container">
      {/* Header card */}
      <section className="user-identity">
        <img className="user-avatar" src={volunteer.avatar} alt={volunteer.name} />
        <h2 className="user-name">{volunteer.name}</h2>
        <p className="user-role">{volunteer.role}</p>
      </section>

      {/* KPI cards */}
      <section className="user-kpis">
        <div className="user-kpi">
          <div className="user-kpi-value">{volunteer.totalHours}</div>
          <div className="user-kpi-label">Total Volunteering Hours</div>
        </div>
        <div className="user-kpi">
          <div className="user-kpi-value">${volunteer.totalDonations}</div>
          <div className="user-kpi-label">Total Donations</div>
        </div>
      </section>

      {/* Volunteering History */}
      <section className="user-section">
        <h3 className="user-section-title">Volunteering History</h3>
        <div className="user-card">
          <table className="user-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Hours Contributed</th>
              </tr>
            </thead>
            <tbody>
              {volunteering.map((v, i) => (
                <tr key={i}>
                  <td>{v.event}</td>
                  <td className="user-muted">{v.date}</td>
                  <td>{v.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Donation History */}
      <section className="user-section">
        <h3 className="user-section-title">Donation History</h3>
        <div className="user-card">
          <table className="user-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d, i) => (
                <tr key={i}>
                  <td className="user-amount">${d.amount}</td>
                  <td className="user-muted">{d.date}</td>
                  <td className="user-right">
                    <a className="user-receipt-btn primary-btn" href={d.receiptUrl}>
                      Download Receipt
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
