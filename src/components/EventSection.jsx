import React, { useState, useEffect } from "react";
import Avatar from "./Avatar.jsx";
import "../styles/EventDetails.css";
import { useNavigate } from "react-router-dom";
import { attend, unattend, isMeAttending } from "../api/attendanceAPI";
import { volunteer, unvolunteer, isMeVolunteering } from "../api/volunteerAPI";
import { toast } from "react-toastify";
import CenterSpinner from "./LoadingSpinner.jsx";

export default function EventSection({
  banner,
  name,
  orgProfilePicture,
  orgName,
  orgType,
  date,
  isVirtual,
  venue,
  description,
  skills = [],
  clickable = true,
  orgId,
  userId,
  eventId,
  actorType
}) {
  const navigate = useNavigate();

  const [isVolunteering, setIsVolunteering] = useState(false);
  const [hasSentVolReq, setHasSentVolReq] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [loading, setLoading] = useState(true);

  const errMsg = (e, fallback) =>
    e?.response?.data?.message || e?.message || fallback;

  useEffect(() => {
    (async () => {
      if (!clickable || !eventId || actorType!="user") {
        setLoading(false);
        return;
      }
      try {
        const attendingResp = await isMeAttending(eventId);
        const attending =
          typeof attendingResp === "boolean"
            ? attendingResp
            : !!attendingResp?.attending;
        setIsAttending(attending);

        const volunteeringResp = await isMeVolunteering(eventId);
        if (!volunteeringResp.volunteering){
          setIsVolunteering(false)
        } else if (volunteeringResp.status == "pending"){
          setHasSentVolReq(true)
        } else {
          setIsVolunteering(true)
        }
      } catch (e) {
        toast.error(errMsg(e, "Error loading event status"));
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId, clickable]);

  const handleClick = () => {
    if (clickable && orgId) navigate(`/profile/org/${orgId}`);
  };

  const handleVolunteer = async () => {
    if (!clickable || !eventId) return;
    try {
      if (hasSentVolReq){
        toast.info("Volunteering request is being processed by the organization");
      }
      if (isVolunteering) {
        await unvolunteer(eventId);
        setIsVolunteering(false);
      } else {
        await volunteer(eventId);
        setHasSentVolReq(true);
      }
    } catch (e) {
      toast.error(errMsg(e, "Error updating volunteer status"));
    }
  };

  const handleAttend = async () => {
    if (!clickable || !eventId) return;
    try {
      if (isAttending) {
        await unattend(eventId);
        setIsAttending(false);
        window.location.reload();
      } else {
        await attend(eventId);
        setIsAttending(true);
        window.location.reload();
      }
    } catch (e) {
      toast.error(errMsg(e, "Error updating attendance status"));
    }
  };

  const handleDonate = () => {
    if (!clickable) return;
    if (userId && eventId) navigate(`/donate/${userId}/${eventId}`);
  };

  //TODO: LoadingSpinner
  if (loading) return <CenterSpinner label="Loading event details…" />;

  return (
    <section className="ed-container">
      <img
        src={banner || "/event-image.png"}
        alt="Event banner"
        className="ed-banner"
      />

      <h1 className="ed-title">{name}</h1>

      {orgName && (
        <div className={`ed-org ${clickable ? "clickable" : ""}`}>
          <Avatar src={orgProfilePicture} backup={orgId} alt={orgName} className="ed-org-logo" />
          {clickable ? (
            <div onClick={handleClick} className="clickable">
              <p className="ed-org-name">{orgName}</p>
              <p className="ed-org-type">{orgType}</p>
            </div>
          ) : (
            <div>
              <p className="ed-org-name">{orgName}</p>
              <p className="ed-org-type">{orgType}</p>
            </div>
          )}
        </div>
      )}

      <section className="ed-section">
        <h3 className="ed-heading">Event Details</h3>
        <div className="ed-details-grid">
          <div>
            <span className="ed-label">Date</span>
            <span className="ed-value">{date}</span>
          </div>
          <div>
            <span className="ed-label">Venue</span>
            {isVirtual ? (
              <span className="ed-value">Virtual Event</span>
            ) : (
              <span className="ed-value">{venue || "Not specified"}</span>
            )}
          </div>
        </div>
      </section>

      <div className="ed-map">
        {isVirtual ? (
          <div className="ed-virtual-box">
            <h3>Virtual Event</h3>
            {venue ? (
              <p>
                Join link:{" "}
                <a
                  href={venue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-virtual-link"
                >
                  {venue}
                </a>
              </p>
            ) : (
              <p>This is a virtual event. The organizer will share a meeting link soon.</p>
            )}
          </div>
        ) : (
          venue && (
            <iframe
              title="Event location"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`}
            ></iframe>
          )
        )}
      </div>

      <p className="ed-desc">{description}</p>

      {skills?.length > 0 && (
        <section className="ed-section">
          <h3 className="ed-heading">Required Skills</h3>
          <div className="ed-tags">
            {skills.map((s, i) => (
              <span key={i} className="ed-tag">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
      {actorType=="user" && (
      <div className="ed-actions">
        <button className="secondary-btn" onClick={handleVolunteer} disabled={!clickable}>
          {hasSentVolReq ? "Requested" : isVolunteering ? "Unvolunteer" : "Volunteer"}
        </button>
        <button className="primary-btn" onClick={handleDonate} disabled={!clickable}>
          Donate
        </button>
        <button className="secondary-btn" onClick={handleAttend} disabled={!clickable}>
          {isAttending ? "Unattend" : "Attend"}
        </button>
      </div>
      )}
    </section>
  );
}
