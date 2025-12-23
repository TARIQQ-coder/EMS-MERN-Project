// src/services/departmentService.js
import axios from "axios";


// Important: This tells Axios to send cookies with every request
axios.defaults.withCredentials = true;

// Optional: Set base URL globally (cleaner)
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const departmentService = {
  getAll: () => axios.get("/api/departments"),
  create: (data) => axios.post("/api/departments", data),
  update: (id, data) => axios.put(`/api/departments/${id}`, data),
  getOne: (id) => axios.get(`/api/departments/${id}`),
  delete: (id) => axios.delete(`/api/departments/${id}`),
};