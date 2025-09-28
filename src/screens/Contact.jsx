import React from "react";
import "../styles/Contact.css";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted! (wire this up to backend/email API)");
  };

  return (
    <main className="contact-container">
      <section className="contact-form-section">
        <h1 className="contact-title">Contact</h1>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="contact-label">Your Name</label>
          <input type="text" placeholder="Enter your name" className="contact-input" required />

          <label className="contact-label">Your Email</label>
          <input type="email" placeholder="Enter your email" className="contact-input" required />

          <label className="contact-label">Subject</label>
          <input type="text" placeholder="Enter subject" className="contact-input" />

          <label className="contact-label">Message</label>
          <textarea placeholder="Enter your message" className="contact-textarea" required></textarea>

          <button type="submit" className="primary-btn">Submit</button>
        </form>
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
            <p>123 Community Drive,<br />Anytown, USA</p>
          </div>
        </div>
      </section>
    </main>
  );
}
