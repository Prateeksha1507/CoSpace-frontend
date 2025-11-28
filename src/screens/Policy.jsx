import React, { useState } from "react";
import "../styles/Policy.css";

const sections = [
  {
    title: "Information We Collect",
    content: (
      <>
        <p>
          We collect information essential for running the CoSpace platform, categorized as follows:
        </p>
        <ul>
          <li><strong>Account and Profile Data:</strong> This includes your name, email address, contact number, profile picture, and login credentials. We use this data to securely create and manage your account and, in the case of organizations, to perform necessary verification.</li>
          <li><strong>Financial and Transaction Data:</strong> When you make a donation, we collect the amount, transaction ID, and donor records to process the donation securely and issue receipts. Note: We do not store sensitive payment details (like full card numbers); these are managed by certified payment gateways.</li>
          <li><strong>Activity Data:</strong> We log information about your interactions, such as events you RSVP to, organizations you follow, volunteer sign-ups, and content you engage with (including messages sent via the Chats feature). This data is used to personalize your experience and track participation.</li>
          <li><strong>Technical Data:</strong> We automatically collect data like your device type, operating system, and IP address. This is used for platform security, fraud prevention, and to maintain performance.</li>
        </ul>
      </>
    ),
  },
  {
    title: "How We Share Your Information",
    content: (
      <>
        <p>
          We do not sell your personal data. We only share information in specific, necessary contexts:
        </p>
        <ul>
          <li><strong>Platform Operation:</strong> We share data with trusted service providers who help us run the platform (e.g., hosting, analytics, image storage via Cloudinary) and secure payment gateways for donation processing.</li>
          <li><strong>Organizational Coordination:</strong> When you Volunteer or Attend an event, your profile details are shared with the hosting NGO or Club to facilitate effective coordination and management of the initiative.</li>
          <li><strong>Legal Compliance:</strong> We will disclose information if required by law or in response to valid legal requests (e.g., court orders).</li>
          <li><strong>With Your Consent:</strong> Any sharing with other third parties will only occur after obtaining your explicit permission.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Your Privacy Rights",
    content: (
      <>
        <p>You have control over your information on CoSpace:</p>
        <ul>
          <li><strong>Access & Correction:</strong> You can view and update your data directly through your account settings.</li>
          <li><strong>Account Deletion:</strong> You have the right to request the deletion of your account and associated personal data.</li>
          <li><strong>Objection:</strong> You can manage your preferences and object to the processing of your data for certain purposes, such as receiving promotional communications.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <p>
        If you have any questions about this Privacy Policy, please contact us at:{" "}
        <a href="mailto:prakhar19raghuwanshi@cic.du.ac.in">prakhar19raghuwanshi@cic.du.ac.in</a>
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="privacy-container">
      <h1 className="privacy-title">CoSpace Privacy Policy</h1>
      <p className="privacy-meta">Effective Date: November 24, 2025</p>

      <section className="privacy-intro">
        <h3>Introduction</h3>
        <p>
          Your privacy is important to us. This policy explains what information CoSpace collects, how we use it, and your rights regarding that information. By using our platform, you agree to this policy.
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
                {sec.content}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="privacy-footer">
        <h3>Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:prakhar19raghuwanshi@cic.du.ac.in">prakhar19raghuwanshi@cic.du.ac.in</a>.
        </p>
      </section>
    </section>
  );
}
