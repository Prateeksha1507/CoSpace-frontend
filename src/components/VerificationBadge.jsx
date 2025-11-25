import React from "react";
import "../styles/VerificationBadge.css";

export default function VerificationBadge({ verified, className = "" }) {
  const isVerified = !!verified;

  return (
    <span
      className={
        `verify-badge ${isVerified ? "verified" : "unverified"} ${className}`
      }
      title={
        isVerified
          ? "This organization is verified"
          : "This organization is not verified yet"
      }
    >
      {isVerified ? "Verified" : "Unverified"}
    </span>
  );
}
