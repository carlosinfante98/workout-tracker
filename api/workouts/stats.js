const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
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
    // Get all workouts for the user
    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate basic stats
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.duration_minutes,
      0
    );
    const avgDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    // Count workout types
    const workoutTypes = {};
    workouts.forEach((workout) => {
      workoutTypes[workout.workout_type] =
        (workoutTypes[workout.workout_type] || 0) + 1;
    });

    // Calculate streaks
    const workoutDates = workouts.map((w) =>
      new Date(w.workout_date).toDateString()
    );
    const uniqueDates = [...new Set(workoutDates)].sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (uniqueDates.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      // Current streak
      if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
        let checkDate = new Date();
        while (uniqueDates.includes(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      // Longest streak calculation
      const sortedDates = uniqueDates
        .map((date) => new Date(date))
        .sort((a, b) => a - b);

      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const daysDiff =
            (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
          if (daysDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    res.json({
      stats: {
        totalWorkouts,
        totalDuration,
        avgDuration,
        workoutTypes,
        currentStreak,
        longestStreak,
      },
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
