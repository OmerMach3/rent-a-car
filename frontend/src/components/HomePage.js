import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/home");
  };
  const handleCreateAccount = () => navigate("/create-account");
  const handleUserLogin = () => navigate("/user-login");
  const handleDeleteAccount = () => navigate("/delete-account");
  const handleCarListing = () => navigate("/cars");

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
          Rent-A-Car Management System
        </h1>

        {/* Sağ üst köşedeki butonlar */}
        <div style={buttonContainerStyle}>
          {!isAuthenticated() ? (
            <>
              <button onClick={handleLogin} style={topButtonStyle}>
                Admin Login
              </button>
              <button onClick={handleCreateAccount} style={topButtonStyle}>
                Create Account
              </button>
              <button onClick={handleUserLogin} style={topButtonStyle}>
                End User Login
              </button>
              <button onClick={handleDeleteAccount} style={topButtonStyle}>
                Delete Account
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: "20px" }}>Welcome, {username}!</p>
              <button onClick={handleLogout} style={topButtonStyle}>
                Log Out
              </button>

              {/* Only show car management button for admin users */}
              {role === "SYSTEM_ADMIN" && (
                <button onClick={handleCarListing} style={topButtonStyle}>
                  Car Management
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Main content with call-to-action buttons */}
      <div className="main-content" style={mainContentStyle}>
        <h2>Manage Your Car Fleet Efficiently</h2>
        <p>Welcome to the Rent-A-Car Management System.</p>

        {isAuthenticated() && role === "SYSTEM_ADMIN" && (
          <div className="admin-actions" style={adminActionsStyle}>
            <div
              className="action-card"
              style={actionCardStyle}
              onClick={handleCarListing}
            >
              <h3>Car Management</h3>
              <p>View, add, edit and manage your car inventory</p>
            </div>

            {/* Diğer kartlar kaldırıldı */}
          </div>
        )}
      </div>
    </div>
  );
}

// 🔧 Stil tanımları

const buttonContainerStyle = {
  position: "absolute",
  top: "20px",
  right: "50px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  alignItems: "flex-end",
  zIndex: 1000,
};

const topButtonStyle = {
  background: "none",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  color: "rgba(38, 128, 170, 0.95)",
  transition: "color 0.3s ease, transform 0.3s ease",
};

const mainContentStyle = {
  textAlign: "center",
  padding: "50px 20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const adminActionsStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "30px",
  marginTop: "40px",
};

const actionCardStyle = {
  background: "white",
  borderRadius: "8px",
  padding: "25px",
  width: "300px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

export default HomePage;
