import { useState } from "react";
import { login } from "../api/authAPI";
import {
  Form,
  FormField,
  Button,
  FormActions,
} from "../components/Form";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await login({ email, password });
      window.location.href = user.type === "org" ? "/org/home" : "/user/home";
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login to your account</h2>

        <Form className="login-form" onSubmit={handleSubmit}>
          <FormField
            name="email"
            type="email"yy
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormField
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="login-error ui-field__error">
              {error}
            </div>
          )}

          <p className="login-text">
            Not registered yet?{" "}
            <a href="/register" className="login-link">
              Create an account
            </a>
          </p>

          <FormActions align="center" className="btn-container">
            <Button type="submit" variant="primary" className="black-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </FormActions>
        </Form>
      </div>
    </div>
  );
}
