import React from "react";
import "../styles/About.css";

export default function AboutPage() {
  return (
    <section className="about-container">
      <section className="about-section">
        <h2>About CoSpace</h2>
        <p>
          CoSpace is a platform dedicated to connecting non-profit organizations,
          college societies, and other community groups with individuals seeking
          opportunities for events, volunteering, and donations. Our mission is to
          empower communities to create positive change through collaboration and
          shared resources.
        </p>
      </section>

      <section className="about-section">
        <h3>Our Vision</h3>
        <p>
          To be the leading platform for community engagement, fostering a world
          where everyone can easily contribute to causes they care about.
        </p>
      </section>

      <section className="about-section">
        <h3>Our Values</h3>
        <p>
          Collaboration, Transparency, Impact, Inclusivity, and Empowerment.
        </p>
      </section>

      <section className="about-section">
        <h3>History</h3>
        <p>
          Founded in 2020, CoSpace began as a small initiative to bridge the gap
          between community organizations and volunteers. Over the years, we’ve
          grown into a thriving platform, facilitating thousands of connections
          and supporting countless community projects.
        </p>
      </section>

      <section className="about-section">
        <h3>Key Achievements</h3>
        <div className="achievements-box">
          <p>✔ Facilitated over 5,000 successful events</p>
          <p>✔ Connected over 10,000 volunteers with community organizations</p>
          <p>✔ Raised over $500,000 in donations for various causes</p>
        </div>
      </section>

      <section className="about-section">
        <h3>Our Team</h3>
        <div className="team-grid">
          <div className="team-member">
            <img src="/person.png" alt="Akshita Sheera" />
            <h4 className="member-name">Akshita Sheera</h4>
            <p className="role">Requirement Analyst</p>
                  <div className="team-socials">
        <a href="https://github.com/sarahchen" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/sarahchen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:sarah@cospace.com">Email</a>
      </div>
          </div>
          <div className="team-member">
            <img src="/person.png" alt="Prateeksha" />
            <h4 className="member-name">Prateeksha</h4>
            <p className="role">Designer</p>
            <div className="team-socials">
                <a href="https://github.com/sarahchen" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/sarahchen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:sarah@cospace.com">Email</a>
            </div>
          </div>
          <div className="team-member">
            <img src="/person.png" alt="Vijay Samant" />
            <h4 className="member-name">Vijay Samant</h4>
            <p className="role">Developer</p>
            <div className="team-socials">
                <a href="https://github.com/sarahchen" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/sarahchen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:sarah@cospace.com">Email</a>
            </div>
          </div>
          <div className="team-member">
            <img src="/person.png" alt="Pratham Singh Chauhan" />
            <h4 className="member-name">Pratham Singh Chauhan</h4>
            <p className="role">Tester</p>
            <div className="team-socials">
                <a href="https://github.com/sarahchen" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/sarahchen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:sarah@cospace.com">Email</a>
            </div>
          </div>
          <div className="team-member">
            <img src="/person.png" alt="Prakhar Raghuwanshi" />
            <h4 className="member-name">Prakhar Raghuwanshi</h4>
            <p className="role">Manager</p>
            <div className="team-socials">
                <a href="https://github.com/sarahchen" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/sarahchen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:sarah@cospace.com">Email</a>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
