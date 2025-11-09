// src/pages/SearchResults.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { searchAll } from "../api/searchAPI";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchResults() {
  const qs = useQuery();
  const q = qs.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ results: { orgs: [], events: [] } });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!q.trim()) {
        setData({ results: { orgs: [], events: [] } });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await searchAll({ q, limit: 10 });
        if (mounted) setData(res || { results: { orgs: [], events: [] } });
      } catch {
        if (mounted) setData({ results: { orgs: [], events: [] } });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [q]);

  const { orgs = [], events = [] } = data?.results || {};

  return (
    <section style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 12 }}>Search results for “{q}”</h2>

      {loading && <p>Searching…</p>}

      {!loading && !orgs.length && !events.length && (
        <p>No results found.</p>
      )}

      {!!orgs.length && (
        <section style={{ marginTop: 24 }}>
          <h3>Organizations</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
            {orgs.map((o) => (
              <Link
                key={o.id}
                to={`/profile/org/${o.id}`}
                className="card"
                style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src={o.profilePicture || "/org-placeholder.png"}
                    alt=""
                    width={36}
                    height={36}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: "#111" }}>{o.name}</div>
                    <div style={{ color: "#666", fontSize: 12 }}>{o.orgType || "Org"}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!!events.length && (
        <section style={{ marginTop: 24 }}>
          <h3>Events</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
            {events.map((e) => (
              <Link
                key={e.id}
                to={`/event/${e.id}`}
                className="card"
                style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, textDecoration: "none" }}
              >
                {e.image ? (
                  <img
                    src={e.image}
                    alt=""
                    style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
                  />
                ) : null}
                <div style={{ fontWeight: 600, color: "#111", marginBottom: 4 }}>{e.name}</div>
                <div style={{ color: "#666", fontSize: 13 }}>
                  {e.date ? new Date(e.date).toLocaleDateString() : ""} {e.time || ""}
                </div>
                {e.venue ? <div style={{ color: "#888", fontSize: 12 }}>{e.venue}</div> : null}
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
