import React, { useState } from "react";
import "../styles/Settings.css";

export default function Settings() {
  const [tab, setTab] = useState("account");

  return (
    <main className="set-container">
      {/* Tabs */}
      <nav className="set-tabs">
        {["account", "notifications", "security", "delete"].map((t) => (
          <button
            key={t}
            className={`set-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "account" ? "Account" :
             t === "notifications" ? "Notifications" :
             t === "security" ? "Security" : "Delete Account"}
          </button>
        ))}
      </nav>

      <h1 className="set-title">Account Settings</h1>

      {/* ACCOUNT -------------------------------------------------------- */}
      {tab === "account" && (
        <section className="set-section">
          <h3 className="set-subtitle">Profile Information</h3>

          <label className="set-label">Name</label>
          <input className="set-input" placeholder="Enter  name" />

          <label className="set-label">Username</label>
          <input className="set-input" placeholder="Enter  username" />

          <label className="set-label">Email</label>
          <input type="email" className="set-input" placeholder="Enter  email" />

          <div className="set-row">
            <button className="secondary-btn set-btn">Update Profile</button>
            <button className="black-btn set-btn">Log Out</button>
          </div>

          <h3 className="set-subtitle">Linked Accounts</h3>
          <div className="set-linked">
            <div className="set-linked-item">
              <span className="set-linked-icon">🔗</span>
              <span>Connect with Facebook</span>
              <button className="secondary-btn set-mini">Connect</button>
            </div>
            <div className="set-linked-item">
              <span className="set-linked-icon">🔗</span>
              <span>Connect with Twitter</span>
              <button className="secondary-btn set-mini">Connect</button>
            </div>
          </div>
        </section>
      )}

      {/* NOTIFICATIONS -------------------------------------------------- */}
      {tab === "notifications" && (
        <section className="set-section">
          <h3 className="set-subtitle">Notification Settings</h3>

          <label className="set-check">
            <input type="checkbox" /> Receive email notifications for new messages
          </label>
          <label className="set-check">
            <input type="checkbox" /> Receive push notifications for event updates
          </label>
          <label className="set-check">
            <input type="checkbox" /> Receive in-app notifications for activity
          </label>

          <button className="primary-btn set-btn">Save Notification Preferences</button>
        </section>
      )}

      {/* SECURITY ------------------------------------------------------- */}
      {tab === "security" && (
        <section className="set-section">
          <h3 className="set-subtitle">Security</h3>

          <label className="set-label">Current Password</label>
          <input type="password" className="set-input" placeholder="Enter  current password" />

          <label className="set-label">New Password</label>
          <input type="password" className="set-input" placeholder="Enter  new password" />

          <label className="set-label">Confirm New Password</label>
          <input type="password" className="set-input" placeholder="Confirm  new password" />

          <button className="primary-btn set-btn">Change Password</button>
        </section>
      )}

      {/* DELETE --------------------------------------------------------- */}
      {tab === "delete" && (
        <section className="set-section">
          <h3 className="set-subtitle">Delete Account</h3>
          <p className="set-note">
            Deleting your account is permanent and cannot be undone. All your data,
            including events, donations, and personal information, will be permanently removed.
          </p>
          <button className="set-danger">Delete Account</button>
        </section>
      )}
    </main>
  );
}
