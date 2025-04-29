import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/home");
  };
  const handleCreateAccount = () => navigate("/create-account");
  const handleUserLogin = () => navigate("/user-login");
  const handleDeleteAccount = () => navigate("/delete-account"); // ✅ Yeni buton

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
            </>
          )}
        </div>
      </header>
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

export default HomePage;
