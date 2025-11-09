import React from "react";
import {
  Form,
  FormField,
  TextAreaField,
  CheckboxField,
  Button,
  FormActions,
  FileUploadField,
} from "./Form";
import { InlineSpinner } from "./LoadingSpinner";

export default function EventForm({
  form,
  loading = false,
  onChange,
  onPreview,
  onSubmit,
}) {
  return (
    <Form className="ui-form ce-form" onSubmit={onSubmit}>
      <FormField
        name="name"
        label="Event Title"
        placeholder="Enter event title"
        value={form.name}
        onChange={onChange}
        required
      />

      <TextAreaField
        name="description"
        label="Event Description"
        placeholder="Enter a brief description"
        value={form.description}
        onChange={onChange}
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
        name="venue"
        label="Venue / Location"
        placeholder="Enter location or meeting link"
        value={form.venue}
        onChange={onChange}
        required={!form.isVirtual}
        helpText={form.isVirtual ? "Venue not required for virtual events" : ""}
      />

      <CheckboxField
        name="isVirtual"
        label="Virtual Event"
        checked={!!form.isVirtual}
        onChange={onChange}
      />

      <FileUploadField
        name="image"
        label="Event Banner / Poster"
        accept="image/*"
        onChange={onChange}
        value={form.image}
      />

      <TextAreaField
        name="skills"
        label="Required Volunteer Skills / Roles"
        placeholder="e.g., First aid, registration desk, photography"
        value={form.skills}
        onChange={onChange}
      />

      <FormActions align="end" className="ce-actions">
        <Button
          type="button"
          variant="outline"
          className="secondary-btn"
          onClick={onPreview}
        >
          Preview
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="primary-btn"
          disabled={loading}
        >
          {loading ? <InlineSpinner label="" /> : "Publish Event"}
        </Button>
      </FormActions>
    </Form>
  );
}
