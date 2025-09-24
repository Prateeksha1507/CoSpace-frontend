import React from 'react';
import "../styles/footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/about" className="footer-link">About</a>
        <a href="/contact" className="footer-link">Contact</a>
        <a href="/privacy" className="footer-link">Privacy Policy</a>
        <a href="/terms" className="footer-link">Terms of Service</a>
      </div>
      <div className="footer-copyright">
        <p>&#169; 2025 CoSPace. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
