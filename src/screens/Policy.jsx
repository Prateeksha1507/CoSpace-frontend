import React, { useState } from "react";
import "../styles/Policy.css";

const sections = [
  {
    title: "Personal Information",
    content:
      "This includes your name, email address, contact number, profile picture, and any other information you provide when creating an account or updating your profile.",
  },
  {
    title: "Usage Data",
    content:
      "We collect information about how you interact with our platform, such as the events you attend, organizations you follow, and content you engage with.",
  },
  {
    title: "Device Information",
    content:
      "We may collect information about the devices you use to access CoSpace, including the device type, operating system, and unique device identifiers.",
  },
  {
    title: "Providing and Improving Services",
    content:
      "To operate, maintain, and improve CoSpace, and to provide you with a personalized experience.",
  },
  {
    title: "Communication",
    content:
      "To send you updates, notifications, and promotional materials related to CoSpace.",
  },
  {
    title: "Security",
    content:
      "To protect the security and integrity of our platform and to prevent fraud and abuse.",
  },
  {
    title: "With Your Consent",
    content:
      "We will share your information with third parties when we have your explicit consent to do so.",
  },
  {
    title: "Service Providers",
    content:
      "We may share information with service providers who assist us in operating our platform, such as hosting, analytics, and customer support.",
  },
  {
    title: "Legal Requirements",
    content:
      "We may disclose your information if required by law or in response to valid legal requests.",
  },
  {
    title: "Access and Correction",
    content:
      "You can access and update your personal information through your account settings.",
  },
  {
    title: "Deletion",
    content: "You can request the deletion of your account and associated data.",
  },
  {
    title: "Objection",
    content:
      "You can object to the processing of your personal information for certain purposes.",
  },
];

export default function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-meta">Effective Date: July 26, 2024</p>

      <section className="privacy-intro">
        <h3>Introduction</h3>
        <p>
          Welcome to CoSpace! Your privacy is important to us. This Privacy
          Policy explains how we collect, use, and protect your personal
          information when you use our platform. By using CoSpace, you agree to
          the terms outlined in this policy.
        </p>
      </section>

      <section className="privacy-sections">
        {sections.map((sec, idx) => (
          <div key={idx} className="privacy-item">
            <button
              className="privacy-header"
              onClick={() => toggle(idx)}
              aria-expanded={openIndex === idx}
            >
              {sec.title}
            </button>
            {openIndex === idx && (
              <div className="privacy-content">
                <p>{sec.content}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="privacy-footer">
        <h3>Contact Us</h3>
        <p>
          If you have any questions or concerns about this Privacy Policy, please
          contact us at <a href="mailto:privacy@cospace.com">privacy@cospace.com</a>.
        </p>
      </section>
    </section>
  );
}
