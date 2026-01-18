import axios from "axios";

// export const baseUrl = "http://localhost:4001/api";
export const baseUrl = "https://invoice-msanagement-system-78j3.vercel.app";

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
