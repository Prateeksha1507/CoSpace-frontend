// src/pages/auth/OrgRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form, FormField, TextAreaField, CheckboxField, SelectField, Button, FormActions, FileUploadField
} from "../../components/Form";
import "../../styles/RoleRegister.css";
import { setToken, signup } from "../../api/authAPI";
import { showToast } from "../../components/ToastContainer";

const ORG_TYPES = [
  { value: "", label: "Select organization type" },
  { value: "NGO", label: "NGO" },
  { value: "Govt", label: "Government" },
  { value: "Company", label: "Company" },
  { value: "Club", label: "Club / Society" },
  { value: "Other", label: "Other" },
];

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
    website: "",
    mission: "",
    regId: "",
    affiliation: "",
    tos: false,
    privacy: false,
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? (files?.[0] || null) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return showToast("Passwords do not match", "error");
    if (!form.tos || !form.privacy) return showToast("You must accept Terms and Privacy Policy", "error");
    if (!form.orgType) return showToast("Please select organization type", "error");

    const data = new FormData();
    data.append("type", "org");
    data.append("username", form.username);
    data.append("name", form.orgName);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("headName", form.contactPerson);
    data.append("orgType", form.orgType);
    if (form.website) data.append("website", form.website);
    if (form.mission) data.append("mission", form.mission);
    if (form.regId) data.append("regId", form.regId);
    if (form.affiliation) data.append("affiliation", form.affiliation);
    if (form.profileImage) data.append("profileImage", form.profileImage); // <-- matches multer field

    try {
      setLoading(true);
      const { actor } = await signup(data);
      setToken(actor.token)
      // go to dashboard or verification
      // navigate("/register/verification");
      navigate("/org/home");
    } catch (err) {
      showToast(err?.message || "Organization signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Sign Up Your Organization</h2>

        <Form className="auth-form" onSubmit={handleSubmit}>
          <FormField name="username" label="Username" value={form.username} onChange={onChange} required />
          <FormField name="orgName" label="Organization Name" value={form.orgName} onChange={onChange} required />

          <SelectField name="orgType" label="Organization Type" value={form.orgType} onChange={onChange} required options={ORG_TYPES} />

          <FormField name="contactPerson" label="Contact Person" value={form.contactPerson} onChange={onChange} required />
          <FormField name="email" type="email" label="Email" value={form.email} onChange={onChange} required />
          <FormField name="password" type="password" label="Password" value={form.password} onChange={onChange} required />
          <FormField name="confirmPassword" type="password" label="Confirm Password" value={form.confirmPassword} onChange={onChange} required />

          <FormField name="website" label="Website (optional)" value={form.website} onChange={onChange} />
          <FormField name="regId" label="Registration ID (optional)" value={form.regId} onChange={onChange} />
          <FormField name="affiliation" label="Affiliation (optional)" value={form.affiliation} onChange={onChange} />
          <TextAreaField name="mission" label="Mission (optional)" value={form.mission} onChange={onChange} />

          <FileUploadField
            name="profileImage"
            label="Organization Logo / Profile Image"
            accept="image/*"
            onChange={onChange}
            value={form.profileImage}
          />

          <CheckboxField
            name="tos"
            label={<>I agree to the <a href="/terms" className="auth-link">Terms of Service</a></>}
            checked={form.tos}
            onChange={onChange}
            required
          />
          <CheckboxField
            name="privacy"
            label={<>I have read and understand the <a href="/privacy" className="auth-link">Privacy Policy</a></>}
            checked={form.privacy}
            onChange={onChange}
            required
          />

          <FormActions align="center">
            <Button type="submit" variant="primary" className="primary-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </FormActions>
        </Form>

        <p className="auth-footer">
          Already have an account? <a href="/login" className="auth-link">Log In</a>
        </p>
      </div>
    </div>
  );
}
