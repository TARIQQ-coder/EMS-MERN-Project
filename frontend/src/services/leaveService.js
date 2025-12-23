import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const leaveService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return axios.get(`/api/leaves${query ? `?${query}` : ""}`);
  },
  updateStatus: (id, status) =>
    axios.put(`/api/leaves/${id}/status`, { status }),
  // Add more later: create, delete, etc.
};