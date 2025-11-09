import React, { useEffect, useMemo, useState } from "react";
import EventForm from "../../components/EventForm";
import EventSection from "../../components/EventSection";
import Modal from "../../components/Modal";
import { authFetch } from "../../api/authAPI";
import { toast } from "react-toastify";
import "../../styles/org/CreateEvent.css";
import { useNavigate } from "react-router-dom";  // Correct import for useNavigate
import CenterSpinner from "../../components/LoadingSpinner";

export default function CreateEvent() {
  const navigate = useNavigate();  // Correct usage of useNavigate
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imagePreviewURL, setImagePreviewURL] = useState(null);

  const displayDate = useMemo(() => {
    if (!form.date) return "";
    try {
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
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  };

  const handlePreview = () => setPreviewOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      toast.success(`Event created: ${res?.event?.name || "Success"}`);
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
      navigate("/dashboard");  // Correct usage of navigate
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Event creation failed";
      toast.error(msg);
      console.error("Event creation failed:", err);
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

  if (loading) return <CenterSpinner label="Loading" />;

  return (
    <section className="ce-container">
      <h1 className="ce-title">Create New Event</h1>

      <EventForm
        form={form}
        loading={loading}
        onChange={onChange}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
      />

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <EventSection
          banner={imagePreviewURL}
          name={form.name}
          orgProfilePicture={null}
          orgName={"Your Organization"}
          orgType={"Non-Profit"}
          date={displayDate}
          isVirtual={form.isVirtual}
          venue={form.venue}
          description={form.description}
          skills={skillsArray}
          clickable={false}
          actorType={"user"}  //So it looks like what user will see
        />
      </Modal>
    </section>
  );
}
