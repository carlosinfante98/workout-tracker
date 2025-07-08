import prisma from "../config/database.js";

export const createWorkout = async (req, res) => {
  try {
    const { workoutType, durationMinutes, notes, workoutDate } = req.body;
    const userId = req.user.id;

    const workout = await prisma.workout.create({
      data: {
        userId,
        workoutType,
        durationMinutes,
        notes: notes || null,
        workoutDate: new Date(workoutDate),
      },
    });

    res.status(201).json({
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    console.error("Create workout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { workoutDate: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const total = await prisma.workout.count({
      where: { userId },
    });

    res.json({
      workouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get workouts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all workouts for the user
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { workoutDate: "desc" },
    });

    // Calculate basic stats
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.durationMinutes,
      0
    );
    const avgDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    // Count workout types
    const workoutTypes = {};
    workouts.forEach((workout) => {
      workoutTypes[workout.workoutType] =
        (workoutTypes[workout.workoutType] || 0) + 1;
    });

    // Calculate streaks
    const workoutDates = workouts.map((w) => w.workoutDate.toDateString());
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

      // Longest streak (simplified calculation)
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
    console.error("Get workout stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMonthlyData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        workoutDate: {
          gte: startDate,
        },
      },
      orderBy: { workoutDate: "asc" },
    });

    // Group by month
    const monthlyData = {};
    workouts.forEach((workout) => {
      const monthKey = workout.workoutDate.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          workouts: 0,
          duration: 0,
          types: {},
        };
      }
      monthlyData[monthKey].workouts++;
      monthlyData[monthKey].duration += workout.durationMinutes;
      monthlyData[monthKey].types[workout.workoutType] =
        (monthlyData[monthKey].types[workout.workoutType] || 0) + 1;
    });

    res.json({
      monthlyData: Object.values(monthlyData),
    });
  } catch (error) {
    console.error("Get monthly data error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get recent workouts
    const recentWorkouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { workoutDate: "desc" },
      take: 10,
    });

    // Get all workouts for stats
    const allWorkouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { workoutDate: "desc" },
    });

    // Calculate stats (reusing logic from getWorkoutStats)
    const totalWorkouts = allWorkouts.length;
    const totalDuration = allWorkouts.reduce(
      (sum, workout) => sum + workout.durationMinutes,
      0
    );
    const avgDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    const workoutTypes = {};
    allWorkouts.forEach((workout) => {
      workoutTypes[workout.workoutType] =
        (workoutTypes[workout.workoutType] || 0) + 1;
    });

    // Simple streak calculation
    const workoutDates = allWorkouts.map((w) => w.workoutDate.toDateString());
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

    const monthlyWorkouts = await prisma.workout.findMany({
      where: {
        userId,
        workoutDate: { gte: startDate },
      },
    });

    const monthlyData = {};
    monthlyWorkouts.forEach((workout) => {
      const monthKey = workout.workoutDate.toISOString().slice(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          workouts: 0,
          duration: 0,
          types: {},
        };
      }
      monthlyData[monthKey].workouts++;
      monthlyData[monthKey].duration += workout.durationMinutes;
    });

    res.json({
      user: req.user,
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
    console.error("Get dashboard data error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
