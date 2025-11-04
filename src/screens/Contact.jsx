import React, { useState } from "react";
import {
  Form,
  FormField,
  TextAreaField,
  Button,
  FormActions,
} from "../components/Form";
import "../styles/Contact.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form)
    alert(`Form submitted! Preview:\n${JSON.stringify(
        { ...form, image: form.image ? form.image.name : null },
        null,
        2
      )}`);
  };

  return (
    <main className="contact-container">
      <section className="contact-form-section">
        <h1 className="contact-title">Contact</h1>

        <Form className="contact-form" onSubmit={handleSubmit}>
          <FormField
            name="name"
            label="Your Name"
            placeholder="Enter your name"
            value={form.name}
            onChange={onChange}
            required
          />

          <FormField
            name="email"
            type="email"
            label="Your Email"
            placeholder="Enter your email"
            value={form.email}
            onChange={onChange}
            required
          />

          <FormField
            name="subject"
            label="Subject"
            placeholder="Enter subject"
            value={form.subject}
            onChange={onChange}
          />

          <TextAreaField
            name="message"
            label="Message"
            placeholder="Enter your message"
            value={form.message}
            onChange={onChange}
            required
            style={{ fontFamily: "inherit" }}
          />

          <FormActions align="center">
            <Button type="submit" variant="primary" className="primary-btn">
              Submit
            </Button>
          </FormActions>
        </Form>
      </section>

      <section className="contact-info-section">
        <h2 className="contact-subtitle">Contact Information</h2>
        <div className="contact-info-grid">
          <div>
            <h4>General Inquiries</h4>
            <p>info@coSpace.org</p>
          </div>
          <div>
            <h4>Support</h4>
            <p>support@coSpace.org</p>
          </div>
          <div>
            <h4>Partnerships</h4>
            <p>partnerships@coSpace.org</p>
          </div>
          <div>
            <h4>Phone</h4>
            <p>+1-555-123-4567</p>
          </div>
          <div>
            <h4>Address</h4>
            <p>
              123 Community Drive,
              <br />
              Anytown, USA
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}