// src/pages/org/CreateEvent.jsx
import React, { useEffect, useMemo, useState } from "react";
import EventForm from "../../components/EventForm";
import EventSection from "../../components/EventSection";
import Modal from "../../components/Modal";
import { authFetch } from "../../api/authAPI";
import "../../styles/org/CreateEvent.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    isVirtual: false,
    skills: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imagePreviewURL, setImagePreviewURL] = useState(null);

  // Build a single datetime string for display (or leave just date)
  const displayDate = useMemo(() => {
    if (!form.date) return "";
    try {
      // Combine date+time for nicer preview if time present
      if (form.time) {
        const iso = `${form.date}T${form.time}`;
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
          year: "numeric", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
      }
      const d = new Date(form.date);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch { return form.date; }
  }, [form.date, form.time]);

  // Keep an object URL for the selected image for preview
  useEffect(() => {
    if (!form.image) {
      if (imagePreviewURL) {
        URL.revokeObjectURL(imagePreviewURL);
        setImagePreviewURL(null);
      }
      return;
    }
    const url = URL.createObjectURL(form.image);
    setImagePreviewURL(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  };

  const handlePreview = () => setPreviewOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("date", form.date);
      data.append("time", form.time);
      data.append("venue", form.venue);
      data.append("isVirtual", form.isVirtual);
      data.append("skills", form.skills);
      if (form.image) data.append("image", form.image);

      const res = await authFetch("/api/events/create", {
        method: "POST",
        body: data,
      });

      setMessage(`Event created successfully: ${res.event.name}`);
      setForm({
        name: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        isVirtual: false,
        skills: "",
        image: null,
      });
    } catch (err) {
      console.error("Event creation failed:", err);
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const skillsArray = useMemo(
    () =>
      String(form.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.skills]
  );

  return (
    <main className="ce-container">
      <h1 className="ce-title">Create New Event</h1>

      <EventForm
        form={form}
        loading={loading}
        onChange={onChange}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
      />

      {message && <p className="ce-message">{message}</p>}

      {/* Preview Modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <EventSection
          banner={imagePreviewURL}
          name={form.name}
          orgProfilePicture={null}
          orgName={"Your Organization"}     /* optional placeholder */
          orgType={"Non-Profit"}            /* optional placeholder */
          date={displayDate}
          isVirtual={form.isVirtual}
          venue={form.venue}
          description={form.description}
          skills={skillsArray}
          clickable={false}
        />
      </Modal>
    </main>
  );
}
