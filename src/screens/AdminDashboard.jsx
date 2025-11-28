import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import { getCurrentActor } from "../api/authAPI";
import {
  viewUnverifiedOrgs,
  getOrgVerificationStats,
  verifyOrg,
} from "../api/adminAPI";
import CenterSpinner from "../components/LoadingSpinner";
import { AdminHeader } from "../components/adminHeader";

export default function AdminDashboard() {
  const [actor, setActor] = useState(null);
  const [unverified, setUnverified] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: null });
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");

      try {
        const current = await getCurrentActor();
        if (!current || current.type !== "admin") {
          throw new Error("You must be an admin to view this page.");
        }
        setActor(current);

        const [unverifiedRes, statsRes] = await Promise.all([
          viewUnverifiedOrgs(),
          getOrgVerificationStats().catch(() => null), // optional
        ]);

        const list = unverifiedRes?.orgs || [];
        setUnverified(list);

        const pending = statsRes?.pendingVerifications ?? list.length;
        const approved = statsRes?.approvedOrganizations ?? null;

        setStats({ pending, approved });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleVerify(orgId) {
    try {
      setVerifyingId(orgId);
      await verifyOrg(orgId);

      // remove from queue
      setUnverified((prev) => prev.filter((o) => o._id !== orgId));
      setStats((prev) => ({
        pending: Math.max(0, (prev.pending || 0) - 1),
        approved:
          typeof prev.approved === "number" ? prev.approved + 1 : prev.approved,
      }));
    } catch (err) {
      alert(err.message || "Failed to verify organization.");
    } finally {
      setVerifyingId(null);
    }
  }

  if (loading) return <CenterSpinner />;

  if (error) {
    return (
      <div className="admin-layout">
        <AdminHeader />
        <main className="admin-main">
          <h1 className="admin-page-title">Admin Dashboard</h1>
          <p className="admin-error">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader />

      <main className="admin-main">
        <h1 className="admin-page-title">Admin Dashboard</h1>

        <section className="admin-stats-row">
          <StatCard
            label="Pending Verifications"
            value={stats.pending ?? unverified.length}
          />
          <StatCard
            label="Approved Organizations"
            value={
              stats.approved !== null
                ? stats.approved
                : "—"
            }
          />
        </section>

        <section className="admin-table-section">
          <h2 className="admin-section-title">Verification Queue</h2>

          <div className="admin-table">
            <div className="admin-table-header">
              <div>Organization Name</div>
              <div>Contact Person</div>
              <div>Email</div>
              <div>Documents</div>
              <div>Actions</div>
            </div>

            {unverified.length === 0 && (
              <div className="admin-table-empty">
                All organizations are verified. 🎉
              </div>
            )}

            {unverified.map((org) => (
              <div key={org._id} className="admin-table-row">
                <div>{org.name}</div>
                <div className="admin-table-link">
                  {org.headName || "—"}
                </div>
                <div className="admin-table-email">{org.email}</div>
                <div>
                  <a
                    href={`/admin/orgs/${org._id}/docs`}
                    className="admin-table-doc-link"
                  >
                    View Document
                  </a>
                </div>
                <div>
                  <button
                    className="admin-verify-btn"
                    onClick={() => handleVerify(org._id)}
                    disabled={verifyingId === org._id}
                  >
                    {verifyingId === org._id ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value">{value}</p>
    </div>
  );
}
