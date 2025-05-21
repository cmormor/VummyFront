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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      alert("Tu sesión ha caducado. Por favor, inicia sesión de nuevo.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
