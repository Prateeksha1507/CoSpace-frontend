import React from "react";
import Avatar from "../components/avatar.jsx";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString();
}

/**
 * Props:
 *  - user: { name, bio, profilePicture }
 *  - stats: { attendedCount, volunteeredCount, totalDonations }
 *  - activeTab: 'attends' | 'volunteers' | 'donations'
 *  - onTabChange: (tab) => void
 *  - attending: [{ id, name, date }]
 *  - volunteering: [{ id, name, date, status }]
 *  - donations: [{ event/name, amount, date, receiptUrl }]
 */
export default function UserProfileView({
  user,
  stats,
  activeTab,
  onTabChange,
  attending = [],
  volunteering = [],
  donations = [],
}) {
    // console.log(stats)
    // console.log(volunteering)
    // alert(stats)
  const handleKpiKey = (e, tab) => {
    if (e.key === "Enter" || e.key === " ") onTabChange(tab);
  };

  return (
    <section className="user-container">
      {/* Header */}
      <section className="user-identity">
        <Avatar src={user?.profilePicture} backup={user?._id} />
        <h2 className="user-name">{user?.name}</h2>
        <p className="user-role">{user?.bio}</p>

        {user?.interests?.length > 0 && (
          <div className="user-interests">
            {user.interests.map((interest, index) => (
              <span key={index} className="interest-badge">{interest}</span>
            ))}
          </div>
        )}

      </section>

      {/* KPIs */}
      <section className="user-kpis">
        <div
          className="user-kpi"
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onClick={() => onTabChange("attends")}
          onKeyDown={(e) => handleKpiKey(e, "attends")}
        >
          <div className="user-kpi-value">{stats?.attendedCount ?? 0}</div>
          <div className="user-kpi-label">Total Attended Events</div>
        </div>
        <div
          className="user-kpi"
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onClick={() => onTabChange("volunteers")}
          onKeyDown={(e) => handleKpiKey(e, "volunteers")}
        >
          <div className="user-kpi-value">{stats?.volunteeredCount ?? 0}</div>
          <div className="user-kpi-label">Total Volunteering Events</div>
        </div>
        <div
          className="user-kpi"
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onClick={() => onTabChange("donations")}
          onKeyDown={(e) => handleKpiKey(e, "donations")}
        >
          <div className="user-kpi-value">
            ₹{Number(stats?.totalDonations/100 ?? 0).toLocaleString()}
          </div>
          <div className="user-kpi-label">Total Donations</div>
        </div>
      </section>

      {/* Body */}
      <section className="user-section">
        {activeTab === "attends" && (
          <>
            <h3 className="user-section-title">Attending Events</h3>
            <div className="user-card">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(attending || []).map((a, i) => (
                    <tr key={a.id || i}>
                      <td>
                        {a.id ? (
                          <a href={`/event/${a.id}`} className="user-link">
                            {a.name}
                          </a>
                        ) : (
                          a.name
                        )}
                      </td>
                      <td className="user-muted">{formatDate(a.date)}</td>
                    </tr>
                  ))}
                  {(!attending || attending.length === 0) && (
                    <tr>
                      <td colSpan="2" className="user-muted">
                        No attended events.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "volunteers" && (
          <>
            <h3 className="user-section-title">Volunteering Events</h3>
            <div className="user-card">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(volunteering || []).map((v, i) => (
                    <tr key={v.id || i}>
                      <td>                          
                        <a href={`/event/${v.id}`} className="user-link">
                            {v.name}
                          </a>
                      </td>
                      <td className="user-muted">{formatDate(v.date)}</td>
                      <td>
                        <span
                          className={`tag ${String(v.status || "pending")}`}
                          style={{
                            padding: "2px 8px",
                            borderRadius: 12,
                            textTransform: "capitalize",
                          }}
                        >
                          {String(v.status || "pending")}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!volunteering || volunteering.length === 0) && (
                    <tr>
                      <td colSpan="3" className="user-muted">
                        No volunteering events.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "donations" && (
<>
  <h3 className="user-section-title">Donation History</h3>
  <div className="user-card">
    <table className="user-table">
      <thead>
        <tr>
          <th>Event</th>
          <th>Amount</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {(donations || []).length > 0 ? (
          donations.map((d, i) => {
            const eventName =
              d?.event?.name || d?.eventName || d?.name || "—";
            const eventId = d?.event?._id || d?.eventId;
            const date =
              d?.date ||
              d?.createdAt ||
              d?.timestamp ||
              d?.updatedAt ||
              null;

            return (
              <tr key={d.id || d._id || i}>
                <td className="user-amount">
                  {eventId ? (
                    <a
                      href={`/event/${eventId}`}
                      className="user-link"
                      title="View event"
                    >
                      {eventName}
                    </a>
                  ) : (
                    eventName
                  )}
                </td>
                <td className="user-amount">
                  ₹{Number(d.amount/100 || 0).toLocaleString()}
                </td>
                <td className="user-muted">
                  {date ? formatDate(date) : "—"}
                </td>
                {/* <td className="user-right">
                  {d?.receiptUrl ? (
                    <a
                      className="user-receipt-btn primary-btn"
                      href={d.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Receipt
                    </a>
                  ) : (
                    "—"
                  )}
                </td> */}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="4" className="user-muted">
              No donation records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</>

        )}
      </section>
    </section>
  );
}
