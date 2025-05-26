import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EndUserLogin.css";

function EndUserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("http://localhost:8081/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store user data in localStorage - FIX: Added userId storage
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.firstName + " " + data.lastName);
        localStorage.setItem("userRole", "END_USER");
        localStorage.setItem("userId", data.userId); // FIXED: This was missing!

        // Redirect to home page
        navigate("/home");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>User Login</h2>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {/* ADDED: Forgot Password Link */}
          <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <span
              onClick={handleForgotPassword}
              style={{
                color: "#4a90e2",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "none",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Forgot My Password?
            </span>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={handleBackToHome} className="back-home-button">
            ← Back to Home
          </button>
          <p className="create-account-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/create-account")} className="link">
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EndUserLoginPage;
