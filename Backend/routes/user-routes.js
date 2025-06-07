const express = require("express");
const {
  ctrlRegisterUser,
  ctrlLoginUser,
  ctrlGetUserProfile,
  ctrlUpdateUserProfile,
} = require("../controllers/user-controllers.js");
const { protect } = require("../middlewares/auth.js");
const { body } = require("express-validator");
const { applyValidations } = require("../middlewares/applyValidations.js");

const userRouter = express.Router();

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

module.exports = { userRouter };
