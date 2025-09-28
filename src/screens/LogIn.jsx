import { useState } from "react";
import "../styles/Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login to your account</h2>

        <form className="login-form">
          <input
            type="text"
            placeholder="Enter your Username"
            className="login-input"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="login-input"
          />

          {/* Not registered yet */}
          <p className="login-text">
            Not registered yet?{" "}
            <a href="/register" className="login-link">
              Create an account
            </a>
          </p>

          {/* Login button */}
          <div className="btn-container">
            <button type="submit" className="black-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
