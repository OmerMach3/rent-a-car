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

    if (!userToken || userRole !== "END_USER") {
      navigate("/user-login");
      return;
    }

    // Fetch user profile data
    fetchUserProfile();
  }, [navigate, id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem("userToken");

      let response;
      if (id) {
        // Fetch by ID if provided
        response = await axios.get(
          `http://localhost:8081/api/user/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      } else {
        // Fallback to email method
        const userEmail = localStorage.getItem("userEmail");
        response = await axios.get(`http://localhost:8081/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            email: userEmail,
          },
        });
      }

      setUserProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to load profile data. Please try again.");
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (id) {
      navigate(`/update-profile/${id}`);
    } else {
      navigate("/update-profile");
    }
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="profile-view-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading profile data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-view-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#dc3545" }}>{error}</p>
          <button className="home-button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="profile-view-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Profile not found.</p>
          <button className="home-button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="profile-actions">
          <button className="edit-profile-button" onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button className="home-button" onClick={handleBackToHome}>
            🏠 Home
          </button>
        </div>
      </div>

      <div className="profile-info-section">
        <h3>Personal Information</h3>

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
            <span
              style={{
                color: userProfile.enabled ? "#28a745" : "#dc3545",
                fontWeight: "bold",
              }}
            >
              {userProfile.enabled ? "Active" : "Inactive"}
            </span>
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
            ✏️ Edit Profile
          </button>
          <button className="back-button" onClick={handleBackToHome}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileViewPage;
