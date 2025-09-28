import React from "react";
import "../../styles/RoleRegister.css";
import { useNavigate } from "react-router-dom";

export default function OrgRegister() {
  const navigate = useNavigate()
  function handleNext() {
    navigate("/register/verification")
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Sign Up Your Organization</h2>

        <form className="auth-form">
          <label className="auth-label">Username</label>
          <input type="text" placeholder="Enter your organization's username" className="auth-input" />

          <label className="auth-label">Organization Name</label>
          <input type="text" placeholder="Enter your organization's name" className="auth-input" />

          <label className="auth-label">Organization Type</label>
          <select className="auth-select">
            <option value="">Select organization type</option>
            <option value="ngo">NGO</option>
            <option value="company">Company</option>
            <option value="education">Educational Institution</option>
          </select>

          <label className="auth-label">Contact Person</label>
          <input type="text" placeholder="Enter contact person's name" className="auth-input" />

          <label className="auth-label">Email</label>
          <input type="email" placeholder="Enter your organization's email" className="auth-input" />

          <label className="auth-label">Password</label>
          <input type="password" placeholder="Create a password" className="auth-input" />

          <label className="auth-label">Confirm password</label>
          <input type="password" placeholder="Confirm your password" className="auth-input" />

          <label className="auth-label">Organization Mission</label>
          <textarea placeholder="Enter mission statement" className="auth-textarea"></textarea>

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

          <button type="submit" className="primary-btn" onClick={handleNext}>Next</button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login" className="auth-link">Log In</a>
        </p>
      </div>
    </div>
  );
}
