import React, { useState } from "react";
import "../../styles/org/Verification.css";

export default function Verification() {
  const [files, setFiles] = useState({
    registration: null,
    tax: null,
    id: null,
  });

  const handleSelect = (key) => (e) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted! (TO Change)`);
  };

  return (
    <main className="docs-container">
      <section className="docs-box">
        <h1 className="docs-title">Document Submission</h1>

        <form className="docs-form" onSubmit={handleSubmit}>
          <div className="docs-section">
            <h3 className="docs-subtitle">Required Documents</h3>
            <p className="docs-hint">
              Please submit the following documents for verification. Ensure all
              documents are clear, legible, and within the specified file size limits.
            </p>

            {/* Upload row */}
            <UploadRow
              label="Upload Registration Certificate"
              file={files.registration}
              onChange={handleSelect("registration")}
            />

            <UploadRow
              label="Upload Tax Exemption Certificate"
              file={files.tax}
              onChange={handleSelect("tax")}
            />

            <UploadRow
              label="Upload Legal Identification Document"
              file={files.id}
              onChange={handleSelect("id")}
            />

            <p className="docs-note">
              Supported file formats: PDF, JPG, PNG. Maximum file size: 5MB per document.
            </p>

            <button type="submit" className="docs-button">Submit</button>
          </div>

          <div className="docs-section">
            <h3 className="docs-subtitle">Verification Status</h3>
            <p className="docs-hint">Verification Progress</p>

            <div className="docs-progress">
              <div className="docs-progress-bar" style={{ width: "28%" }} />
            </div>

            <p className="docs-text">
              Your documents are currently under review. You will receive a
              notification once the verification process is complete.
            </p>
          </div>

          <div className="docs-section">
            <h3 className="docs-subtitle">Support</h3>
            <p className="docs-text">
              If you have any questions or need assistance, please contact our support team at
              <a className="docs-link" href="mailto:support@coSpace.com"> support@coSpace.com</a>
              {" "}or call us at (555) 123-4567.
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}

/* ---------- Small helper component ---------- */
function UploadRow({ label, file, onChange }) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="docs-upload-row">
      <div className="docs-upload-info">
        <label htmlFor={inputId} className="docs-label">{label}</label>
        <div className="docs-filename">
          {file ? file.name : <span className="docs-filename-placeholder">No file chosen</span>}
        </div>
      </div>

      <div className="docs-upload-action">
        <input
          id={inputId}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onChange}
          className="docs-file-input"
        />
        <label htmlFor={inputId} className="docs-upload-btn">Upload</label>
      </div>
    </div>
  );
}
