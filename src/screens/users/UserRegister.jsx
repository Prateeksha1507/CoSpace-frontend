import React, { useState } from "react";
import {
  Form,
  FormField,
  CheckboxField,
  Button,
  FormActions,
} from "../../components/Form";
import "../../styles/RoleRegister.css";

export default function UserRegister() {
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: "",
    tos: false,
    privacy: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert(`Sign Up submitted successfully! Preview:\n${JSON.stringify(
        { ...form, image: form.image ? form.image.name : null },
        null,
        2
      )}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Join CoSpace</h2>

        <Form className="auth-form" onSubmit={handleSubmit}>
          <FormField
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={form.username}
            onChange={onChange}
            required
          />

          <FormField
            name="fullname"
            label="Full Name"
            placeholder="Enter your full name"
            value={form.fullname}
            onChange={onChange}
            required
          />

          <FormField
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChange={onChange}
            required
          />

          <FormField
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            value={form.password}
            onChange={onChange}
            required
          />

          <FormField
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={onChange}
            required
          />

          <FormField
            name="interests"
            label="Interests"
            placeholder="Select your interests"
            value={form.interests}
            onChange={onChange}
          />

          <CheckboxField
            name="tos"
            label={
              <>
                I agree to the{" "}
                <a href="/terms" className="auth-link">
                  Terms of Service
                </a>
              </>
            }
            checked={form.tos}
            onChange={onChange}
            required
          />

          <CheckboxField
            name="privacy"
            label={
              <>
                I have read and understand the{" "}
                <a href="/privacy" className="auth-link">
                  Privacy Policy
                </a>
              </>
            }
            checked={form.privacy}
            onChange={onChange}
            required
          />

          <FormActions align="center">
            <Button type="submit" variant="primary" className="primary-btn">
              Sign Up
            </Button>
          </FormActions>
        </Form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="auth-link">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
