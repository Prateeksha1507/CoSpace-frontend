import React from "react";
import "../styles/About.css";

export default function AboutPage() {
  return (
    <section className="about-container">
      <section className="about-section">
        <h2>About CoSpace</h2>
        <p>
          CoSpace is a dedicated web platform designed to be the definitive digital hub for Non-Governmental Organizations (NGOs), student clubs, and community societies. Our mission is to dismantle the barriers of low visibility, poor coordination, and scattered communication that prevent these vital organizations from maximizing their social impact.
        </p>
      </section>

      <section className="about-section">
        <h3>Our Solution</h3>
        <p>
          We created CoSpace to solve the fundamental challenges identified through our requirement analysis: attracting reliable volunteers, coordinating events, securing fundraising, and facilitating collaboration.
        </p>
        <p>
          CoSpace provides a single, unified digital space with the tools necessary to thrive:
        </p>
        <ul>
          <li><strong>Verified Organization Profiles:</strong> Building donor trust and organizational credibility through our registration and verification process.</li>
          <li><strong>Streamlined Volunteer Management:</strong> Easy sign-up, role assignment, attendance tracking, and recognition (certificates) to activate passive interest into active involvement.</li>
          <li><strong>Secure Fundraising:</strong> Integrated, secure donation channels (UPI/cards/wallets) enabled exclusively for verified NGOs.</li>
          <li><strong>Enhanced Collaboration:</strong> Dedicated spaces and tools to facilitate resource sharing and joint event planning between organizations.</li>
        </ul>
      </section>

      <section className="about-section">
        <h3>Our Impact</h3>
        <p>
          By centralizing communication, volunteer opportunities, and fundraising, CoSpace aims to dramatically increase community participation and organizational outreach. We are designed to foster a sustainable culture of social action, making it easier for every individual to find and contribute to the causes they care about.
        </p>
        <p>
          Join CoSpace and help us build a stronger, more connected community.
        </p>
        <p>#letscometogether</p>
      </section>

     
      <section className="about-section">
        <h3>Our Team</h3>
        <div className="team-grid">
          <div className="team-member">
            <img src="/team/akshita.jpeg"alt="Akshita Sheera" />
            <h4 className="member-name">Akshita Sheera</h4>
            <p className="role">Requirement Analyst</p>
            <div className="team-socials">
              <a href="https://github.com/AkshitaSheera" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/akshita-sheera-85b148289/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:akshitasheera@gmail.com">Email</a>
            </div>
          </div>

          <div className="team-member">
            <img src="/team/prateeksha.jpeg" alt="Prateeksha" />
            <h4 className="member-name">Prateeksha</h4>
            <p className="role">Designer</p>
            <div className="team-socials">
              <a href="https://github.com/Prateeksha1507" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/prateeksha-y/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:ygungun09@gmail.com">Email</a>
            </div>
          </div>

          <div className="team-member">
            <img src="/team/vijay.jpeg" alt="Vijay Samant" />
            <h4 className="member-name">Vijay Samant</h4>
            <p className="role">Developer</p>
            <div className="team-socials">
              <a href="https://github.com/VijaySamant4368" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/vijaysamant4368/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:vijaysamant4368@gmail.com">Email</a>
            </div>
          </div>

          <div className="team-member">
            <img src="/team/pratham.jpeg" alt="Pratham Singh Chauhan" />
            <h4 className="member-name">Pratham Singh Chauhan</h4>
            <p className="role">Tester</p>
            <div className="team-socials">
              <a href="https://github.com/Pratham2375" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/pratham-singh-chauhan-306624288/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:prathamchauhan230507@gmail.com">Email</a>
            </div>
          </div>

          <div className="team-member">
            <img src="/team/prakhar.jpeg" alt="Prakhar Raghuwanshi" />
            <h4 className="member-name">Prakhar Raghuwanshi</h4>
            <p className="role">Manager</p>
            <div className="team-socials">
              <a href="https://github.com/PrakharRaghuwanshi" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/prakhar-raghuwanshi-3a829828a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:prakhar19raghuwanshi2005@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
