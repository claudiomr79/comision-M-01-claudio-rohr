import jwt from 'jsonwebtoken';
import { env } from '../settings/envs.js';

export const protectRoute = (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Attach user to request object
      // Assuming the JWT payload has a 'userId' field.
      // You might also want to fetch the full user object from the database here
      // if you need more user information available in subsequent middleware/controllers.
      // For now, just attaching the decoded payload.
      req.user = decoded;

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token failed.' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired.' });
      }
      return res.status(401).json({ message: 'Not authorized, an unexpected token error occurred.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};
