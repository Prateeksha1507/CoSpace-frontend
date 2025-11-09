import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventForm from "../../components/EventForm";
import EventSection from "../../components/EventSection";
import Modal from "../../components/Modal";
import { publicFetch, authFetch } from "../../api/authAPI";
import LoadingSpinner, { CenterSpinner } from "../../components/LoadingSpinner"
import "../../styles/org/CreateEvent.css";

function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toInputTime(value) {
  if (!value) return "";

  if (/^\d{2}:\d{2}$/.test(String(value))) return value;
  const d = new Date(`1970-01-01T${value}`);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
}

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();

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

  const [serverImage, setServerImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [imagePreviewURL, setImagePreviewURL] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const evt = await publicFetch(`/api/events/${eventId}`);

        setForm({
          name: evt.name || "",
          description: evt.description || "",
          date: toInputDate(evt.date),
          time: toInputTime(evt.time),
          venue: evt.venue || "",
          isVirtual: !!evt.isVirtual,
          skills: Array.isArray(evt.skills) ? evt.skills.join(", ") : (evt.skills || ""),
          image: null,
        });
        setServerImage(evt.image || null);
      } catch (err) {
        setError(err.message || "Failed to load event.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [eventId]);

  const displayDate = useMemo(() => {
    if (!form.date) return "";
    try {
      if (form.time) {
        const d = new Date(`${form.date}T${form.time}`);
        return d.toLocaleString(undefined, {
          year: "numeric", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
      }
      const d = new Date(form.date);
      return d.toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch {
      return form.date;
    }
  }, [form.date, form.time]);

  useEffect(() => {
    if (!form.image) {
      if (imagePreviewURL) URL.revokeObjectURL(imagePreviewURL);
      setImagePreviewURL(null);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setImagePreviewURL(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  // Handlers
  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] || null
          : value,
    }));
  };

  const onPreview = () => setPreviewOpen(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("date", form.date);
      data.append("time", form.time);
      data.append("venue", form.venue);
      data.append("isVirtual", form.isVirtual);
      data.append("skills", form.skills);
      if (form.image) data.append("image", form.image); // only send if changed

      const res = await authFetch(`/api/events/update/${eventId}`, {
        method: "PUT",
        body: data,
      });

      setMessage("Event updated");
      // Update on-screen with latest
      setServerImage(res.event?.image || serverImage);
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
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

  const bannerForPreview = imagePreviewURL || serverImage || "/default-event.jpg";

  if (loading) return <CenterSpinner label="Loading…" />;
  if (error) return <section className="ce-container"><h1 className="ce-title">Edit Event</h1><p style={{ color: "red" }}>{error}</p></section>;

  return (
    <section className="ce-container">
      <h1 className="ce-title">Edit Event</h1>

      <EventForm
        form={form}
        loading={saving}
        onChange={onChange}
        onPreview={onPreview}
        onSubmit={onSubmit}
      />

      {message && <p className="ce-message">{message}</p>}
      {error && !loading && <p className="ce-message" style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 12 }}>
        <button className="secondary-btn" onClick={() => navigate(-1)}>Back</button>
      </div>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Event Preview">
        <EventSection
          banner={bannerForPreview}
          name={form.name}
          orgProfilePicture={null}
          orgName="Your Organization"
          orgType="Non-Profit"
          date={displayDate}
          isVirtual={form.isVirtual}
          venue={form.venue}
          description={form.description}
          skills={skillsArray}
          clickable={false}
        />
      </Modal>
    </section>
  );
}
