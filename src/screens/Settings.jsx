import React, { useState } from "react";
import {
  Form,
  FormField,
  CheckboxField,
  Button,
  FormActions,
} from "../components/Form";
import "../styles/Settings.css";
import LogoutButton from "../components/Logout";

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
            {t === "account"
              ? "Account"
              : t === "notifications"
              ? "Notifications"
              : t === "security"
              ? "Security"
              : "Delete Account"}
          </button>
        ))}
      </nav>

      <h1 className="set-title">Account Settings</h1>

      {/* ACCOUNT -------------------------------------------------------- */}
      {tab === "account" && (
        <section className="set-section">
          <h3 className="set-subtitle">Profile Information</h3>

          <Form className="set-form" onSubmit={(e) => e.preventDefault()}>
            <FormField
              name="name"
              label="Name"
              placeholder="Enter name"
              required
            />
            <FormField
              name="username"
              label="Username"
              placeholder="Enter username"
              required
            />
            <FormField
              name="email"
              type="email"
              label="Email"
              placeholder="Enter email"
              required
            />

            <FormActions align="start" className="set-row">
              <Button variant="outline" className="secondary-btn set-btn">
                Update Profile
              </Button>
              <LogoutButton/>
            </FormActions>
          </Form>

          <h3 className="set-subtitle">Linked Accounts</h3>
          <div className="set-linked">
            <div className="set-linked-item">
              <span className="set-linked-icon">🔗</span>
              <span>Connect with Facebook</span>
              <Button variant="outline" className="secondary-btn set-mini">
                Connect
              </Button>
            </div>
            <div className="set-linked-item">
              <span className="set-linked-icon">🔗</span>
              <span>Connect with Twitter</span>
              <Button variant="outline" className="secondary-btn set-mini">
                Connect
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* NOTIFICATIONS -------------------------------------------------- */}
      {tab === "notifications" && (
        <section className="set-section">
          <h3 className="set-subtitle">Notification Settings</h3>

          <Form className="set-form" onSubmit={(e) => e.preventDefault()}>
            <CheckboxField
              name="emailNotify"
              label="Receive email notifications for new messages"
            />
            <CheckboxField
              name="pushNotify"
              label="Receive push notifications for event updates"
            />
            <CheckboxField
              name="appNotify"
              label="Receive in-app notifications for activity"
            />

            <FormActions align="start">
              <Button variant="primary" className="primary-btn set-btn">
                Save Notification Preferences
              </Button>
            </FormActions>
          </Form>
        </section>
      )}

      {/* SECURITY ------------------------------------------------------- */}
      {tab === "security" && (
        <section className="set-section">
          <h3 className="set-subtitle">Security</h3>

          <Form className="set-form" onSubmit={(e) => e.preventDefault()}>
            <FormField
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              required
            />
            <FormField
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              required
            />
            <FormField
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              required
            />

            <FormActions align="start">
              <Button variant="primary" className="primary-btn set-btn">
                Change Password
              </Button>
            </FormActions>
          </Form>
        </section>
      )}

      {/* DELETE --------------------------------------------------------- */}
      {tab === "delete" && (
        <section className="set-section">
          <h3 className="set-subtitle">Delete Account</h3>
          <p className="set-note">
            Deleting your account is permanent and cannot be undone. All your
            data, including events, donations, and personal information, will be
            permanently removed.
          </p>
          <Button variant="danger" className="set-danger">
            Delete Account
          </Button>
        </section>
      )}
    </main>
  );
}
