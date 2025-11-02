// src/pages/profile/MyUserProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import UserProfileView from "../../components/UserProfileView";
import { getCurrentActorDocument } from "../../api/authAPI";
import { listUserVolunteered } from "../../api/volunteerAPI";
import { getUserDonations } from "../../api/donationAPI";
import { getAttendingDetails } from "../../api/attendanceAPI";
import "../../styles/UserProfile.css";

export default function MyUserProfilePage() {
  const [user, setUser] = useState(null);
  const [attending, setAttending] = useState([]);
  const [volunteering, setVolunteering] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("attends");
  const [loading, setLoading] = useState(true);

  // --- Normalize volunteers response ---
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

  useEffect(() => {
    (async () => {
      try {
        const actor = await getCurrentActorDocument();
        if (!actor || actor.type !== "user") {
          toast.error("Not logged in as user");
          return;
        }
        setUser(actor);

        const [att, vol, dons] = await Promise.allSettled([
          getAttendingDetails(actor.id),
          listUserVolunteered(actor.id),
          getUserDonations(actor.id),
        ]);

        if (att.status === "fulfilled") {
          setAttending(Array.isArray(att.value?.events) ? att.value.events : []);
        } else {
          toast.error(att.reason?.message || "Failed to load attending");
        }

        if (vol.status === "fulfilled") {
          setVolunteering(normalizeVolunteers(vol.value));
        } else {
          toast.error(vol.reason?.message || "Failed to load volunteering");
        }

        if (dons.status === "fulfilled") {
          const arr =
            (Array.isArray(dons.value?.events) && dons.value.events) ||
            (Array.isArray(dons.value) && dons.value) ||
            [];
          setDonations(arr);
        } else {
          toast.error(dons.reason?.message || "Failed to load donations");
        }
      } catch (err) {
        toast.error(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const totalDonations = (Array.isArray(donations) ? donations : []).reduce(
      (acc, d) => acc + Number(d?.amount || 0),
      0
    );
    // ✅ Only count approved volunteer events
    const volunteeredApproved = (Array.isArray(volunteering) ? volunteering : []).filter(
      (v) => (v.status || "") === "approved"
    ).length;

    return {
      attendedCount: attending?.length || 0,
      volunteeredCount: volunteeredApproved,
      totalDonations,
    };
  }, [attending, volunteering, donations]);

  if (loading) return <div className="user-loading">Loading profile...</div>;
  if (!user) return <div className="user-loading">No user</div>;

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
