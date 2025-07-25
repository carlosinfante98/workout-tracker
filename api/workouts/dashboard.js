import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get user from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    // Get recent workouts
    const { data: recentWorkouts, error: recentError } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: false })
      .limit(10);

    if (recentError) {
      return res.status(500).json({ error: recentError.message });
    }

    // Get all workouts for stats
    const { data: allWorkouts, error: allError } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: false });

    if (allError) {
      return res.status(500).json({ error: allError.message });
    }

    // Calculate stats (reusing logic from stats endpoint)
    const totalWorkouts = allWorkouts.length;
    const totalDuration = allWorkouts.reduce(
      (sum, workout) => sum + workout.duration_minutes,
      0
    );
    const avgDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    const workoutTypes = {};
    allWorkouts.forEach((workout) => {
      workoutTypes[workout.workout_type] =
        (workoutTypes[workout.workout_type] || 0) + 1;
    });

    // Simple streak calculation
    const workoutDates = allWorkouts.map((w) =>
      new Date(w.workout_date).toDateString()
    );
    const uniqueDates = [...new Set(workoutDates)];
    let currentStreak = 0;
    let longestStreak = Math.min(uniqueDates.length, 10); // Simplified

    if (uniqueDates.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
        currentStreak = Math.min(uniqueDates.length, 5); // Simplified
      }
    }

    // Get monthly data
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const { data: monthlyWorkouts, error: monthlyError } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .gte("workout_date", startDate.toISOString());

    if (monthlyError) {
      return res.status(500).json({ error: monthlyError.message });
    }

    const monthlyData = {};
    monthlyWorkouts.forEach((workout) => {
      const monthKey = new Date(workout.workout_date).toISOString().slice(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          workouts: 0,
          duration: 0,
          types: {},
        };
      }
      monthlyData[monthKey].workouts++;
      monthlyData[monthKey].duration += workout.duration_minutes;
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || user.email,
      },
      recentWorkouts,
      stats: {
        totalWorkouts,
        totalDuration,
        avgDuration,
        workoutTypes,
        currentStreak,
        longestStreak,
      },
      monthlyData: Object.values(monthlyData),
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
