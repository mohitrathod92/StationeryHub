import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

// Authentication Middleware
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(error.status || 401).json({
      success: false,
      message: error.message || 'Authentication failed',
    });
  }
};

// Authorization Middleware - Check if user is Admin
export const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'ADMIN') {
      throw new AppError('Access denied. Admin only', 403);
    }

    next();
  } catch (error) {
    res.status(error.status || 403).json({
      success: false,
      message: error.message || 'Authorization failed',
    });
  }
};

// Authorization Middleware - Check if user is User
export const authorizeUser = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.role !== 'USER' && req.user.role !== 'ADMIN') {
      throw new AppError('Access denied', 403);
    }

    next();
  } catch (error) {
    res.status(error.status || 403).json({
      success: false,
      message: error.message || 'Authorization failed',
    });
  }
};
