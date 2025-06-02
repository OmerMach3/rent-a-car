import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/user/profile"
        );
        setUser(response.data);
      } catch (error) {
        setMessage("error loading user profile: " + error.response.data);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {message && <p>{message}</p>}
      {user && (
        <div>
          <p>Name: {user.firstName}</p>
          <p>Surname:: {user.lastName}</p>
          <p>E-mail: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
