import { supabase } from "./supabase";
import useAuthStore from "../store/authStore";

// Workout API functions using Supabase directly
export const workoutAPI = {
  // Get all workouts with pagination
  getWorkouts: async (params = {}) => {
    const { page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .order("workout_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get total count
    const { count, error: countError } = await supabase
      .from("workouts")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    return {
      data: {
        workouts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    };
  },

  // Create new workout
  createWorkout: async (data) => {
    const { data: workout, error } = await supabase
      .from("workouts")
      .insert([
        {
          workout_type: data.workoutType,
          duration_minutes: data.durationMinutes,
          notes: data.notes || null,
          workout_date: new Date(data.workoutDate),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      data: {
        message: "Workout created successfully",
        workout,
      },
    };
  },

  // Get workout statistics
  getStats: async () => {
    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*");

    if (error) throw error;

    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce(
      (sum, w) => sum + w.duration_minutes,
      0
    );
    const avgDuration =
      totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

    // Get this week's workouts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekWorkouts = workouts.filter(
      (w) => new Date(w.workout_date) >= oneWeekAgo
    );

    return {
      data: {
        totalWorkouts,
        totalMinutes,
        avgDuration,
        thisWeekWorkouts: thisWeekWorkouts.length,
      },
    };
  },

  // Get monthly data
  getMonthlyData: async (params = {}) => {
    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .order("workout_date", { ascending: true });

    if (error) throw error;

    return { data: workouts };
  },

  // Get dashboard data
  getDashboard: async () => {
    const [statsResult, workoutsResult] = await Promise.all([
      workoutAPI.getStats(),
      workoutAPI.getWorkouts({ limit: 10 }),
    ]);

    return {
      data: {
        stats: statsResult.data,
        recentWorkouts: workoutsResult.data.workouts,
      },
    };
  },
};

// Health check - just return success since we're using Supabase directly
export const healthCheck = () =>
  Promise.resolve({ data: { status: "OK", service: "Supabase" } });

export default { workoutAPI, healthCheck };
