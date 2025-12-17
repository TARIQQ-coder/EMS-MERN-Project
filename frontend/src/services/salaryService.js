// src/services/salaryService.js
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const salaryService = {
  getAll: () => axios.get("/api/salaries"),
  create: (data) => axios.post("/api/salaries", data),
  update: (id, data) => axios.put(`/api/salaries/${id}`, data),
  delete: (id) => axios.delete(`/api/salaries/${id}`),
};