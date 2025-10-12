import React, { useState } from "react";
import {
  Form,
  FormField,
  TextAreaField,
  CheckboxField,
  Button,
  FormActions,
  FileUploadField,
} from "../../components/Form"; 
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
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] || null
          : value,
    }));
  };

  const handlePreview = (e) => {
    e.preventDefault();
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
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v ?? ""));
    alert(`Publish Event clicked\n 
      Preview:\n${JSON.stringify(
        { ...form, image: form.image ? form.image.name : null },
        null,
        2
      )}`);
  };

  return (
    <main className="ce-container">
      <h1 className="ce-title">Create New Event</h1>

      <Form className="ui-form ce-form" onSubmit={handleSubmit}>
        <FormField
          name="title"
          label="Event Title"
          placeholder="Enter event title"
          value={form.title}
          onChange={onChange}
          required
        />

        <TextAreaField
          name="description"
          label="Event Description"
          placeholder="Enter description"
          value={form.description}
          onChange={onChange}
          required
        />

        <FormField
          name="date"
          type="date"
          label="Date"
          value={form.date}
          onChange={onChange}
          required
        />

        <FormField
          name="time"
          type="time"
          label="Time"
          value={form.time}
          onChange={onChange}
          required
        />

        <FormField
          name="location"
          label="Location"
          placeholder="Enter event location or select 'Virtual'"
          value={form.location}
          onChange={onChange}
          required={!form.virtual}
          helpText={form.virtual ? "Location not required for virtual events" : ""}
        />

        <CheckboxField
          name="virtual"
          label="Virtual Event"
          checked={form.virtual}
          onChange={onChange}
        />

        <FileUploadField
          name="image"
          label="Event Image/Poster"
          accept="image/*"
          onChange={onChange}
          value={form.image}
        />

        <TextAreaField
          name="skills"
          label="Required Volunteer Skills/Roles"
          placeholder="e.g., First aid, registration desk, photography"
          value={form.skills}
          onChange={onChange}
        />

        <FormField
          name="donationGoal"
          type="number"
          label="Donation Goal (Optional)"
          placeholder="Enter donation goal amount"
          value={form.donationGoal}
          onChange={onChange}
          min="0"
        />

        <FormActions align="end" className="ce-actions">
          <Button
            type="button"
            variant="outline"
            className="secondary-btn"
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button type="submit" variant="primary" className="primary-btn">
            Publish Event
          </Button>
        </FormActions>
      </Form>
    </main>
  );
}
