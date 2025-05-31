import { body, param } from 'express-validator';

export const createCommentValidations = [
  body('text')
    .notEmpty()
    .withMessage('Comment text cannot be empty.')
    .trim()
    .escape(),
  // We'll also validate the postId from the params in the route itself.
  // No need to validate userId from body if we take it from req.user later.
];

export const getCommentsByPostIdValidations = [
  param('postId')
    .isInt({ gt: 0 }) // Assuming postId is a positive integer
    .withMessage('Post ID must be a valid positive integer.'),
];
