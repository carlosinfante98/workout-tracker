import { create } from "zustand";
import { workoutAPI } from "../lib/api";

export const useWorkoutStore = create((set, get) => ({
  workouts: [],
  stats: null,
  monthlyData: [],
  isLoading: false,
  error: null,

  // Pagination
  currentPage: 1,
  totalPages: 1,

  // Actions
  setWorkouts: (workouts) => set({ workouts }),
  setStats: (stats) => set({ stats }),
  setMonthlyData: (monthlyData) => set({ monthlyData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Fetch functions
  fetchWorkouts: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutAPI.getWorkouts({ page, limit: 20 });
      const { workouts, pagination } = response.data;

      set({
        workouts,
        currentPage: pagination.page,
        totalPages: pagination.pages,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch workouts";
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const response = await workoutAPI.getStats();
      set({ stats: response.data.stats });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  },

  fetchMonthlyData: async (months = 6) => {
    try {
      const response = await workoutAPI.getMonthlyData(months);
      set({ monthlyData: response.data.monthlyData });
    } catch (error) {
      console.error("Failed to fetch monthly data:", error);
    }
  },

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutAPI.getDashboard();
      const { recentWorkouts, stats, monthlyData } = response.data;

      set({
        workouts: recentWorkouts,
        stats,
        monthlyData,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch dashboard data";
      set({ error: errorMessage, isLoading: false });
    }
  },

  createWorkout: async (workoutData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutAPI.createWorkout(workoutData);
      const newWorkout = response.data.workout;

      // Add to current workouts list
      const currentWorkouts = get().workouts;
      set({
        workouts: [newWorkout, ...currentWorkouts.slice(0, 19)], // Keep only 20 most recent
        isLoading: false,
      });

      // Refresh stats
      get().fetchStats();

      return { success: true, workout: newWorkout };
    } catch (error) {
      const errorMessage = error.message || "Failed to create workout";
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Utility functions
  getWorkoutTypeIcon: (type) => {
    const icons = {
      gym: "🏋️‍♂️",
      run: "🏃‍♂️",
      cardio: "💓",
      strength: "💪",
      yoga: "🧘‍♀️",
      cycling: "🚴‍♂️",
      swimming: "🏊‍♂️",
      sports: "⚽",
      other: "🏃‍♂️",
    };
    return icons[type] || "🏃‍♂️";
  },

  getWorkoutTypeColor: (type) => {
    const colors = {
      gym: "bg-red-500",
      run: "bg-blue-500",
      cardio: "bg-pink-500",
      strength: "bg-purple-500",
      yoga: "bg-green-500",
      cycling: "bg-yellow-500",
      swimming: "bg-cyan-500",
      sports: "bg-orange-500",
      other: "bg-gray-500",
    };
    return colors[type] || "bg-gray-500";
  },
}));
