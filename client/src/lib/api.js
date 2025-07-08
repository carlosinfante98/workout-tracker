import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if it's NOT a login/register request
    if (error.response?.status === 401) {
      const isAuthRequest =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register");

      if (!isAuthRequest) {
        // Token expired or invalid for authenticated requests
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
};

// Workout API functions
export const workoutAPI = {
  create: (workoutData) => api.post("/workouts", workoutData),
  getAll: (params) => api.get("/workouts", { params }),
  getStats: () => api.get("/workouts/stats"),
  getMonthlyData: (months) => api.get(`/workouts/monthly?months=${months}`),
  getDashboard: () => api.get("/workouts/dashboard"),
};

// Health check
export const healthCheck = () =>
  axios.get(`${API_BASE_URL.replace("/api", "")}/health`);

export default api;
