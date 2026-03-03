import axios from "axios";

const apiClient = axios.create({
  // Fixed the URL to match your ngrok terminal exactly
  baseURL: "https://jayceon-healthy-evelyne.ngrok-free.dev/api",
  timeout: 10000,
});

export default apiClient;
