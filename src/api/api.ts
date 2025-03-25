import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "https://api.vummyapp.com/api/v1",
  baseURL: "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

export default API;
