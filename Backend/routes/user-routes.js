import express from 'express';
import { signupUser, loginUser } from '../controllers/user-controllers.js';
import { signupValidations, loginValidations } from '../validations/auth-validations.js';
import { applyValidations } from '../middlewares/applyValidations.js';

const router = express.Router();

// Route for user signup
router.post('/signup', signupValidations, applyValidations, signupUser);

// Route for user login
router.post('/login', loginValidations, applyValidations, loginUser);

export default router;
