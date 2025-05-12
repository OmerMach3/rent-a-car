// authService.js - Email kullanacak şekilde güncellendi
import axios from "axios";

const API_URL = "http://localhost:8081"; // base URL

export const login = async (username, password) => {
  try {
    // Username'i email olarak gönderiyoruz
    const response = await axios.post(`${API_URL}/api/login`, {
      email: username, // username parametresini email olarak kullan
      password: password,
    });

    // Eğer response.data bir string ise, onu bir objeye dönüştür
    if (typeof response.data === "string") {
      return {
        token: response.data,
        username: username,
        role: "SYSTEM_ADMIN",
      };
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
