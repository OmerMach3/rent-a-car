// src/components/DeleteAccount.jsx
import React, { useState } from "react";
import axios from "axios";
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
  };

  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (confirmText !== "DELETE") {
      newErrors.confirmText = "Please type DELETE to confirm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setPassword("");
    setConfirmText("");
    setErrors({});
  };

  const handleConfirmDelete = async () => {
    if (validate()) {
      try {
        // Get email from session/localStorage or context
        const email = localStorage.getItem("userEmail"); // Example - adapt to your auth system

        const response = await axios.post(
          "http://localhost:8081/api/delete-account",
          {
            email: email,
            password: password,
          }
        );

        setSuccessMessage("Account successfully deleted");
        setShowModal(false);

        // Clear user data from local storage
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userToken");

        // Redirect to home page after a delay
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({
            submit:
              error.response.data.message || "Delete failed. Please try again.",
          });
        } else {
          setErrors({ submit: "Delete failed. Please try again." });
        }
      }
    }
  };

  return (
    <div className="delete-account-container">
      <h2>Security | Delete Account</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="delete-section">
        <p className="warning-text">
          Warning: Deleting your account is permanent and cannot be undone. All
          your data will be permanently removed.
        </p>

        <button onClick={handleDeleteClick} className="delete-button">
          Delete Account
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Account Deletion</h3>

            {errors.submit && (
              <div className="error-message">{errors.submit}</div>
            )}

            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            <div className="form-group">
              <label>Enter your password to confirm:</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label>Type DELETE to confirm:</label>
              <input
                type="text"
                value={confirmText}
                onChange={handleConfirmTextChange}
                className={errors.confirmText ? "error" : ""}
              />
              {errors.confirmText && (
                <span className="error-text">{errors.confirmText}</span>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={handleCancelDelete} className="cancel-button">
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="confirm-delete-button"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;

// CSS file
// src/components/DeleteAccount.css
