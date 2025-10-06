import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/UserProfile.css";

// dummy backend accessors — adjust the import path if your db file lives elsewhere
import { getUserById, getFollows, getEvents } from "../dummy/db";

function formatDateISOToNice(iso) {
  // iso may be YYYY-MM-DD (from seed), make it nice
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function UserProfilePage() {
  const { id } = useParams();            // /user/:id
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const u = getUserById(id);
    if (!u) setNotFound(true);
    else setUser(u);
  }, [id]);

  // Volunteering = events hosted by orgs this user follows
  const volunteering = useMemo(() => {
    if (!user) return [];
    const followingOrgIds = getFollows()
      .filter(f => f.userId === Number(user.userId))
      .map(f => f.orgId);

    const eventsIMightAttend = getEvents().filter(e => followingOrgIds.includes(e.conductingOrgId));

    // give each event a demo "hours" value (or derive from somewhere else later)
    return eventsIMightAttend.map(e => ({
      event: e.name,
      date: formatDateISOToNice(e.date),
      hours: 3, // simple demo number
    }));
  }, [user]);

  // Donations (dummy list for now)
  const donations = useMemo(() => {
    if (!user) return [];
    return [
      { amount: 250, date: "Aug 10, 2024", receiptUrl: "#" },
      { amount: 250, date: "Jul 5, 2024", receiptUrl: "#" },
    ];
  }, [user]);

  if (notFound) {
    return (
      <main className="user-container">
        <div className="user-card" style={{ padding: 24, textAlign: "center" }}>
          <h2>User not found</h2>
          <p>We couldn’t find a profile for ID <strong>{id}</strong>.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <div className="user-loading">Loading profile…</div>;
  }

  return (
    <main className="user-container">
      {/* Identity */}
      <section className="user-identity">
        {/* Use your own avatar path or add an avatar field in seedData later */}
        <img className="user-avatar" src={"person.png"} alt={user.name} />
        <h2 className="user-name">{user.name}</h2>
        <p className="user-role">Community Volunteer</p>
      </section>

      {/* KPIs */}
      <section className="user-kpis">
        <div className="user-kpi">
          <div className="user-kpi-value">{volunteering.length * 3}</div>
          <div className="user-kpi-label">Total Volunteering Hours</div>
        </div>
        <div className="user-kpi">
          <div className="user-kpi-value">$500</div>
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
                <tr key={`${v.event}-${i}`}>
                  <td>{v.event}</td>
                  <td className="user-muted">{v.date}</td>
                  <td>{v.hours}</td>
                </tr>
              ))}
              {volunteering.length === 0 && (
                <tr>
                  <td colSpan="3" className="user-muted">No volunteering history yet.</td>
                </tr>
              )}
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
                <tr key={`${d.date}-${i}`}>
                  <td className="user-amount">${d.amount}</td>
                  <td className="user-muted">{d.date}</td>
                  <td className="user-right">
                    <a className="user-receipt-btn primary-btn" href={d.receiptUrl}>
                      Download Receipt
                    </a>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan="3" className="user-muted">No donations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
