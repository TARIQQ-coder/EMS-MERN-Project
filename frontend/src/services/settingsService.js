// src/services/settingsService.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const settingsService = {
  getSettings: () => api.get("/settings").then((res) => res.data),
  updateSettings: (data) => api.patch("/settings", data).then((res) => res.data),
};