import React from "react";
import "../styles/spinner.css";

/** 
 * BaseSpinner — all display modes (overlay, center, inline)
 * Props:
 *  - label?: string
 *  - size?: number
 *  - color?: "auto"|"primary"|"secondary"|"text"
 *  - variant?: "ring"|"dots"|"bar"
 *  - className?: string
 *  - wrapperClass?: string  // applied to the outer wrapper
 */
function BaseSpinner({
  label = "Loading…",
  size = 48,
  color = "primary",
  variant = "dots",
  className = "",
  wrapperClass = "spinner-auto-center",
}) {
  const styleVars = { "--spinner-size": `${size}px` };

  const colorVar =
    color === "primary"
      ? "var(--primary-color)"
      : color === "secondary"
      ? "var(--secondary-color)"
      : color === "text"
      ? "var(--text-color)"
      : "currentColor";

  const spinnerInner = (
    <div
      className={`spinner ${variant} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{ ...styleVars, "--spinner-color": colorVar }}
    >
      {variant === "ring" && <div className="spinner-ring" aria-hidden="true" />}
      {variant === "dots" && (
        <div className="spinner-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
      )}
      {variant === "bar" && (
        <div className="spinner-bar" aria-hidden="true">
          <span />
        </div>
      )}
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );

  return <div className={wrapperClass}>{spinnerInner}</div>;
}

/** Exported display variants */
export const OverlaySpinner = (props) => (
  <BaseSpinner {...props} wrapperClass="spinner-overlay" />
);
export const CenterSpinner = (props) => (
  <BaseSpinner {...props} wrapperClass="spinner-auto-center" />
);
export const InlineSpinner = (props) => (
  <BaseSpinner {...props} wrapperClass="spinner-inline" />
);

export default CenterSpinner;
