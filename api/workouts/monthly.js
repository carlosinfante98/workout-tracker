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
    const { months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .gte("workout_date", startDate.toISOString())
      .order("workout_date", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Group by month
    const monthlyData = {};
    workouts.forEach((workout) => {
      const monthKey = new Date(workout.workout_date).toISOString().slice(0, 7); // YYYY-MM
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
      monthlyData[monthKey].types[workout.workout_type] =
        (monthlyData[monthKey].types[workout.workout_type] || 0) + 1;
    });

    res.json({
      monthlyData: Object.values(monthlyData),
    });
  } catch (error) {
    console.error("Monthly Data API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
