import React, { useState, useEffect } from "react";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setError("No reset token found in URL");
      setCheckingToken(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      setCheckingToken(true);
      const response = await fetch(
        `http://localhost:8081/api/password/verify-token?token=${tokenToVerify}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError(data.message || "Invalid or expired reset token");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      setTokenValid(false);
      setError("Error verifying reset token");
    } finally {
      setCheckingToken(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("http://localhost:8081/api/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Clear the form
        setNewPassword("");
        setConfirmPassword("");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = "/user-login";
        }, 3000);
      } else {
        setError(data.message || "An error occurred while resetting password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred. Please try again.");
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

  const handleRequestNewReset = () => {
    window.location.href = "/forgot-password";
  };

  // Loading state while checking token
  if (checkingToken) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #4a90e2",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p>Verifying reset token...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
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
            textAlign: "center",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "24px",
              color: "#dc3545",
              fontSize: "24px",
            }}
          >
            Invalid Reset Link
          </h2>

          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "15px",
              borderRadius: "4px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
            }}
          >
            {error}
          </div>

          <p style={{ color: "#6c757d", marginBottom: "20px" }}>
            This reset link is invalid or has expired. Please request a new
            password reset.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={handleRequestNewReset}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Request New Reset Link
            </button>

            <button
              onClick={handleBackToLogin}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "transparent",
                color: "#6c757d",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          Reset Your Password
        </h2>

        {success ? (
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
              <strong>✅ Success!</strong>
              <p style={{ margin: "10px 0 0 0" }}>{success}</p>
            </div>

            <p style={{ color: "#6c757d", marginBottom: "20px" }}>
              You will be redirected to the login page in 3 seconds...
            </p>

            <button
              onClick={handleBackToLogin}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Go to Login Now
            </button>
          </div>
        ) : (
          <>
            <p
              style={{
                marginBottom: "20px",
                color: "#6c757d",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              Enter your new password below.
            </p>

            <div>
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
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

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
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
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
                }}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
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
              marginBottom: "10px",
              padding: "8px 12px",
              borderRadius: "4px",
            }}
          >
            ← Back to Login
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
export default ResetPassword;
