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
// Esquema de validación para la creación de un post
const createPostValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required") // El título es obligatorio
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"), // Máximo 100 caracteres
  body("desc")
    .notEmpty()
    .withMessage("Description is required") // La descripción es obligatoria
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"), // Máximo 500 caracteres
  body("image")
    .notEmpty()
    .withMessage("Image URL is required") // La URL de la imagen es obligatoria
    .isURL()
    .withMessage("Please provide a valid URL"), // Debe ser una URL válida
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"), // Ubicación opcional, máximo 100 caracteres
  body("tags").optional().isString().withMessage("Tags must be a string"), // Tags opcional, debe ser string
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
// Archivo: post-routes.js
// Rutas de posts: endpoints CRUD y like/unlike con protección y validaciones
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
