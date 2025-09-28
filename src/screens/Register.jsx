import React from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        if (role === "organization") {
            navigate("/register/organization"); // Redirect to Organization page
        } else if (role === "user") {
            navigate("/register/user");
        }
    };

  return (
    <div className="role-container">
      <h2 className="role-title">What role best describes you?</h2>

      <div className="role-options">
        <button className="role-button secondary-btn" onClick={() => handleRoleSelection("organization")}>Organization</button>
        <button className="role-button primary-btn" onClick={() => handleRoleSelection("user")}>User</button>
      </div>
    </div>
  );
}
