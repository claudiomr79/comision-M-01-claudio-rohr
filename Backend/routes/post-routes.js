const express = require("express");
const {
  ctrlCreatePost,
  ctrlDeletePost,
  ctrlGetAllPosts,
  ctrlGetPostById,
  ctrlUpdatePost,
  ctrlToggleLikePost,
} = require("../controllers/post-controllers.js");
const { protect, optionalAuth } = require("../middlewares/auth.js");
const { body, param } = require("express-validator");
const { applyValidations } = require("../middlewares/applyValidations.js");

const postsRouter = express.Router();

// Validation schemas
const createPostValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("desc")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("image")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Please provide a valid URL"),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),
  body("tags").optional().isString().withMessage("Tags must be a string"),
];

const updatePostValidation = [
  param("postId").isMongoId().withMessage("Please provide a valid post ID"),
  body("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("desc")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("image").optional().isURL().withMessage("Please provide a valid URL"),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),
  body("tags").optional().isString().withMessage("Tags must be a string"),
];

const findPostValidation = [
  param("postId").isMongoId().withMessage("Please provide a valid post ID"),
];

// Routes
postsRouter.get("/", optionalAuth, ctrlGetAllPosts);

postsRouter.get(
  "/:postId",
  findPostValidation,
  applyValidations,
  optionalAuth,
  ctrlGetPostById
);

postsRouter.post(
  "/",
  protect,
  createPostValidation,
  applyValidations,
  ctrlCreatePost
);

postsRouter.put(
  "/:postId",
  protect,
  updatePostValidation,
  applyValidations,
  ctrlUpdatePost
);

postsRouter.delete(
  "/:postId",
  protect,
  findPostValidation,
  applyValidations,
  ctrlDeletePost
);

postsRouter.post(
  "/:postId/like",
  protect,
  findPostValidation,
  applyValidations,
  ctrlToggleLikePost
);

module.exports = { postsRouter };
