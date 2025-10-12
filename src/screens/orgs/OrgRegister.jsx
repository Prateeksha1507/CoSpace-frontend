import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  TextAreaField,
  CheckboxField,
  SelectField,
  Button,
  FormActions,
} from "../../components/Form";
import "../../styles/RoleRegister.css";

export default function OrgRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    orgName: "",
    orgType: "",
    contactPerson: "",
    email: "",
    password: "",
    confirmPassword: "",
    mission: "",
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

  const handleNext = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Could add validation here before navigating
    navigate("/register/verification");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Sign Up Your Organization</h2>

        <Form className="auth-form" onSubmit={handleNext}>
          <FormField
            name="username"
            label="Username"
            placeholder="Enter your organization's username"
            value={form.username}
            onChange={onChange}
            required
          />

          <FormField
            name="orgName"
            label="Organization Name"
            placeholder="Enter your organization's name"
            value={form.orgName}
            onChange={onChange}
            required
          />

          <SelectField
            name="orgType"
            label="Organization Type"
            value={form.orgType}
            onChange={onChange}
            required
            options={[
              { value: "", label: "Select organization type" },
              { value: "ngo", label: "NGO" },
              { value: "company", label: "Company" },
              { value: "education", label: "Educational Institution" },
            ]}
          />

          <FormField
            name="contactPerson"
            label="Contact Person"
            placeholder="Enter contact person's name"
            value={form.contactPerson}
            onChange={onChange}
            required
          />

          <FormField
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your organization's email"
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

          <TextAreaField
            name="mission"
            label="Organization Mission"
            placeholder="Enter mission statement"
            value={form.mission}
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
              Next
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
