
import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

// Get authentication token
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get all students
export const getStudents = async (params = {}) => {
  const response = await axios.get(
    API_URL,
    {
      ...getAuthConfig(),
      params
    }
  );

  return response.data;
};

// Add student
export const addStudent = async (student) => {
  const response = await axios.post(
    API_URL,
    student,
    getAuthConfig()
  );

  return response.data;
};

// Update student
export const updateStudent = async (id, student) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    student,
    getAuthConfig()
  );

  return response.data;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};
