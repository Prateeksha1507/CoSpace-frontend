import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, fetchEventStats } from "../api/eventAPI";
import { fetchOrgById } from "../api/orgAPI";
import { verify } from "../api/authAPI";
import EventSection from "../components/EventSection";
import { getAttendeeDetails } from "../api/attendanceAPI";
import "../styles/EventDetails.css"
import {
  listVolunteers,
  approveVolunteer,
  rejectVolunteer,
} from "../api/volunteerAPI";
import { toast } from "react-toastify";

export default function EventDetails() {
  const { id } = useParams();
  const [stats, setStats] = useState({ participants: 0, volunteers: 0 });
  const [event, setEvent] = useState(null);
  const [org, setOrg] = useState(null);
  const [actorId, setActorId] = useState(null);
  const [actorType, setActorType] = useState(null);

  const [activeTab, setActiveTab] = useState("participants");
  const [participants, setParticipants] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);

  const isOwner = useMemo(() => {
    if (actorType !== "org") return false;
    const me = String(actorId || "");
    const conducting = String(event?.conductingOrgId || "");
    const collaborating = String(event?.collaboratingOrgId || "");
    return !!me && (me === conducting || me === collaborating);
  }, [actorType, actorId, event?.conductingOrgId, event?.collaboratingOrgId]);

  const isConductingOrg = useMemo(
    () =>
      actorType === "org" &&
      actorId &&
      event?.conductingOrgId &&
      String(actorId) === String(event.conductingOrgId),
    [actorType, actorId, event]
  );

  const errMsg = (e, fallback) =>
    e?.response?.data?.message || e?.message || fallback;

  const normalizeAttendees = (raw) => {
    const arr = Array.isArray(raw?.attendees)
      ? raw.attendees
      : Array.isArray(raw)
      ? raw
      : [];
    return arr.map((a, idx) => {
      const u = a.user || a;
      const id = u?.id || u?._id || a?.id || a?._id || String(idx);
      return {
        id: String(id),
        name: u?.name || a?.name || "—",
        email: u?.email || a?.email || "—",
        joinedAt: a?.joinedAt || a?.createdAt || null,
      };
    });
  };

  const normalizeVolunteers = (raw) => {
    const arr = Array.isArray(raw?.volunteers)
      ? raw.volunteers
      : Array.isArray(raw)
      ? raw
      : [];
    return arr.map((v, idx) => {
      const u = v.user || {};
      const userId = v.userId || u.id || u._id || v.id || v._id || String(idx);
      return {
        userId: String(userId),
        name: v.name || u.name || "—",
        email: v.email || u.email || "—",
        profilePicture: v.profilePicture || u.profilePicture || "",
        status: v.status || "pending",
        joinedAt: v.joinedAt || v.createdAt || null,
      };
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEventById(id);
        if (!data) {
          toast.error("Event not found");
          return;
        }
        setEvent(data);
        const [orgInfo, auth] = await Promise.all([
          fetchOrgById(data.conductingOrgId),
          verify().catch(() => null),
        ]);
        setOrg(orgInfo || null);
        setActorId(auth?.actor?.id || null);
        setActorType(auth?.actor?.type || null);
      } catch (e) {
        toast.error(errMsg(e, "Failed to load event"));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!event?._id) return;
      if (isOwner) return;
      try {
        const s = await fetchEventStats(event._id);
        setStats({ participants: s.participants || 0, volunteers: s.volunteers || 0 });
      } catch { setStats({ participants: 0, volunteers: 0 }); }
    })();
  }, [event?._id, isOwner]);

  const loadLists = async () => {
    if (!event?._id) return;
    setLoadingLists(true);
    try {
      const [att, vol] = await Promise.all([
        getAttendeeDetails(event._id),
        listVolunteers(event._id),
      ]);
      setParticipants(normalizeAttendees(att));
      setVolunteers(normalizeVolunteers(vol));
    } catch (e) {
      toast.error(errMsg(e, "Failed to load attendees/volunteers"));
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    if (event?._id && isOwner) loadLists();
  }, [event?._id, isOwner]);

  const getVolunteerById = (uid) =>
    volunteers.find((x) => String(x.userId) === String(uid));

  const onConfirm = async (userId) => {
    const v = getVolunteerById(userId);
    if (!v) return toast.error("Volunteer not found");
    if (v.status !== "pending")
      return toast.info("Action available only for pending volunteers");
    try {
      await approveVolunteer(event._id, userId);
      setVolunteers((prev) =>
        prev.map((x) =>
          String(x.userId) === String(userId) ? { ...x, status: "confirmed" } : x
        )
      );
      toast.success("Volunteer confirmed");
    } catch (e) {
      toast.error(errMsg(e, "Failed to confirm volunteer"));
    }
  };

  const onReject = async (userId) => {
    const v = getVolunteerById(userId);
    if (!v) return toast.error("Volunteer not found");
    if (v.status !== "pending")
      return toast.info("Action available only for pending volunteers");
    try {
      await rejectVolunteer(event._id, userId);
      setVolunteers((prev) =>
        prev.map((x) =>
          String(x.userId) === String(userId) ? { ...x, status: "rejected" } : x
        )
      );
      toast.success("Volunteer rejected");
    } catch (e) {
      toast.error(errMsg(e, "Failed to reject volunteer"));
    }
  };

  if (loading || !event || !org) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading event...</p>;
  }

  return (
    <main>
      <EventSection
        banner={event.image}
        name={event.name}
        orgProfilePicture={org.profilePicture}
        orgName={org.name}
        orgType={org.type || org.orgType}
        date={event.date}
        isVirtual={event.isVirtual}
        venue={event.venue}
        description={event.description}
        skills={event.skills}
        clickable={true}
        orgId={org._id}
        eventId={event._id}
        actorId={actorId}
        actorType={actorType}
      />

      {isOwner && (
        <section style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <button
              className={activeTab === "participants" ? "primary-btn" : "secondary-btn"}
              onClick={() => setActiveTab("participants")}
            >
              Participants ({participants.length})
            </button>
            <button
              className={activeTab === "volunteers" ? "primary-btn" : "secondary-btn"}
              onClick={() => setActiveTab("volunteers")}
            >
              Volunteers ({volunteers.length})
            </button>
            <button className="secondary-btn" onClick={loadLists} disabled={loadingLists}>
              {loadingLists ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {activeTab === "participants" && (
            <div className="user-card">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.length ? (
                    participants.map((p) => (
                      <tr key={p.id || p.email}>
                        <td>
                          {p.id ? (
                            <a href={`/profile/user/${p.id}`} className="user-link">
                              {p.name}
                            </a>
                          ) : (
                            p.name
                          )}
                        </td>
                        <td className="user-muted">{p.email}</td>
                        <td className="user-muted">
                          {p.joinedAt ? new Date(p.joinedAt).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="user-muted">
                        No participants yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "volunteers" && (
            <div className="user-card">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    {isConductingOrg && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {volunteers.length ? (
                    volunteers.map((v, i) => (
                      <tr key={v.userId || v.email || i}>
                        <td>{v.name}</td>
                        <td className="user-muted">{v.email}</td>
                        <td>
                          <span
                            className={`tag ${v.status}`}
                            style={{
                              padding: "2px 8px",
                              borderRadius: 12,
                              textTransform: "capitalize",
                            }}
                          >
                            {v.status}
                          </span>
                        </td>
                        {isConductingOrg && (
                          <td
                            className="user-right"
                            style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
                          >
                            {v.status === "pending" ? (
                              <>
                                <button
                                  className="secondary-btn"
                                  onClick={() => onConfirm(v.userId)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="secondary-btn"
                                  onClick={() => onReject(v.userId)}
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="user-muted">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isConductingOrg ? 4 : 3} className="user-muted">
                        No volunteers yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

{!isOwner && (
  <section className="event-stats-simple">
    <h3>Event Stats</h3>
    <div className="event-stats-boxes">
      <div className="event-stat-box">
        <span className="stat-value">{stats.participants}</span>
        <div className="label">Participants</div>
      </div>
      <div className="event-stat-box">
        <span className="stat-value">{stats.volunteers}</span>
        <div className="label">Volunteers</div>
      </div>
    </div>
  </section>
)}





    </main>
  );
}
