// src/services/leaveService.js
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const leaveService = {
  getAll: () => axios.get("/api/leaves"),
  create: (data) => axios.post("/api/leaves", data),
  updateStatus: (id, status) => axios.patch(`/api/leaves/${id}/status`, { status }),
  delete: (id) => axios.delete(`/api/leaves/${id}`),
};