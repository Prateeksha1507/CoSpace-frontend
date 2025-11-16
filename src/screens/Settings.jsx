// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import {
  Form,
  FormField,
  CheckboxField,
  Button,
  FormActions,
  FileUploadField,
  SelectField,
} from "../components/Form";
import "../styles/Settings.css";
import LogoutButton from "../components/Logout";
import { getCurrentActorDocument } from "../api/authAPI";
import { updateMyProfile, deleteMyProfile } from "../api/authAPI";
import { showToast } from "../components/ToastContainer";

export default function Settings() {

  const ORG_TYPES = [
    { value: "", label: "Select organization type" },
    { value: "NGO", label: "NGO" },
    { value: "Govt", label: "Government" },
    { value: "Company", label: "Company" },
    { value: "Club", label: "Club / Society" },
    { value: "Other", label: "Other" },
  ];

  const [tab, setTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [isOrg, setIsOrg] = useState(false);

  const [account, setAccount] = useState({
    // common
    name: "",
    username: "",
    email: "", // display-only
    bio: "",
    mission: "",
    interests: "",
    profileImage: null,
    previewUrl: "",
    // org-only
    headName: "",
    website: "",
    regId: "",
    affiliation: "",
    orgType: "", // orgType
    upi: "",
  });

  const [notify, setNotify] = useState({
    emailNotify: false,
    pushNotify: false,
    appNotify: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const actor = await getCurrentActorDocument();
        if (!actor) return;

        const actorType = actor?.type || actor?.actorType; // be tolerant
        setIsOrg(actorType === "org");

        // normalize interests to CSV string for the input
        const interestsCsv = Array.isArray(actor?.interests)
          ? actor.interests.join(", ")
          : (actor?.interests || "");

        // accept a couple possible picture keys
        const pic =
          actor?.profilePicture ||
          actor?.profile_image ||
          actor?.avatarUrl ||
          "";

        setAccount((a) => ({
          ...a,
          name: actor?.name || "",
          username: actor?.username || "",
          email: actor?.email || "",
          bio: actor?.bio || "",
          mission: actor?.mission || "",
          interests: interestsCsv,
          previewUrl: pic,
          // org-only
          headName: actor?.headName || actor?.head_name || "",
          website: actor?.website || "",
          regId: actor?.regId || actor?.registrationId || "",
          affiliation: actor?.affiliation || "",
          orgType: actor?.orgType || actor?.typeLabel || "",
          upi: actor?.upi || "",
        }));
      } catch {
        // silent
      }
    })();
  }, []);

  const onAccountChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files?.[0] || null;
      setAccount((a) => ({
        ...a,
        profileImage: file,
        previewUrl: file ? URL.createObjectURL(file) : a.previewUrl,
      }));
    } else {
      setAccount((a) => ({ ...a, [name]: value }));
    }
  };

  const onNotifyChange = (e) => {
    const { name, checked } = e.target;
    setNotify((n) => ({ ...n, [name]: checked }));
  };

  const onSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity((s) => ({ ...s, [name]: value }));
  };

  async function handleAccountSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      // Split interests CSV into array (API accepts array or string; it will CSV it)
      const interestsArray = account.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: account.name,
        username: account.username,
        bio: account.bio,
        mission: account.mission,
        interests: interestsArray,
        // org-only fields go only if actor is org
        ...(isOrg && {
          headName: account.headName,
          website: account.website,
          regId: account.regId,
          affiliation: account.affiliation,
          orgType: account.orgType,
          upi: account.upi,
        }),
      };

      if (account.profileImage) payload.profileImage = account.profileImage;

      const updated = await updateMyProfile(payload);
      setMsg("Profile updated successfully.");

      const u = updated?.user || updated?.org || updated;
      if (u) {
        const newInterestsCsv = Array.isArray(u?.interests)
          ? u.interests.join(", ")
          : (u?.interests || account.interests);

        setAccount((a) => ({
          ...a,
          name: u.name ?? a.name,
          username: u.username ?? a.username,
          email: u.email ?? a.email, // display-only
          bio: u.bio ?? a.bio,
          mission: u.mission ?? a.mission,
          interests: newInterestsCsv,
          previewUrl: u.profilePicture || u.profile_image || a.previewUrl,
          // org-only
          headName: u.headName ?? a.headName,
          website: u.website ?? a.website,
          regId: u.regId ?? a.regId,
          affiliation: u.affiliation ?? a.affiliation,
          orgType: u.orgType ?? a.orgType,
          profileImage: null,
        }));
      }
    } catch (err) {
      showToast(err?.message || "Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSecuritySubmit(e) {
    e.preventDefault();
    setMsg("");
    if (security.newPassword !== security.confirmPassword) {
      setMsg("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    try {
      await updateMyProfile({
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      setMsg("Password changed successfully.");
      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg(err?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const sure = window.confirm(
      "This will permanently delete your account and related data. Continue?"
    );
    if (!sure) return;

    setLoading(true);
    setMsg("");
    try {
      await deleteMyProfile();
      window.location.href = "/login";
    } catch (err) {
      setMsg(err?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="set-container">
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
      {msg && <p className="set-note" style={{ marginTop: 8 }}>{msg}</p>}

      {/* ACCOUNT -------------------------------------------------------- */}
      {tab === "account" && (
        <section className="set-section">
          <h3 className="set-subtitle">Profile Information</h3>

          <Form className="set-form" onSubmit={handleAccountSubmit}>
            {/* optional avatar preview */}
            {account.previewUrl ? (
              <img
                src={account.previewUrl}
                alt="Profile"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 12,
                }}
              />
            ) : null}

            <FileUploadField
              name="profileImage"
              label="Profile Image"
              accept="image/*"
              onChange={onAccountChange}
              value={account.profileImage}
            />

            <FormField
              name="name"
              label="Name"
              placeholder="Enter name"
              value={account.name}
              onChange={onAccountChange}
              required
            />
            <FormField
              name="username"
              label="Username"
              placeholder="Enter username"
              value={account.username}
              onChange={onAccountChange}
              required
            />
            {/* Email is display-only here; not sent to updateMyProfile */}
            <FormField
              name="email"
              type="email"
              label="Email"
              placeholder="Enter email"
              value={account.email}
              onChange={onAccountChange}
              disabled
            />

            {/* User-ONLY FIELDS */}
            {!isOrg && (
              <>
                <FormField
                  name="bio"
                  label="Bio"
                  placeholder="Tell something about yourself"
                  value={account.bio}
                  onChange={onAccountChange}
                  />

                <FormField
                  name="interests"
                  label="Interests (comma-separated)"
                  placeholder="e.g. climate, education, health"
                  value={account.interests}
                  onChange={onAccountChange}
                />
              </>
            )}

            {/* ORG-ONLY FIELDS */}
            {isOrg && (
              <>
                <h4 className="set-subtitle" style={{ marginTop: 16 }}>
                  Organization Details
                </h4>
                <FormField
                  name="headName"
                  label="Head / Contact Name"
                  placeholder="e.g. Jane Doe"
                  value={account.headName}
                  onChange={onAccountChange}
                />

                <FormField
                  name="mission"
                  label="Mission"
                  placeholder="What drives you?"
                  value={account.mission}
                  onChange={onAccountChange}
                />

                <FormField
                  name="website"
                  label="Website"
                  placeholder="https://example.org"
                  value={account.website}
                  onChange={onAccountChange}
                />
                <FormField
                  name="regId"
                  label="Registration ID"
                  placeholder="Registration / Govt ID"
                  value={account.regId}
                  onChange={onAccountChange}
                />
                <FormField
                  name="affiliation"
                  label="Affiliation"
                  placeholder="Parent org / network"
                  value={account.affiliation}
                  onChange={onAccountChange}
                />
                <SelectField
                  name="orgType"
                  label="Organization Type"
                  value={account.orgType}
                  onChange={onAccountChange}
                  required
                  options={ORG_TYPES}
                  error={msg} // Optional: if you want to show an error message
                  placeholder="Select organization type"
                />
                <FormField
                  name="upi"
                  label="UPI ID (for donations)"
                  placeholder="e.g. yourname@upi"
                  value={account.upi}
                  onChange={onAccountChange}
                />
              </>
            )}

            <FormActions align="start" className="set-row">
              <Button
                type="submit"
                variant="outline"
                className="secondary-btn set-btn"
                disabled={loading}
              >
                {loading ? "Updating…" : "Update Profile"}
              </Button>
              <LogoutButton />
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
              checked={notify.emailNotify}
              onChange={onNotifyChange}
            />
            <CheckboxField
              name="pushNotify"
              label="Receive push notifications for event updates"
              checked={notify.pushNotify}
              onChange={onNotifyChange}
            />
            <CheckboxField
              name="appNotify"
              label="Receive in-app notifications for activity"
              checked={notify.appNotify}
              onChange={onNotifyChange}
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

          <Form className="set-form" onSubmit={handleSecuritySubmit}>
            <FormField
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={security.currentPassword}
              onChange={onSecurityChange}
              required
            />
            <FormField
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={security.newPassword}
              onChange={onSecurityChange}
              required
            />
            <FormField
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={security.confirmPassword}
              onChange={onSecurityChange}
              required
            />

            <FormActions align="start">
              <Button
                type="submit"
                variant="primary"
                className="primary-btn set-btn"
                disabled={loading}
              >
                {loading ? "Saving…" : "Change Password"}
              </Button>
            </FormActions>
          </Form>
        </section>
      )}

      {tab === "delete" && (
        <section className="set-section">
          <h3 className="set-subtitle">Delete Account</h3>
          <p className="set-note">
            Deleting your account is permanent and cannot be undone. All your
            data will be removed.
          </p>
          <Button
            variant="danger"
            className="set-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete Account"}
          </Button>
        </section>
      )}
    </section>
  );
}
