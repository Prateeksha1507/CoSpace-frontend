import { useState } from "react";
import { login } from "../api/authAPI"; //
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
      console.log("Logged in as:", user);
      // Redirect to home or dashboard
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

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <input
            type="text"
            placeholder="Enter your Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Error */}
          {error && <p className="login-error">{error}</p>}

          {/* Not registered yet */}
          <p className="login-text">
            Not registered yet?{" "}
            <a href="/register" className="login-link">
              Create an account
            </a>
          </p>

          {/* Login button */}
          <div className="btn-container">
            <button type="submit" className="black-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
