import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "http://localhost:8081/api/password/forgot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      // Check if response is ok first
      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 404) {
          setError(
            "Password reset service is currently unavailable. Please try again later or contact support."
          );
          return;
        } else if (response.status === 500) {
          setError("Server error occurred. Please try again later.");
          return;
        }
      }

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          setError("Invalid response from server. Please try again.");
          return;
        }
      } else {
        // If not JSON, try to get text
        const textResponse = await response.text();
        console.log("Non-JSON response:", textResponse);
        setError("Unexpected response format from server.");
        return;
      }

      if (response.ok) {
        setMessage(data.message || "Password reset email sent successfully.");
        setEmailSent(true);
        setEmail(""); // Clear the form
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Network/Fetch error:", error);

      // Check if it's a network error
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setError(
          "Cannot connect to server. Please ensure the backend server is running on port 8081."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/user-login";
  };

  const handleBackToHome = () => {
    window.location.href = "/home";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "24px",
            color: "#333",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          Forgot Password
        </h2>

        {!emailSent ? (
          <>
            <p
              style={{
                marginBottom: "20px",
                color: "#6c757d",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    padding: "12px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                    textAlign: "center",
                    border: "1px solid #f5c6cb",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                    textAlign: "left",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4a90e2";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(74, 144, 226, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ddd";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: isLoading ? "#a0c4e9" : "#4a90e2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#3a7bc8";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#4a90e2";
                  }
                }}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "15px",
                borderRadius: "4px",
                marginBottom: "20px",
                border: "1px solid #c3e6cb",
              }}
            >
              <strong> Email Sent!</strong>
              <p style={{ margin: "10px 0 0 0" }}>{message}</p>
            </div>

            <p
              style={{
                color: "#6c757d",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              Please check your email and click the reset link. The link will
              expire in 15 minutes.
            </p>

            <div
              style={{
                backgroundColor: "#fff3cd",
                color: "#856404",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "20px",
                fontSize: "12px",
              }}
            >
              <strong>Note:</strong> If you don't see the email in your inbox,
              please check your spam folder.
            </div>
          </div>
        )}

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            onClick={handleBackToLogin}
            style={{
              background: "none",
              border: "none",
              color: "#6c757d",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "15px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
              display: "block",
              width: "100%",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f8f9fa";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            ← Back to Login
          </button>

          <button
            onClick={handleBackToHome}
            style={{
              background: "none",
              border: "none",
              color: "#6c757d",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "15px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
              display: "block",
              width: "100%",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f8f9fa";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Back to Home
          </button>

          {emailSent && (
            <button
              onClick={() => {
                setEmailSent(false);
                setMessage("");
                setError("");
              }}
              style={{
                background: "#17a2b8",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s ease",
                width: "100%",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#138496";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#17a2b8";
              }}
            >
              Send Another Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
