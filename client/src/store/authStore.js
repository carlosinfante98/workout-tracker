import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../lib/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Auth functions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response.data;

          set({ user, token, isLoading: false });
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Login failed";
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          set({ isLoading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Registration failed";
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },

      // Initialize from localStorage
      initialize: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          set({
            token,
            user: JSON.parse(user),
          });
        }
      },

      // Get current state
      isAuthenticated: () => {
        const { token, user } = get();
        return Boolean(token && user);
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
