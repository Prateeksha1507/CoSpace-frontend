import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/OrgDocs.css";
import { viewOrgDocs } from "../api/adminAPI";
import CenterSpinner from "../components/LoadingSpinner";

export default function AdminOrgDocs() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [org, setOrg] = useState(null);
  const [activeTab, setActiveTab] = useState("registration");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await viewOrgDocs(orgId);
        setOrg(data?.org || null);
      } catch (err) {
        setError(err.message || "Failed to load documents.");
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId]);

  if (loading) return <CenterSpinner />;
  if (error || !org) {
    return (
      <div className="admin-layout">
        <HeaderBar />
        <main className="admin-main">
          <button className="admin-back-link" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="admin-page-title">Organization Documents</h1>
          <p className="admin-error">{error || "Organization not found."}</p>
        </main>
      </div>
    );
  }

  const docs = org.docs || {};

  const docUrls = {
    registration: docs.registrationCertificate,
    tax: docs.taxExemptionCertificate,
    id: docs.legalIdentification,
  };

  const currentUrl = docUrls[activeTab];
  const isPdf = currentUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="admin-layout">
      <HeaderBar />
      <main className="admin-main">
        <button className="admin-back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="admin-page-title">Organization Verification Documents</h1>
        <p className="admin-doc-subtitle">
          Reviewing documents submitted by <strong>{org.name}</strong>
        </p>

        {/* Tabs */}
        <div className="admin-doc-tabs">
          <DocTab
            label="Document 1"
            active={activeTab === "registration"}
            onClick={() => setActiveTab("registration")}
          />
          <DocTab
            label="Document 2"
            active={activeTab === "tax"}
            onClick={() => setActiveTab("tax")}
          />
          <DocTab
            label="Document 3"
            active={activeTab === "id"}
            onClick={() => setActiveTab("id")}
          />
        </div>

        {/* Viewer */}
        <div className="admin-doc-viewer">
        {!currentUrl && (
          <div className="admin-doc-empty">
            No document uploaded for this section.
          </div>
        )}

        {currentUrl && (
          <>
            <div className="admin-doc-toolbar">
              <a href={currentUrl} target="_blank" rel="noreferrer">
                Open in new tab
              </a>
            </div>

            {isPdf ? (
              <iframe
                src={currentUrl}
                title="Document Viewer"
                className="admin-doc-frame"
              />
            ) : (
              <img
                src={currentUrl}
                alt="Document"
                className="admin-doc-image"
              />
            )}
          </>
        )}
      </div>

      </main>
    </div>
  );
}

function HeaderBar() {
  return (
    <header className="admin-header-bar">
      <div className="admin-header-inner">
        <div className="admin-logo">CoSpace</div>
      </div>
    </header>
  );
}

function DocTab({ label, active, onClick }) {
  return (
    <button
      className={`admin-doc-tab ${active ? "active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
