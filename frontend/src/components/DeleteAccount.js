// frontend/src/components/DeleteAccount.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DeleteAccount.css";

function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        "http://localhost:8081/api/user/deleteAccount",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Your account has been successfully deleted.");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="delete-account-container">
      <h2>Delete Account</h2>
      <form onSubmit={handleSubmit} className="delete-account-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="delete-button">
          Delete My Account
        </button>
      </form>
    </div>
  );
}

export default DeleteAccount;
