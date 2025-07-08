import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);

export default router;
