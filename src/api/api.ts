import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.vummyapp.com/api/v1",
  // baseURL: "http://localhost:8080/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
