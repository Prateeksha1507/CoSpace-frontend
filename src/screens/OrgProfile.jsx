import React, { useEffect, useState } from "react";
import "../styles/OrgProfile.css";
import Avatar from "../components/Avatar";
import {
  fetchAllOrgs,
  fetchOrgById,
  fetchOrgFollowerCount,
  fetchOrgEventsById,
} from "../api/orgAPI";
import { useSearchParams, useParams } from "react-router-dom";

function formatNiceDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function OrgProfile() {
  const [params] = useSearchParams();
  const { id: pathId } = useParams();
  const [tab, setTab] = useState("about");

  const queryId = params.get("id");
  const resolvedId = queryId ?? pathId;
  const numericId = resolvedId != null ? Number(resolvedId) : NaN;

  const fallbackOrgId = fetchAllOrgs()[0]?.orgId ?? null;
  const orgId = Number.isFinite(numericId) ? numericId : fallbackOrgId;

  const [org, setOrg] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setError("");
      setOrg(null);
      setFollowerCount(0);
      setEvents([]);

      if (!orgId) {
        setError("Invalid organization ID.");
        return;
      }

      try {
        const orgData = await fetchOrgById(orgId);
        setOrg(orgData);

        const [count, page] = await Promise.all([
          fetchOrgFollowerCount(orgId),                         // number
          fetchOrgEventsById(orgId, { sort: "date:asc", page: 1, limit: 100 }),
        ]);

        setFollowerCount(typeof count === "number" ? count : 0);

        const items = Array.isArray(page?.items) ? page.items : [];
        const withNiceDate = items.map((e) => ({
          ...e,
          niceDate: formatNiceDate(e.date),
        }));
        setEvents(withNiceDate);
      } catch (e) {
        setError(e?.message || "Failed to load organization.");
        setOrg(null);
        setFollowerCount(0);
        setEvents([]);
      }
    })();
  }, [orgId]);

  // Compute event lists directly
  const today = new Date();
  const upcomingEvents = (events || [])
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastEvents = (events || [])
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (error && !org) {
    return (
      <main className="org-container">
        <section className="org-section">
          <h3>Organization not found</h3>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!org) {
    return (
      <main className="org-container">
        <section className="org-section">
          <h3>Loading…</h3>
        </section>
      </main>
    );
  }

  return (
    <main className="org-container">
      {/* Header */}
      <section className="org-header">
        <Avatar
          src={org.profilePicture}
          alt={org.name}
          className="org-logo"
        />
        <div className="org-info">
          <h2 className="org-name">{org.name}</h2>
          <p className="org-type">{org.type || "Non-profit organization"}</p>
          <p className="org-followers">
            {followerCount} follower{followerCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="org-actions">
          <button className="secondary-btn">Follow</button>
          <button className="primary-btn">Donate</button>
          <a className="secondary-btn" href={`/chats`}>Chat with us</a>
        </div>
      </section>

      {/* Tabs */}
      <div className="org-tabs">
        <button
          className={`org-tab ${tab === "about" ? "active" : ""}`}
          onClick={() => setTab("about")}
        >
          About
        </button>
        <button
          className={`org-tab ${tab === "events" ? "active" : ""}`}
          onClick={() => setTab("events")}
        >
          Events
        </button>
      </div>

      {/* About */}
      {tab === "about" && (
        <section className="org-section">
          <h3>About</h3>
          <p>
            {org.about ||
              "This organization is dedicated to impactful community initiatives and collaboration."}
          </p>
          <div className="org-details">
            <p>
              <strong>Contact</strong>
              <br />
              {org.email || "—"}
            </p>
            <p>
              <strong>Website</strong>
              <br />
              {org.website || "—"}
            </p>
            <p>
              <strong>Registration ID</strong>
              <br />
              {org.regId || "—"}
            </p>
            {org.headName && (
              <p>
                <strong>Head</strong>
                <br />
                {org.headName}
              </p>
            )}
            {org.affiliation && (
              <p>
                <strong>Affiliation</strong>
                <br />
                {org.affiliation}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Events */}
      {tab === "events" && (
        <>
          {/* Upcoming */}
          <section className="org-section">
            <h3>Upcoming Events</h3>
            {upcomingEvents.length === 0 && (
              <p className="org-empty">No upcoming events.</p>
            )}
            {upcomingEvents.map((e) => (
              <div key={e.eventId} className="org-event">
                <div>
                  <p className="org-event-mode">
                    {e.collaboratingOrgId ? "Collaboration" : "In-person"}
                  </p>
                  <h4>{e.name}</h4>
                  <p className="org-event-date">{e.niceDate}</p>
                  <p className="org-event-venue">{e.venue}</p>
                  <a className="secondary-btn" href={`/event/${e.eventId}`}>
                    View Details
                  </a>
                </div>
                <Avatar
                  src={"/images/cleanup.jpg"}
                  alt={e.name}
                  className="org-event-img"
                />
              </div>
            ))}
          </section>

          {/* Past */}
          <section className="org-section">
            <h3>Past Events</h3>
            {pastEvents.length === 0 && (
              <p className="org-empty">No past events.</p>
            )}
            {pastEvents.map((e) => (
              <div key={e.eventId} className="org-event">
                <div>
                  <p className="org-event-mode">
                    {e.collaboratingOrgId ? "Collaboration" : "In-person"}
                  </p>
                  <h4>{e.name}</h4>
                  <p className="org-event-date">{e.niceDate}</p>
                  <p className="org-event-venue">{e.venue}</p>
                  <a className="secondary-btn" href={`/event/${e.eventId}`}>
                    View Details
                  </a>
                </div>
                <Avatar
                  src={"/images/gala.jpg"}
                  alt={e.name}
                  className="org-event-img"
                />
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
