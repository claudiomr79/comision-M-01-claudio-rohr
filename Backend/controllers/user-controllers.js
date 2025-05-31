import { userModel } from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../settings/envs.js';

const saltRounds = 10;

export const signupUser = (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation (in a real app, use express-validator)
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  // Check if user already exists
  const existingUserByEmail = userModel.findOne({ email });
  if (existingUserByEmail) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }
  const existingUserByUsername = userModel.findOne({ username });
  if (existingUserByUsername) {
    return res.status(409).json({ message: 'User with this username already exists.' });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // Store new user
  const newUser = userModel.create({ username, email, password: hashedPassword });

  // Generate JWT
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Return user info (without password) and token
  res.status(201).json({
    user: { id: newUser.id, username: newUser.username, email: newUser.email },
    token,
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body; // Or username

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Find user
  const user = userModel.findOne({ email }); // Or username

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Compare password
  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Return user info (without password) and token
  res.status(200).json({
    user: { id: user.id, username: user.username, email: user.email },
    token,
  });
};
