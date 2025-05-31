import express from 'express';
import { createComment, getCommentsByPostId } from '../controllers/comment-controllers.js';
import {
  createCommentValidations,
  getCommentsByPostIdValidations
} from '../validations/comment-validations.js';
import { applyValidations } from '../middlewares/applyValidations.js';
import { protectRoute } from '../middlewares/auth-middleware.js';

const router = express.Router({ mergeParams: true }); // Ensure mergeParams is true to access :postId from parent router

// Route to create a new comment for a specific post
// POST /api/posts/:postId/comments
router.post(
  '/', // The path is relative to where this router is mounted in app.js (e.g. /api/posts/:postId/comments)
  protectRoute, // User must be authenticated
  getCommentsByPostIdValidations, // Validates :postId from param
  createCommentValidations,     // Validates 'text' from body
  applyValidations,
  createComment
);

// Route to get all comments for a specific post
// GET /api/posts/:postId/comments
router.get(
  '/', // The path is relative to where this router is mounted in app.js (e.g. /api/posts/:postId/comments)
  getCommentsByPostIdValidations, // Validates :postId from param
  applyValidations,
  getCommentsByPostId
);

export default router;
