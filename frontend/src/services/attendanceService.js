// src/services/attendanceService.js
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const attendanceService = {
  getAttendance: (date) => {
    const query = date ? `?date=${date}` : "";
    return axios.get(`/api/attendance${query}`);
  },
  updateAttendance: (recordId, data) =>
    axios.put(`/api/attendance/${recordId}`, data), // We'll add this endpoint later if needed
};