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

    const recipient = "prakhar19raghuwanshi@cic.du.ac.in"; // or support email
    const { name, email, subject, message } = form;

    const body = `
    CoSpace team,
    ${message}
    Regards,
    Name: ${name}
    Email: ${email}

  `.trim();

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto; // opens the user's mail app with fields filled
  };


  return (
    <section className="contact-container">
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
            <p>
              <a href="mailto:prakhar19raghuwanshi@cic.du.ac.in" className="link">
                Prakhar Raghuwanshi
              </a>
            </p>
          </div>
          <div>
            <h4>Support</h4>
            <p>
              <a href="mailto:vijaysamant4368@cic.du.ac.in" className="link">
                Vijay Samant
              </a>
            </p>
          </div>
          <div>
            <h4>Phone</h4>
            <p>+91-7803941754</p>
          </div>
          <div>
            <h4>Address</h4>
            <p>
              Cluster Innovation Centre, University of Delhi,
              <br />GC Narang Road, Delhi, 110007
            </p>
          </div>
        </div>
      </section>


    </section>
  );
}