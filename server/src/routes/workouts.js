import express from "express";
import {
  createWorkout,
  getWorkouts,
  getWorkoutStats,
  getMonthlyData,
  getDashboardData,
} from "../controllers/workoutController.js";
import { validate, workoutSchema } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All workout routes require authentication
router.use(authenticateToken);

// Workout CRUD
router.post("/", validate(workoutSchema), createWorkout);
router.get("/", getWorkouts);

// Analytics
router.get("/stats", getWorkoutStats);
router.get("/monthly", getMonthlyData);
router.get("/dashboard", getDashboardData);

export default router;
