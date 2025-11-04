// EventDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, fetchEventStats } from "../api/eventAPI";
import { fetchOrgById } from "../api/orgAPI";
import { verify } from "../api/authAPI";
import EventSection from "../components/EventSection";
import { getAttendeeDetails } from "../api/attendanceAPI";
import "../styles/EventDetails.css";
import {
  listVolunteers,
  approveVolunteer,
  rejectVolunteer,
} from "../api/volunteerAPI";
import {
  requestCollab,
  getMyCollabStatus,
  listCollabRequests,
  acceptCollabRequest,
  rejectCollabRequest,
  cancelMyCollabRequest,
  COLLAB_STATUS,
  canRequestFromStatus,
} from "../api/collabAPI";
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

  // --- Collaboration UI state ---
  const [collabStatus, setCollabStatus] = useState(null);
  const [collabRequests, setCollabRequests] = useState([]);
  const [collabLoading, setCollabLoading] = useState(false);
  const [requestNote, setRequestNote] = useState("");

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

  const isOtherOrg = useMemo(
    () =>
      actorType === "org" &&
      actorId &&
      event?.conductingOrgId &&
      String(actorId) !== String(event.conductingOrgId),
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

  const isEventInPast = (e) => {
    if (!e?.date) return false;
    try {
      const date = new Date(e.date);
      // if time provided as HH:mm, combine for a stricter check
      if (e.time && /^\d{2}:\d{2}$/.test(e.time)) {
        const [hh, mm] = e.time.split(":").map((x) => parseInt(x, 10));
        date.setHours(hh, mm, 0, 0);
      }
      return date.getTime() < Date.now();
    } catch {
      return false;
    }
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
      } catch {
        setStats({ participants: 0, volunteers: 0 });
      }
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

  // ---------- Collaboration: data loaders ----------
  const loadMyCollabStatus = async () => {
    if (!event?._id || !isOtherOrg) return;
    try {
      setCollabLoading(true);
      const res = await getMyCollabStatus(event._id);
      setCollabStatus(res?.status || null);
    } catch (e) {
      toast.error(errMsg(e, "Failed to fetch collaboration status"));
    } finally {
      setCollabLoading(false);
    }
  };

  const loadIncomingRequests = async () => {
    if (!event?._id || !isConductingOrg) return;
    try {
      setCollabLoading(true);
      const res = await listCollabRequests(event._id);
      setCollabRequests(Array.isArray(res?.items) ? res.items : []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to fetch collaboration requests"));
    } finally {
      setCollabLoading(false);
    }
  };

  useEffect(() => {
    if (!event?._id) return;
    if (isConductingOrg) {
      loadIncomingRequests();
    } else if (isOtherOrg) {
      loadMyCollabStatus();
    }
  }, [event?._id, isConductingOrg, isOtherOrg]);

  // ---------- Collaboration: actions ----------
  const onSendRequest = async () => {
    if (!event?._id) return;
    try {
      setCollabLoading(true);
      await requestCollab(event._id, { note: requestNote?.trim() || undefined });
      toast.success("Collaboration request sent");
      setRequestNote("");
      await loadMyCollabStatus();
    } catch (e) {
      toast.error(errMsg(e, "Failed to send request"));
    } finally {
      setCollabLoading(false);
    }
  };

  const onCancelMyRequest = async () => {
    // For simplicity, we’ll cancel the most recent pending request by fetching the list from status endpoint again.
    // If you want a dedicated “requestId” in status, update backend to return it and wire here.
    try {
      setCollabLoading(true);
      // Quick fetch to find pending request (conducting-only list won't help here).
      const res = await getMyCollabStatus(event._id);
      const reqId = res?.request?._id || res?.request?.id;
      if (!reqId || res?.status !== COLLAB_STATUS.PENDING) {
        toast.info("No pending request to cancel");
      } else {
        await cancelMyCollabRequest(event._id, reqId);
        toast.success("Request cancelled");
        await loadMyCollabStatus();
      }
    } catch (e) {
      toast.error(errMsg(e, "Failed to cancel request"));
    } finally {
      setCollabLoading(false);
    }
  };

  const onAccept = async (requestId) => {
    try {
      setCollabLoading(true);
      await acceptCollabRequest(event._id, requestId);
      toast.success("Collaboration accepted");
      await Promise.all([loadIncomingRequests()]);
      // also refresh event to see collaborator reflected
      const fresh = await fetchEventById(event._id);
      setEvent(fresh);
    } catch (e) {
      toast.error(errMsg(e, "Failed to accept request"));
    } finally {
      setCollabLoading(false);
    }
  };

  const onReject = async (requestId) => {
    try {
      setCollabLoading(true);
      await rejectCollabRequest(event._id, requestId);
      toast.success("Request rejected");
      await loadIncomingRequests();
    } catch (e) {
      toast.error(errMsg(e, "Failed to reject request"));
    } finally {
      setCollabLoading(false);
    }
  };

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

  const onRejectVolunteer = async (userId) => {
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

  const past = isEventInPast(event);
  const collaboratorChosen =
    !!event.collaboratingOrgId &&
    String(event.collaboratingOrgId) !== String(actorId || "");

  // ---------- UI ----------
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

      {/* --- Collaboration box for non-conducting orgs --- */}
      {isOtherOrg && (
        <section className="user-card" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Collaboration</h3>

          {collabStatus === COLLAB_STATUS.ACCEPTED && (
            <p className="user-muted">You are the accepted collaborator for this event.</p>
          )}

          {collabStatus === COLLAB_STATUS.PENDING && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="user-muted">Your request is pending.</span>
              <button
                className="secondary-btn"
                onClick={onCancelMyRequest}
                disabled={collabLoading}
              >
                {collabLoading ? "Cancelling..." : "Cancel Request"}
              </button>
            </div>
          )}

          {collabStatus === COLLAB_STATUS.REJECTED && (
            <p className="user-muted">Your previous request was rejected.</p>
          )}

          {collabStatus === COLLAB_STATUS.CANCELLED && (
            <p className="user-muted">Your previous request was cancelled.</p>
          )}

          {collabStatus === COLLAB_STATUS.BLOCKED && (
            <p className="user-muted">
              Collaboration closed: another organization has already been accepted.
            </p>
          )}

          {(canRequestFromStatus(collabStatus) && !collaboratorChosen) ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
              <input
                type="text"
                placeholder="Optional note to conducting org"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                style={{ flex: 1, padding: "8px 10px" }}
                disabled={collabLoading}
              />
              <button
                className="primary-btn"
                onClick={onSendRequest}
                disabled={collabLoading || past}
                title={past ? "Event is in the past" : undefined}
              >
                {collabLoading ? "Sending..." : "Request Collaboration"}
              </button>
            </div>
          ) : null}
        </section>
      )}

      {/* --- Owner panels (participants/volunteers + conducting-only collaboration tab) --- */}
      {isOwner && (
        <section style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
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

            {isConductingOrg && (
              <button
                className={activeTab === "collab" ? "primary-btn" : "secondary-btn"}
                onClick={() => {
                  setActiveTab("collab");
                  loadIncomingRequests();
                }}
              >
                Collaboration {collabRequests.length ? `(${collabRequests.length})` : ""}
              </button>
            )}

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
                                  onClick={() => onRejectVolunteer(v.userId)}
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

          {activeTab === "collab" && isConductingOrg && (
            <div className="user-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <h3>Collaboration Requests</h3>
                <button className="secondary-btn" onClick={loadIncomingRequests} disabled={collabLoading}>
                  {collabLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <table className="user-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Note</th>
                    <th>Status</th>
                    <th className="user-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collabRequests.length ? (
                    collabRequests.map((r) => (
                      <tr key={r._id || r.id}>
                        <td>
                          {r.requesterOrgId?._id ? (
                            <a
                              className="user-link"
                              href={`/profile/org/${r.requesterOrgId._id}`}
                            >
                              {r.requesterOrgId?.name || "Org"}
                            </a>
                          ) : (
                            r.requesterOrgId?.name || "Org"
                          )}
                        </td>
                        <td className="user-muted" style={{ maxWidth: 360 }}>
                          {r.note || "—"}
                        </td>
                        <td>
                          <span className={`tag ${r.status}`} style={{ padding: "2px 8px", borderRadius: 12 }}>
                            {r.status}
                          </span>
                        </td>
                        <td className="user-right" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          {r.status === COLLAB_STATUS.PENDING ? (
                            <>
                              <button
                                className="secondary-btn"
                                onClick={() => onAccept(r._id || r.id)}
                                disabled={collabLoading}
                              >
                                Accept
                              </button>
                              <button
                                className="secondary-btn"
                                onClick={() => onReject(r._id || r.id)}
                                disabled={collabLoading}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="user-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="user-muted">
                        No collaboration requests yet.
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
