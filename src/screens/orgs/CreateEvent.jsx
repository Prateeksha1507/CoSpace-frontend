import React, { useState } from "react";
import "../../styles/org/CreateEvent.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    virtual: false,
    skills: "",
    donationGoal: "",
    image: null,
  });

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    // Replace with your preview modal / route
    alert(
      `Preview:\n${JSON.stringify(
        { ...form, image: form.image ? form.image.name : null },
        null,
        2
      )}`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your API call (FormData)
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v ?? ""));
    alert("Publish Event clicked (wire to backend)");
  };

  return (
    <main className="ce-container">
      <h1 className="ce-title">Create New Event</h1>

      <form className="ce-form" onSubmit={handleSubmit}>
        <label className="ce-label">Event Title</label>
        <input
          className="ce-input"
          name="title"
          placeholder="Enter  event title"
          value={form.title}
          onChange={onChange}
          required
        />

        <label className="ce-label">Event Description</label>
        <textarea
          className="ce-textarea"
          name="description"
          placeholder="Enter  description"
          value={form.description}
          onChange={onChange}
          required
        />

        <label className="ce-label">Date</label>
        <input
          className="ce-input"
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          required
        />

        <label className="ce-label">Time</label>
        <input
          className="ce-input"
          type="time"
          name="time"
          value={form.time}
          onChange={onChange}
          required
        />

        <label className="ce-label">Location</label>
        <input
          className="ce-input"
          name="location"
          placeholder="Enter  event location or select 'Virtual'"
          value={form.location}
          onChange={onChange}
          required={!form.virtual}
        />

        <label className="ce-checkbox">
          <input
            type="checkbox"
            name="virtual"
            checked={form.virtual}
            onChange={onChange}
          />
          <span>Virtual Event</span>
        </label>

        <label className="ce-label">Event Image/Poster</label>
        <div className="ce-file">
          <input
            id="eventImage"
            type="file"
            name="image"
            accept="image/*"
            onChange={onChange}
          />
          <label htmlFor="eventImage" className="btn secondary-btn">Upload  image</label>
          <span className="ce-file-name">
            {form.image ? form.image.name : "No file chosen"}
          </span>
        </div>

        <label className="ce-label">Required Volunteer Skills/Roles</label>
        <textarea
          className="ce-textarea"
          name="skills"
          placeholder="e.g., First aid, registration desk, photography"
          value={form.skills}
          onChange={onChange}
        />

        <label className="ce-label">Donation Goal (Optional)</label>
        <input
          className="ce-input"
          type="number"
          name="donationGoal"
          placeholder="Enter  donation goal amount"
          value={form.donationGoal}
          onChange={onChange}
          min="0"
        />

        <div className="ce-actions">
          <button className="btn secondary-btn" onClick={handlePreview} type="button">
            Preview
          </button>
          <button className="btn primary-btn" type="submit">
            Publish Event
          </button>
        </div>
      </form>
    </main>
  );
}
