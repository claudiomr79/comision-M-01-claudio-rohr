import { Router } from "express";
import {
  ctrlCreatePost,
  ctrlDeletePost,
  ctrlGetAllPosts,
  ctrlGetPostById,
  ctrlUpdatePost,
} from "../controllers/post-controllers.js";
import { createPostValidation } from "../validations/create-post-validations.js";
import { applyValidations } from "../middlewares/applyValidations.js";
import { findPostValidation } from "../validations/find-post-validations.js";
import { updatePostValidation } from "../validations/update-post-validations.js";
import { protectRoute } from "../middlewares/auth-middleware.js"; // Import protectRoute

const postsRouter = Router();

// Public routes
postsRouter.get("/", ctrlGetAllPosts);
postsRouter.get(
  "/:postId",
  findPostValidation,
  applyValidations,
  ctrlGetPostById
);

// Protected routes
postsRouter.post(
  "/",
  protectRoute, // Apply auth middleware
  createPostValidation,
  applyValidations,
  ctrlCreatePost
);

postsRouter.patch(
  "/:postId",
  protectRoute, // Apply auth middleware
  updatePostValidation,
  applyValidations,
  ctrlUpdatePost
);

postsRouter.delete(
  "/:postId",
  protectRoute, // Apply auth middleware
  findPostValidation, // It's good to validate postId format even before auth specific checks
  applyValidations,
  ctrlDeletePost
);

export { postsRouter };
