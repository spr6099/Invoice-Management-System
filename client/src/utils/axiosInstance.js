import axios from "axios";

export const baseUrl = "https://invoice-management-system-45db.vercel.app/api";

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
