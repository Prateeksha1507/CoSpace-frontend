import React, { useEffect, useState } from "react";
import "../../styles/UserProfile.css";
import { getUserById, getEvents, getFollows } from "../../dummy/db";
import { verify } from "../../api/authAPI";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [volunteering, setVolunteering] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Simulate logged-in user
    (async () => {
      const { user } = await verify(localStorage.getItem("auth_token"));
      if (user) {
        const u = getUserById(1); // replace with lookup by email later
        setUser(u);

        // Volunteering: user follows some orgs, show events by those orgs
        const following = getFollows().filter(f => f.userId === u.userId).map(f => f.orgId);
        const myEvents = getEvents().filter(e => following.includes(e.conductingOrgId));
        setVolunteering(
          myEvents.map(e => ({
            event: e.name,
            date: new Date(e.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            hours: Math.floor(Math.random() * 5) + 1, // demo value
          }))
        );

        // Fake donations list
        setDonations([
          { amount: 250, date: "Aug 10, 2024", receiptUrl: "#" },
          { amount: 250, date: "Jul 5, 2024", receiptUrl: "#" },
        ]);
      }
    })();
  }, []);

  if (!user) return <div className="user-loading">Loading profile...</div>;

  return (
    <main className="user-container">
      <section className="user-identity">
        <img className="user-avatar" src="/images/sophia.png" alt={user.name} />
        <h2 className="user-name">{user.name}</h2>
        <p className="user-role">Community Volunteer</p>
      </section>

      <section className="user-kpis">
        <div className="user-kpi">
          <div className="user-kpi-value">{volunteering.length * 4}</div>
          <div className="user-kpi-label">Total Volunteering Hours</div>
        </div>
        <div className="user-kpi">
          <div className="user-kpi-value">$500</div>
          <div className="user-kpi-label">Total Donations</div>
        </div>
      </section>

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
