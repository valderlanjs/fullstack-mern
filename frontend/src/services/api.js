// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api", 
  // ou direto: "https://backend-b5g4.onrender.com/api"
});

export default api;
