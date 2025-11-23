import React from "react";

function simpleHash(str, total = 100, chunkSize = 20) {
  if (!str) return 0;
  const tail = str.slice(-chunkSize);
  let sum = 0;
  for (let i = 0; i < tail.length; i++) sum += tail.charCodeAt(i);
  return sum % total;
}

export default function Avatar({ src, backup, size = 64, alt = "avatar", total = 100 }) {
  const index = simpleHash(backup, total);
  const n = String(index).padStart(2, "0");
  const fallback = `/avatars/avatar-${n}.svg`;

  const imageUrl = src?.startsWith("http") ? src : fallback;

  return (
    <img
      src={imageUrl}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        backgroundColor: "#e8eef2", // subtle background behind SVGs
      }}
      onError={(e) => {
        if (e.target.src !== fallback) e.target.src = fallback;
      }}
    />
  );
}
