
import axios from "axios";

const API_URL ="https://end-to-end-web-dev-projects.onrender.com/api/auth";

// Register a new user
export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return response.data;
};

// Login an existing user
export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};

// Get the logged-in user's profile
export const getProfile = async (token) => {
  const response = await axios.get(
    `${API_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
