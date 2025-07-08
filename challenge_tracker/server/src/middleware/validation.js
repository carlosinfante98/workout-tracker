import Joi from "joi";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

// User validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  fullName: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Workout validation schemas
export const workoutSchema = Joi.object({
  workoutType: Joi.string()
    .valid(
      "gym",
      "run",
      "cardio",
      "strength",
      "yoga",
      "cycling",
      "swimming",
      "sports",
      "other"
    )
    .required(),
  durationMinutes: Joi.number().integer().min(1).max(600).required(),
  notes: Joi.string().max(500).allow("", null),
  workoutDate: Joi.date().iso().required(),
});
