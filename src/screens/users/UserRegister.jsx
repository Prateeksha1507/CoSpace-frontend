// src/pages/auth/UserRegister.jsx
import React, { useState } from "react";
import {
  Form,
  FormField,
  CheckboxField,
  Button,
  FormActions,
  FileUploadField,
} from "../../components/Form";
import "../../styles/RoleRegister.css";
import { signup } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: "",
    tos: false,
    privacy: false,
    profileImage: null,
  });

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? (files?.[0] || null) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!form.tos || !form.privacy) {
      alert("You must accept Terms and Privacy Policy");
      return;
    }

    // Build FormData for multipart
    const data = new FormData();
    data.append("type", "user");
    data.append("name", form.fullname);
    data.append("email", form.email);
    data.append("username", form.username);
    data.append("password", form.password);
    if (form.interests) data.append("interests", form.interests);
    if (form.profileImage) data.append("profileImage", form.profileImage);

    try {
      const { actor } = await signup(data);
      if (actor.type == "user")
        navigate("/user/home")
      else
        navigate("/org/home")
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Join CoSpace</h2>

        <Form className="auth-form" onSubmit={handleSubmit}>
          <FormField name="username" label="Username" value={form.username} onChange={onChange} required />
          <FormField name="fullname" label="Full Name" value={form.fullname} onChange={onChange} required />
          <FormField name="email" type="email" label="Email" value={form.email} onChange={onChange} required />
          <FormField name="password" type="password" label="Password" value={form.password} onChange={onChange} required />
          <FormField name="confirmPassword" type="password" label="Confirm Password" value={form.confirmPassword} onChange={onChange} required />
          <FormField name="interests" label="Interests" placeholder="e.g., environment, health" value={form.interests} onChange={onChange} />

          <FileUploadField
            name="profileImage"
            label="Profile Image"
            accept="image/*"
            onChange={onChange}
            value={form.profileImage}
          />

          <CheckboxField name="tos" label={<><a href="/terms" className="auth-link">Terms of Service</a></>} checked={form.tos} onChange={onChange} required />
          <CheckboxField name="privacy" label={<><a href="/privacy" className="auth-link">Privacy Policy</a></>} checked={form.privacy} onChange={onChange} required />

          <FormActions align="center">
            <Button type="submit" variant="primary" className="primary-btn">Sign Up</Button>
          </FormActions>
        </Form>

        <p className="auth-footer">
          Already have an account? <a href="/login" className="auth-link">Log In</a>
        </p>
      </div>
    </div>
  );
}
