const express = require("express");
const {
  ctrlCreateComment,
  ctrlGetPostComments,
  ctrlUpdateComment,
  ctrlDeleteComment,
} = require("../controllers/comment-controllers.js");
const { protect } = require("../middlewares/auth.js");
const { body, param } = require("express-validator");
const { applyValidations } = require("../middlewares/applyValidations.js");

const commentRouter = express.Router();

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

module.exports = { commentRouter };
