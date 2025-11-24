import React from "react";
import "../styles/Terms.css";

export default function TermsAndConditions() {
  return (
    <section className="tnc-container">
      <h1 className="tnc-title">CoSpace Terms and Conditions</h1>
      <p className="tnc-effective-date">
        <strong>Effective Date:</strong> November 24, 2025
      </p>

      <section className="tnc-section">
        <h3>1. User Accounts and Responsibility</h3>
        <p>
          <strong>Accuracy:</strong> You must provide accurate and complete
          information when registering or using our services.
        </p>
        <p>
          <strong>Account Security:</strong> You are responsible for maintaining
          the confidentiality of your account password and for all activities
          that occur under your account.
        </p>
        <p>
          <strong>Eligibility:</strong> You must not use CoSpace for any unlawful
          or prohibited activity.
        </p>
      </section>

      <section className="tnc-section">
        <h3>2. Platform Use and Content Rules</h3>
        <p>
          You agree to use CoSpace responsibly and lawfully. Prohibited actions
          include:
        </p>
        <ul>
          <li>Posting content that is offensive, harmful, defamatory, or violates the rights of others.</li>
          <li>Engaging in harassment, spam, or distributing malware.</li>
          <li>Attempting to interfere with the integrity or operation of the platform.</li>
        </ul>
        <p>
          CoSpace reserves the right to review, suspend, or permanently terminate
          any account that violates these rules or engages in fraudulent activity.
        </p>
      </section>

      <section className="tnc-section">
        <h3>3. Verification, Donations, and Organizations</h3>
        <p>
          These terms apply specifically to organizations and financial
          transactions:
        </p>
        <ul>
          <li>
            <strong>Verification:</strong> Organizations (NGOs, Clubs, Societies)
            must successfully complete our verification process to gain full
            platform access, including the ability to host events and receive
            funds.
          </li>
          <li>
            <strong>Donations:</strong> The ability to collect donations is
            restricted exclusively to verified NGOs. CoSpace relies on external
            payment gateways for secure processing but is not responsible for tax
            implications related to donations.
          </li>
          <li>
            <strong>Content Accuracy:</strong> Organizations are solely
            responsible for the accuracy and legality of the events, campaigns,
            and content they post.
          </li>
        </ul>
      </section>

      <section className="tnc-section">
        <h3>4. Intellectual Property (IP)</h3>
        <p>
          All content, design, logo (CoSpace), data, and software code on the
          platform are the property of CoSpace or its licensors and are protected
          by law. You may not use, copy, reproduce, or distribute any platform
          content without our express written permission.
        </p>
      </section>

      <section className="tnc-section">
        <h3>5. Disclaimers and Liability</h3>
        <p>
          CoSpace is provided on an "as is" and "as available" basis. We make no
          warranties regarding the platform's continuous availability or
          reliability.
        </p>
        <p>
          We are not responsible for any damages or losses arising from your use
          of CoSpace.
        </p>
        <p>
          We are not responsible for the actions, events, or content posted by
          external organizations or users.
        </p>
      </section>

      <section className="tnc-section">
        <h3>6. Governing Law and Disputes</h3>
        <p>
          These Terms are governed by the laws applicable in India. Any disputes
          arising from these Terms will be resolved through good-faith mediation
          or arbitration in accordance with applicable laws, and you waive the
          right to a jury trial.
        </p>
      </section>

      <section className="tnc-section">
        <h3>7. Version History</h3>
        <p>Version 1.0: Effective Date - November 24, 2025</p>
      </section>
    </section>
  );
}
