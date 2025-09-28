import React from "react";
import "../../styles/RoleRegister.css";

export default function UserRegister() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Join CoSpace</h2>

        <form className="auth-form">
          <label className="auth-label">Username</label>
          <input type="text" placeholder="Enter your username" className="auth-input" />

          <label className="auth-label">Full Name</label>
          <input type="text" placeholder="Enter your full name" className="auth-input" />

          <label className="auth-label">Email</label>
          <input type="email" placeholder="Enter your email" className="auth-input" />

          <label className="auth-label">Password</label>
          <input type="password" placeholder="Create a password" className="auth-input" />

          <label className="auth-label">Confirm password</label>
          <input type="password" placeholder="Confirm your password" className="auth-input" />

          <label className="auth-label">Interests</label>
          <input type="text" placeholder="Select your interests" className="auth-input" />

          <div className="auth-checkbox">
            <input type="checkbox" id="tos" />
            <label htmlFor="tos">
              I agree to the <a href="/terms" className="auth-link">Terms of Service</a>
            </label>
          </div>

          <div className="auth-checkbox">
            <input type="checkbox" id="privacy" />
            <label htmlFor="privacy">
              I have read and understand the <a href="/privacy" className="auth-link">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="primary-btn">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login" className="auth-link">Log In</a>
        </p>
      </div>
    </div>
  );
}
