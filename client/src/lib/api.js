import axios from "axios";
import useAuthStore from "../store/authStore";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor
api.interceptors.request.use(
  (config) => {
    const authHeaders = useAuthStore.getState().getAuthHeader();
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const workoutAPI = {
  // Get all workouts with pagination
  getWorkouts: (params = {}) => api.get("/workouts", { params }),

  // Create new workout
  createWorkout: (data) => api.post("/workouts", data),

  // Get workout statistics
  getStats: () => api.get("/workouts/stats"),

  // Get monthly data
  getMonthlyData: (params = {}) => api.get("/workouts/monthly", { params }),

  // Get dashboard data
  getDashboard: () => api.get("/workouts/dashboard"),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
