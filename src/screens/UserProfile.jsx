import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import UserProfileView from "../components/UserProfileView";

import { fetchUserById } from "../api/userAPI";
import { listUserVolunteered } from "../api/volunteerAPI";
import { getUserDonations } from "../api/donationAPI";
import { getAttendingDetails } from "../api/attendanceAPI";
import CenterSpinner from "../components/LoadingSpinner";

import "../styles/UserProfile.css"

const normalizeVolunteers = (raw) => {
  const arr = Array.isArray(raw?.records)
    ? raw.records
    : Array.isArray(raw?.events)
    ? raw.events
    : Array.isArray(raw)
    ? raw
    : [];

  return arr.map((v, i) => {
    const eventId = v?.eventId ?? i;
    return {
      id: String(eventId),
      eventId: String(eventId),
      name: v?.eventName ?? v?.name ?? "—",
      date: v?.date ?? null,
      time: v?.time ?? null,
      venue: v?.venue ?? "",
      isVirtual: Boolean(v?.isVirtual),
      image: v?.image ?? null,
      status: String(v?.status ?? "pending").toLowerCase(), // pending | approved | rejected
      appliedAt: v?.appliedAt ?? null,
    };
  });
};

const normalizeAttending = (raw) =>
  Array.isArray(raw?.events) ? raw.events : Array.isArray(raw) ? raw : [];

const normalizeDonations = (raw) =>
  Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];

export default function PublicUserProfilePage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [attending, setAttending] = useState([]);
  const [volunteering, setVolunteering] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("attends");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await fetchUserById(id);
        if (!mounted) return;
        if (!u) {
          setNotFound(true);
          return;
        }
        setUser(u);

        const [att, vol, dons] = await Promise.allSettled([
          getAttendingDetails(id),
          listUserVolunteered(id),
          getUserDonations(id),
        ]);

        if (!mounted) return;

        if (att.status === "fulfilled") {
          setAttending(normalizeAttending(att.value));
        } else {
          toast.error(att.reason?.response?.data?.message || att.reason?.message || "Failed to load attending");
        }

        if (vol.status === "fulfilled") {
          setVolunteering(normalizeVolunteers(vol.value));
        } else {
          toast.error(vol.reason?.response?.data?.message || vol.reason?.message || "Failed to load volunteering");
        }

        if (dons.status === "fulfilled") {
          setDonations(normalizeDonations(dons.value));
        } else {
          toast.error(dons.reason?.response?.data?.message || dons.reason?.message || "Failed to load donations");
        }
      } catch (err) {
        if (mounted) {
          setNotFound(true);
          toast.error(err?.response?.data?.message || err?.message || "Failed to load user");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const stats = useMemo(() => {
    const totalDonations = (Array.isArray(donations) ? donations : []).reduce(
      (acc, d) => acc + Number(d?.amount || 0),
      0
    );
    const volunteeredApproved = (Array.isArray(volunteering) ? volunteering : []).filter(
      (v) => (v.status || "") === "approved"
    ).length;

    return {
      attendedCount: Array.isArray(attending) ? attending.length : 0,
      volunteeredCount: volunteeredApproved,
      totalDonations,
    };
  }, [attending, volunteering, donations]);

  if (loading) return <CenterSpinner label="Loading Profile..." />;

  if (notFound) {
    return (
      <section className="user-container">
        <div className="user-card" style={{ padding: 24, textAlign: "center" }}>
          <h2>User not found</h2>
          <p>We couldn’t find a profile for ID <strong>{id}</strong>.</p>
        </div>
      </section>
    );
  }

  console.log(donations);

  return (
    <UserProfileView
      user={user}
      stats={stats}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      attending={attending}
      volunteering={volunteering}
      donations={donations}
    />
  );
}
