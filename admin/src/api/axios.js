import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Envia token a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Captura token renovado e trata expiração
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["new-token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("🔄 Token renovado automaticamente!");
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const code = error.response.data?.code;

      if (code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN") {
        console.warn("🔐 Sessão expirada — redirecionando");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
