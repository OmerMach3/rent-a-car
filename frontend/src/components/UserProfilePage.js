import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfilePage.css";

function UserProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [fetchingProfile, setFetchingProfile] = useState(true);

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
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      setFetchingProfile(true);
      const userToken = localStorage.getItem("userToken");
      const userEmail = localStorage.getItem("userEmail");

      const response = await axios.get(
        `http://localhost:8081/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            email: userEmail,
          },
        }
      );

      const userData = response.data;
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setFetchingProfile(false);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setErrors({
        fetch: "Failed to load profile data. Please try again.",
      });
      setFetchingProfile(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone number validation (optional but should be valid if provided)
    if (
      formData.phoneNumber &&
      !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    // Password validation (only if user wants to change password)
    if (
      formData.newPassword ||
      formData.confirmNewPassword ||
      formData.currentPassword
    ) {
      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "Current password is required to change password";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const userToken = localStorage.getItem("userToken");
      const currentEmail = localStorage.getItem("userEmail");

      // Prepare update data
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        currentEmail: currentEmail, // Send current email to identify user
      };

      // Add password fields only if user wants to change password
      if (formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(
        "http://localhost:8081/api/user/profile",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setSuccess("Profile updated successfully!");
      setLoading(false);

      // Update localStorage with new name if changed
      localStorage.setItem(
        "userName",
        `${formData.firstName} ${formData.lastName}`
      );
      localStorage.setItem("userEmail", formData.email);

      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      // Redirect to profile view page after 2 seconds
      setTimeout(() => {
        navigate("/user-profile");
      }, 2000);
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data) {
        if (error.response.status === 400) {
          setErrors({
            submit: error.response.data.message || "Invalid data provided.",
          });
        } else if (error.response.status === 401) {
          setErrors({
            submit: "Current password is incorrect.",
          });
        } else if (error.response.status === 409) {
          setErrors({
            submit: "Email is already in use by another account.",
          });
        } else {
          setErrors({
            submit: error.response.data.message || "Failed to update profile.",
          });
        }
      } else {
        setErrors({
          submit: "An error occurred while updating profile.",
        });
      }
    }
  };

  const handleBackToProfile = () => {
    navigate("/user-profile");
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleCancel = () => {
    navigate("/user-profile");
  };

  if (fetchingProfile) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading profile data...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Update Profile</h2>
        <div className="profile-actions">
          <button className="back-button" onClick={handleBackToProfile}>
            ← Back to Profile
          </button>
          <button className="home-button" onClick={handleBackToHome}>
            Home
          </button>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {errors.fetch && <div className="error-message">{errors.fetch}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-columns">
          <div className="form-column">
            <h3>Personal Information</h3>

            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && (
                <span className="error-text">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && (
                <span className="error-text">{errors.lastName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "error" : ""}
                placeholder="e.g., +1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <span className="error-text">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="form-column">
            <h3>Change Password (Optional)</h3>
            <p className="password-note">
              Leave blank if you don't want to change your password
            </p>

            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={errors.currentPassword ? "error" : ""}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <span className="error-text">{errors.currentPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={errors.newPassword ? "error" : ""}
                placeholder="Enter new password (min 6 characters)"
              />
              {errors.newPassword && (
                <span className="error-text">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className={errors.confirmNewPassword ? "error" : ""}
                placeholder="Confirm new password"
              />
              {errors.confirmNewPassword && (
                <span className="error-text">{errors.confirmNewPassword}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={handleBackToProfile}
          >
            Cancel
          </button>
          <button type="submit" className="update-button" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfilePage;
