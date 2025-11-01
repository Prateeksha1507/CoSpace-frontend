import React, { useEffect } from "react";
import "../styles/Modal.css";

export default function Modal({ open, onClose, children, title }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
      aria-hidden={!open}
    >
      <div
        className="modal-body"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
          type="button"
        >
          ✕
        </button>

        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
