import { Router } from "express";
import {
  ctrlCreateComment,
  ctrlGetPostComments,
  ctrlUpdateComment,
  ctrlDeleteComment,
} from "../controllers/comment-controllers.js";
import { protect } from "../middlewares/auth.js";
import { body, param } from "express-validator";
import { applyValidations } from "../middlewares/applyValidations.js";

const commentRouter = Router();

// Validation schemas
const createCommentValidation = [
  param("postId").isMongoId().withMessage("Please provide a valid post ID"),
  body("content")
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 300 })
    .withMessage("Comment cannot exceed 300 characters"),
];

const updateCommentValidation = [
  param("commentId")
    .isMongoId()
    .withMessage("Please provide a valid comment ID"),
  body("content")
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 300 })
    .withMessage("Comment cannot exceed 300 characters"),
];

const commentIdValidation = [
  param("commentId")
    .isMongoId()
    .withMessage("Please provide a valid comment ID"),
];

const postIdValidation = [
  param("postId").isMongoId().withMessage("Please provide a valid post ID"),
];

// Routes
commentRouter.get(
  "/post/:postId",
  postIdValidation,
  applyValidations,
  ctrlGetPostComments
);

commentRouter.post(
  "/post/:postId",
  protect,
  createCommentValidation,
  applyValidations,
  ctrlCreateComment
);

commentRouter.put(
  "/:commentId",
  protect,
  updateCommentValidation,
  applyValidations,
  ctrlUpdateComment
);

commentRouter.delete(
  "/:commentId",
  protect,
  commentIdValidation,
  applyValidations,
  ctrlDeleteComment
);

export { commentRouter };
