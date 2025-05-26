import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UserProfilePage.css";

function ProfileViewPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is authenticated as end user
    const userToken = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");

    console.log("Auth check - Token:", !!userToken, "Role:", userRole);

    if (!userToken || userRole !== "END_USER") {
      console.log("Authentication failed, redirecting to login");
      navigate("/user-login");
      return;
    }

    // Fetch user profile data
    fetchUserProfile();
  }, [navigate, id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors

      const userToken = localStorage.getItem("userToken");

      if (!userToken) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      let response;
      const headers = {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      };

      if (id) {
        // Fetch by ID if provided
        console.log("Fetching profile for user ID:", id);
        console.log("Using headers:", headers);

        response = await axios.get(
          `http://localhost:8081/api/user/profile/${id}`,
          { headers }
        );
      } else {
        // Fallback to email method
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          setError("User email not found. Please login again.");
          setLoading(false);
          return;
        }

        console.log("Fetching profile for email:", userEmail);
        response = await axios.get(`http://localhost:8081/api/user/profile`, {
          headers,
          params: { email: userEmail },
        });
      }

      console.log("Profile data received:", response.data);
      setUserProfile(response.data);
      setError(""); // Clear any errors on success
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message =
          error.response.data?.message || "Unknown error occurred";

        console.log("Server error:", status, message);

        if (status === 401) {
          setError("Authentication failed. Please login again.");
          // Clear invalid tokens
          localStorage.removeItem("userToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userName");
          localStorage.removeItem("userRole");

          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/user-login");
          }, 2000);
        } else if (status === 404) {
          setError("User profile not found.");
        } else if (status === 403) {
          setError(
            "Access denied. You don't have permission to view this profile."
          );
        } else {
          setError(`Server error (${status}): ${message}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.log("Network error:", error.request);
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        console.log("Unexpected error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }

      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    const userId = localStorage.getItem("userId");
    if (id || userId) {
      navigate(`/update-profile/${id || userId}`);
    } else {
      navigate("/update-profile");
    }
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleRetry = () => {
    fetchUserProfile();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-view-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #4a90e2",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            ></div>
          </div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-view-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
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
            <strong>Error:</strong> {error}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="home-button"
              onClick={handleBackToHome}
              style={{
                backgroundColor: "#4a90e2",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Back to Home
            </button>

            <button
              onClick={handleRetry}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/user-login")}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔑 Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No profile found state
  if (!userProfile) {
    return (
      <div className="profile-view-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ marginBottom: "20px" }}>Profile not found.</p>
          <button className="home-button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Success state - Show profile
  return (
    <div className="profile-view-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="profile-actions">
          <button className="edit-profile-button" onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button className="home-button" onClick={handleBackToHome}>
            Home
          </button>
        </div>
      </div>

      {/* User ID Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            backgroundColor: "#e2f0fb",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#0c5460",
          }}
        >
          <strong>Debug Info:</strong> User ID: {userProfile.id}, URL ID: {id}
        </div>
      )}

      <div className="profile-info-section">
        <h3>Personal Information</h3>

        <div className="profile-info-item">
          <span className="profile-info-label">User ID:</span>
          <span className="profile-info-value">
            {userProfile.id || "Not available"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">First Name:</span>
          <span className="profile-info-value">
            {userProfile.firstName || "Not provided"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Last Name:</span>
          <span className="profile-info-value">
            {userProfile.lastName || "Not provided"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Email:</span>
          <span className="profile-info-value">
            {userProfile.email || "Not provided"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Phone Number:</span>
          <span className="profile-info-value">
            {userProfile.phoneNumber || "Not provided"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Birth Date:</span>
          <span className="profile-info-value">
            {formatDate(userProfile.birthDate)}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Gender:</span>
          <span className="profile-info-value">
            {userProfile.gender || "Not provided"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Birth Place:</span>
          <span className="profile-info-value">
            {userProfile.birthPlaceCity && userProfile.birthPlaceCountry
              ? `${userProfile.birthPlaceCity}, ${userProfile.birthPlaceCountry}`
              : "Not provided"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Address:</span>
          <span className="profile-info-value">
            {userProfile.address || "Not provided"}
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Account Status:</span>
          <span className="profile-info-value">
            <span>{userProfile.enabled ? " Active" : " Inactive"}</span>
          </span>
        </div>

        <div className="profile-info-item">
          <span className="profile-info-label">Member Since:</span>
          <span className="profile-info-value">
            {formatDate(userProfile.createdAt)}
          </span>
        </div>
      </div>

      <div className="profile-info-section">
        <h3>Quick Actions</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="edit-profile-button" onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button className="home-button" onClick={handleBackToHome}>
            Back to Home
          </button>
          <button
            onClick={handleRetry}
            style={{
              backgroundColor: "#17a2b8",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#138496")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#17a2b8")}
          >
            Refresh Profile
          </button>
        </div>
      </div>

      {/* Add CSS for loading animation */}
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

export default ProfileViewPage;
