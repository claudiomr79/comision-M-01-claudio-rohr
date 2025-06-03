import { Router } from "express";
import {
  ctrlRegisterUser,
  ctrlLoginUser,
  ctrlGetUserProfile,
  ctrlUpdateUserProfile,
} from "../controllers/user-controllers.js";
import { protect } from "../middlewares/auth.js";
import { body } from "express-validator";
import { applyValidations } from "../middlewares/applyValidations.js";

const userRouter = Router();

// Registration validation
const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Login validation
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Profile update validation
const profileUpdateValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
];

// Public routes
userRouter.post(
  "/register",
  registerValidation,
  applyValidations,
  ctrlRegisterUser
);
userRouter.post("/login", loginValidation, applyValidations, ctrlLoginUser);

// Protected routes
userRouter.get("/profile", protect, ctrlGetUserProfile);
userRouter.put(
  "/profile",
  protect,
  profileUpdateValidation,
  applyValidations,
  ctrlUpdateUserProfile
);

export { userRouter };
