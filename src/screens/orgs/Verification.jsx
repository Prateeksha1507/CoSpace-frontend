import React, { useState } from "react";
import "../../styles/org/Verification.css";
import { submitOrgDocs } from "../../api/orgDocsAPI";
import { showToast } from "../../components/ToastContainer";

export default function Verification() {
  const [files, setFiles] = useState({
    registration: null,
    tax: null,
    id: null,
  });

  const [status, setStatus] = useState({
    loading: false,
    msg: "",
    error: "",
  });

  // used to reset <input type="file" />
  const [formKey, setFormKey] = useState(0);

  const handleSelect = (key) => (e) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
    setStatus({ loading: false, msg: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: "", error: "" });

    try {
      // allow submitting any subset, but require at least one
      if (!files.registration && !files.tax && !files.id) {
        throw new Error("Please choose at least one document to upload.");
      }

      await submitOrgDocs({
        registrationCertificate: files.registration,
        taxExemptionCertificate: files.tax,
        legalIdentification: files.id,
      });

      setStatus({ loading: false, msg: "Documents submitted for review.", error: "" });
      showToast("Documents submitted for review", "success")
      setFiles({ registration: null, tax: null, id: null });
      setFormKey((k) => k + 1); // reset native file inputs
    } catch (err) {
      setStatus({
        loading: false,
        msg: "",
        error: err.message || "Upload failed",
      });
      showToast(`${err.message || "Upload failed"}`, "error")
    }
  };

  return (
    <section className="docs-container">
      <section className="docs-box">
        <h1 className="docs-title">Document Submission</h1>

        <form key={formKey} className="docs-form" onSubmit={handleSubmit}>
          
          {/* Required documents section */}
          <div className="docs-section">
            <h3 className="docs-subtitle">Required Documents</h3>
            <p className="docs-hint">
              Please submit the following documents for verification. Ensure all
              documents are clear, legible, and within the specified file size limits.
            </p>

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

            <button
              type="submit"
              className="docs-button"
              disabled={status.loading}
            >
              {status.loading ? "Submitting..." : "Submit"}
            </button>

            {!!status.msg && <p className="docs-success">{status.msg}</p>}
            {!!status.error && <p className="docs-error">{status.error}</p>}
          </div>

          {/* Support section */}
          <div className="docs-section">
            <h3 className="docs-subtitle">Support</h3>
            <p className="docs-text">
              If you have any questions or need assistance, please visit our{" "}
              <a className="docs-link" href="/contact">Contact Page</a>.
            </p>
          </div>
        </form>
      </section>
    </section>
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
