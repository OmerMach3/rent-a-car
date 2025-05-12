import axios from "axios";

const API_URL = "http://localhost:8081"; // base URL

export const login = async (username, password) => {
  try {
    // Kullanıcı adı ve şifreyi doğrudan gönderiyoruz
    const response = await axios.post(`${API_URL}/api/login`, {
      username: username, // artık username olarak gönderiyoruz, email değil
      password: password,
    });

    // API yanıtını doğrudan döndür
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
