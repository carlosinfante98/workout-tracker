import { supabase } from "./supabase";
import useAuthStore from "../store/authStore";

// Workout API functions using Supabase directly
export const workoutAPI = {
  // Get all workouts with pagination
  getWorkouts: async (params = {}) => {
    const { page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id) // Filter by current user
      .order("workout_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Transform snake_case to camelCase for frontend
    const transformedWorkouts =
      workouts?.map((workout) => ({
        id: workout.id,
        workoutType: workout.workout_type,
        durationMinutes: workout.duration_minutes,
        notes: workout.notes,
        workoutDate: workout.workout_date,
        createdAt: workout.created_at,
        updatedAt: workout.updated_at,
      })) || [];

    // Get total count for current user
    const { count, error: countError } = await supabase
      .from("workouts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) throw countError;

    return {
      data: {
        workouts: transformedWorkouts,
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
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const workoutData = {
      user_id: user.id,
      workout_type: data.workoutType,
      duration_minutes: data.durationMinutes,
      notes: data.notes || null,
      workout_date: new Date(data.workoutDate),
    };

    const { data: workout, error } = await supabase
      .from("workouts")
      .insert([workoutData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform the workout data to camelCase for frontend consistency
    const transformedWorkout = workout
      ? {
          id: workout.id,
          workoutType: workout.workout_type,
          durationMinutes: workout.duration_minutes,
          notes: workout.notes,
          workoutDate: workout.workout_date,
          createdAt: workout.created_at,
          updatedAt: workout.updated_at,
        }
      : {
          // Fallback if select() didn't return data due to RLS
          workoutType: data.workoutType,
          durationMinutes: data.durationMinutes,
          notes: data.notes,
          workoutDate: data.workoutDate,
        };

    return {
      data: {
        message: "Workout created successfully",
        workout: transformedWorkout,
      },
    };
  },

  // Get workout statistics
  getStats: async () => {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id); // Filter by current user

    if (error) throw error;

    if (!workouts || workouts.length === 0) {
      return {
        data: {
          totalWorkouts: 0,
          totalDuration: 0,
          avgDuration: 0,
          thisWeekWorkouts: 0,
          currentStreak: 0,
          longestStreak: 0,
          workoutTypes: [],
        },
      };
    }

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, w) => sum + w.duration_minutes,
      0
    );
    const avgDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    // Get this week's workouts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekWorkouts = workouts.filter(
      (w) => new Date(w.workout_date) >= oneWeekAgo
    );

    // Calculate streaks
    const sortedWorkouts = workouts
      .map((w) => new Date(w.workout_date).toDateString())
      .sort((a, b) => new Date(b) - new Date(a)); // Most recent first

    const uniqueDates = [...new Set(sortedWorkouts)];

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // Start from today or yesterday
    let startDate = uniqueDates.includes(today)
      ? today
      : uniqueDates.includes(yesterday)
      ? yesterday
      : null;

    if (startDate) {
      let checkDate = new Date(startDate);
      currentStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expectedDate = checkDate.toDateString();

        if (uniqueDates.includes(expectedDate)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const previousDate = new Date(uniqueDates[i - 1]);
      const dayDiff = (previousDate - currentDate) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate workout types distribution
    const workoutTypeCounts = {};
    workouts.forEach((w) => {
      workoutTypeCounts[w.workout_type] =
        (workoutTypeCounts[w.workout_type] || 0) + 1;
    });

    // Return as object for doughnut chart compatibility
    const workoutTypes = workoutTypeCounts;

    return {
      data: {
        totalWorkouts,
        totalDuration,
        avgDuration,
        thisWeekWorkouts: thisWeekWorkouts.length,
        currentStreak,
        longestStreak,
        workoutTypes,
      },
    };
  },

  // Get monthly data
  getMonthlyData: async (params = {}) => {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id) // Filter by current user
      .order("workout_date", { ascending: true });

    if (error) throw error;

    if (!workouts || workouts.length === 0) {
      return { data: [] };
    }

    // Group workouts by month
    const monthlyGroups = {};

    workouts.forEach((workout) => {
      const date = new Date(workout.workout_date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = {
          month: monthKey,
          workouts: 0,
          duration: 0,
        };
      }

      monthlyGroups[monthKey].workouts += 1;
      monthlyGroups[monthKey].duration += workout.duration_minutes;
    });

    // Convert to array and sort by month
    const monthlyData = Object.values(monthlyGroups).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    return { data: monthlyData };
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
