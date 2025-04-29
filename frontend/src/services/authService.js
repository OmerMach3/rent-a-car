import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username: username,
      password: password
    });
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};



