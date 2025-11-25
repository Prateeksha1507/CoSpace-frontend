import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentActorDocument } from "../api/authAPI";
import VerificationBadge from "./VerificationBadge";
import "../styles/OrgVerificationBanner.css";

export default function OrgVerificationBanner() {
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const doc = await getCurrentActorDocument();
        // Only show for org accounts
        if (!doc || doc.type !== "org") {
          setOrg(null);
        } else {
          setOrg(doc);
        }
      } catch (err) {
        setError(err.message || "Failed to load verification status.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !org) return null; // nothing for non-org actors

  const isVerified = !!org.verified;

  return (
    <section className="org-verif-banner">
      <div className="org-verif-left">
        <h2 className="org-verif-title">Verification Status</h2>
        <p className="org-verif-subtitle">
          Keep your documents up to date to maintain trust with volunteers and donors.
        </p>

        <div className="org-verif-status-row">
          <span className="org-verif-label">Status:</span>
          <VerificationBadge verified={isVerified} className="org-verif-badge-inline" />
        </div>

        {!isVerified && (
          <p className="org-verif-warning">
            Your organization is not verified yet. Please upload the required documents.
          </p>
        )}

        {error && (
          <p className="org-verif-error">
            {error}
          </p>
        )}
      </div>

      <div className="org-verif-right">
        <button
          className="org-verif-btn"
          onClick={() => navigate("/org/verification")}
        >
          {isVerified ? "View / Update Documents" : "Go to Verification"}
        </button>
      </div>
    </section>
  );
}
