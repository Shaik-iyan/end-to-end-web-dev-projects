
import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

// Get students with search, filter, sorting and pagination
export const getStudents = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params: params
  });

  return response.data;
};

// Add student
export const addStudent = async (student) => {
  const response = await axios.post(API_URL, student);
  return response.data;
};

// Update student
export const updateStudent = async (id, student) => {
  const response = await axios.put(`${API_URL}/${id}`, student);
  return response.data;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
