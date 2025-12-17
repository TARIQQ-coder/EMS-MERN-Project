// src/services/employeeService.js
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const employeeService = {
  getAll: () => axios.get("/api/employees"),
  create: (data) => axios.post("/api/employees", data),
  update: (id, data) => axios.put(`/api/employees/${id}`, data),
  delete: (id) => axios.delete(`/api/employees/${id}`),
};