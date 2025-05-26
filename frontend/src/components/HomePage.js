import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  // Admin authentication data
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // End user authentication data
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const userToken = localStorage.getItem("userToken");

  // Check if any user is authenticated (admin or end user)
  const isAdminAuthenticated = isAuthenticated();
  const isEndUserAuthenticated = !!userToken;
  const isAnyUserAuthenticated = isAdminAuthenticated || isEndUserAuthenticated;

  // Determine display name and current role
  const displayName = username || userName || "User";
  const currentRole = role || userRole;

  // Navigation handlers
  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    // Clear admin tokens
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // Clear end user tokens
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    // Redirect to home page
    navigate("/home");
  };

  const handleCreateAccount = () => navigate("/create-account");
  const handleUserLogin = () => navigate("/user-login");
  const handleDeleteAccount = () => navigate("/delete-account");
  const handleCarListing = () => navigate("/cars");
  const handleUserProfile = () => {
    // Get user ID from localStorage (set during login)
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/user-profile/${userId}`);
    } else {
      // Fallback to general profile page
      navigate("/user-profile");
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>Rent-A-Car</h1>

        {/* Right side navigation buttons */}
        <div style={buttonContainerStyle}>
          {!isAnyUserAuthenticated ? (
            // Show login/signup options when no user is authenticated
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
            // Show user info and logout when authenticated
            <>
              <div style={{ textAlign: "right", marginBottom: "10px" }}>
                <p style={{ fontSize: "20px", margin: "0" }}>
                  Welcome, {displayName}!
                </p>
                {currentRole === "END_USER" && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontStyle: "italic",
                    }}
                  >
                    End User Account
                  </span>
                )}
                {currentRole === "SYSTEM_ADMIN" && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontStyle: "italic",
                    }}
                  >
                    System Administrator
                  </span>
                )}
              </div>

              <button onClick={handleLogout} style={topButtonStyle}>
                Log Out
              </button>

              {/* Show profile button for end users */}
              {currentRole === "END_USER" && (
                <button onClick={handleUserProfile} style={topButtonStyle}>
                  My Profile
                </button>
              )}

              {/* Only show car management button for admin users */}
              {currentRole === "SYSTEM_ADMIN" && (
                <button onClick={handleCarListing} style={topButtonStyle}>
                  Car Management
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Main content area */}
      <div className="main-content" style={mainContentStyle}>
        <h2>Manage Your Car Fleet Efficiently</h2>
        <p>Welcome to the Rent-A-Car</p>

        {/* Admin-specific content */}
        {currentRole === "SYSTEM_ADMIN" && (
          <div className="admin-actions" style={adminActionsStyle}>
            <div
              className="action-card"
              style={actionCardStyle}
              onClick={handleCarListing}
            >
              <h3>Car Management</h3>
              <p>View, add, edit and manage your car inventory</p>
            </div>

            <div className="action-card" style={actionCardStyle}>
              <h3>Rental Management</h3>
              <p>Track active rentals and manage customer bookings</p>
            </div>

            <div className="action-card" style={actionCardStyle}>
              <h3>Reports & Analytics</h3>
              <p>View business insights and performance metrics</p>
            </div>
          </div>
        )}

        {/* End user-specific content */}
        {currentRole === "END_USER" && (
          <div className="user-actions" style={adminActionsStyle}>
            <div className="action-card" style={actionCardStyle}>
              <h3>Browse Available Cars</h3>
              <p>Explore our fleet and find the perfect car for your needs</p>
            </div>

            <div className="action-card" style={actionCardStyle}>
              <h3>My Reservations</h3>
              <p>View and manage your current and past reservations</p>
            </div>

            <div
              className="action-card"
              style={actionCardStyle}
              onClick={handleUserProfile}
            >
              <h3>Profile Settings</h3>
              <p>Update your personal information and preferences</p>
            </div>
          </div>
        )}

        {/* Content for non-authenticated users */}
        {!isAnyUserAuthenticated && (
          <div className="welcome-actions" style={adminActionsStyle}>
            <div
              className="action-card"
              style={actionCardStyle}
              onClick={handleCreateAccount}
            >
              <h3>Get Started</h3>
              <p>
                Create an account to start renting cars from our premium fleet
              </p>
            </div>

            <div
              className="action-card"
              style={actionCardStyle}
              onClick={handleUserLogin}
            >
              <h3>Already Have an Account?</h3>
              <p>Sign in to access your dashboard and manage reservations</p>
            </div>

            <div className="action-card" style={actionCardStyle}>
              <h3>Why Choose Us?</h3>
              <p>
                Premium vehicles, competitive rates, and excellent customer
                service
              </p>
            </div>
          </div>
        )}

        {/* Additional information section */}
        {!isAnyUserAuthenticated && (
          <div style={{ marginTop: "60px", textAlign: "center" }}>
            <h3 style={{ color: "#333", marginBottom: "20px" }}>
              Featured Services
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                flexWrap: "wrap",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <div style={featureStyle}>
                <h4>🚗 Wide Selection</h4>
                <p>Economy to luxury vehicles</p>
              </div>
              <div style={featureStyle}>
                <h4>📱 Easy Booking</h4>
                <p>Book online in minutes</p>
              </div>
              <div style={featureStyle}>
                <h4>🔧 Well Maintained</h4>
                <p>Regular maintenance & safety checks</p>
              </div>
              <div style={featureStyle}>
                <h4>🕒 24/7 Support</h4>
                <p>Round-the-clock customer service</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Style definitions
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
  padding: "5px 10px",
  borderRadius: "4px",
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
  textAlign: "left",
};

const featureStyle = {
  textAlign: "center",
  padding: "20px",
  minWidth: "150px",
};

// Add hover effects via CSS-in-JS
const styleElement = document.createElement("style");
styleElement.textContent = `
  .action-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;
if (!document.head.querySelector("style[data-homepage]")) {
  styleElement.setAttribute("data-homepage", "true");
  document.head.appendChild(styleElement);
}

export default HomePage;
