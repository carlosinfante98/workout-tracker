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
      set({ monthlyData: response.data });
    } catch (error) {
      console.error("Failed to fetch monthly data:", error);
    }
  },

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [dashboardResponse, monthlyResponse] = await Promise.all([
        workoutAPI.getDashboard(),
        workoutAPI.getMonthlyData(),
      ]);

      const { recentWorkouts, stats } = dashboardResponse.data;

      set({
        workouts: recentWorkouts,
        stats,
        monthlyData: monthlyResponse.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch dashboard data";
      set({ error: errorMessage, isLoading: false });
    }
  },

  createWorkout: async (workoutData) => {
    set({ error: null }); // Don't set loading to true to avoid blank screen
    try {
      const response = await workoutAPI.createWorkout(workoutData);
      const newWorkout = response.data.workout;

      // Optimistic update: immediately update UI without loading state
      const currentState = get();
      const currentWorkouts = currentState.workouts || [];
      const currentStats = currentState.stats || {};

      // Add new workout to the beginning of the list
      const updatedWorkouts = [newWorkout, ...currentWorkouts.slice(0, 19)];

      // Update stats optimistically
      const updatedStats = {
        ...currentStats,
        totalWorkouts: (currentStats.totalWorkouts || 0) + 1,
        totalDuration:
          (currentStats.totalDuration || 0) + newWorkout.durationMinutes,
        avgDuration: Math.round(
          ((currentStats.totalDuration || 0) + newWorkout.durationMinutes) /
            ((currentStats.totalWorkouts || 0) + 1)
        ),
      };

      // Update workout types count
      if (currentStats.workoutTypes) {
        updatedStats.workoutTypes = {
          ...currentStats.workoutTypes,
          [newWorkout.workoutType]:
            (currentStats.workoutTypes[newWorkout.workoutType] || 0) + 1,
        };
      }

      // Update state immediately for smooth UX
      set({
        workouts: updatedWorkouts,
        stats: updatedStats,
      });

      // Refresh monthly data in background (no loading state)
      get().fetchMonthlyData().catch(console.error);

      return { success: true, workout: newWorkout };
    } catch (error) {
      const errorMessage = error.message || "Failed to create workout";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Utility functions
  getWorkoutTypeIcon: (type) => {
    const icons = {
      cardio: "🏃",
      strength: "💪",
      flexibility: "🧘",
      sports: "⚽",
      yoga: "🧘‍♀️",
      gym: "🏋️",
      run: "🏃‍♂️",
      cycling: "🚴",
      swimming: "🏊",
      other: "🏃‍♂️",
    };
    return icons[type] || "🏃‍♂️";
  },

  getWorkoutTypeColor: (type) => {
    const colors = {
      cardio: "bg-gradient-to-br from-indigo-300 to-purple-400",
      strength: "bg-gradient-to-br from-pink-300 to-rose-400",
      flexibility: "bg-gradient-to-br from-blue-300 to-cyan-400",
      sports: "bg-gradient-to-br from-emerald-300 to-teal-400",
      yoga: "bg-gradient-to-br from-violet-300 to-purple-400",
      gym: "bg-gradient-to-br from-amber-300 to-orange-400",
      run: "bg-gradient-to-br from-orange-300 to-red-400",
      cycling: "bg-gradient-to-br from-green-300 to-emerald-400",
      swimming: "bg-gradient-to-br from-purple-300 to-indigo-400",
      other: "bg-gradient-to-br from-gray-300 to-slate-400",
    };
    return colors[type] || "bg-gradient-to-br from-gray-300 to-slate-400";
  },
}));
