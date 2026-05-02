import axios from "axios";

const apiClient = axios.create({
  // Ensure you include '/api' if your backend routes are prefixed that way
  baseURL: "https://bbms-backend-production-26c8.up.railway.app/api",
});

export default apiClient;
