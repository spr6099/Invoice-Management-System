import axios from "axios";

// export const baseUrl = "http://localhost:4001/api";
export const baseUrl = "https://api-invoice-management-system.onrender.com";

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
