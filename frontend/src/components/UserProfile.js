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
        setMessage("Profil yükleme hatası: " + error.response.data);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div>
      <h2>Kullanıcı Profili</h2>
      {message && <p>{message}</p>}
      {user && (
        <div>
          <p>Ad: {user.firstName}</p>
          <p>Soyad: {user.lastName}</p>
          <p>E-posta: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
