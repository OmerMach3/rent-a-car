import axios from "axios";

const API_URL = "http://localhost:8081"; // base URL

export const login = async (username, password) => {
  try {
    console.log("Login attempt with:", { username, password }); // Debug için
    const response = await axios.post(`${API_URL}/api/login`, {
      username: username,
      password: password,
    });
    console.log("Login response:", response.data); // Debug için
    return response.data;
  } catch (error) {
    console.error("Login error details:", error.response || error); // Daha detaylı hata bilgisi
    throw error;
  }
};
