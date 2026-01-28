import prisma from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { AppError, asyncHandler } from '../utils/errors.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@stationery.com';

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName) {
    throw new AppError('All fields are required', 400);
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists', 409);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Check if this is admin email and set role accordingly
  const role = email === ADMIN_EMAIL ? 'ADMIN' : 'USER';

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Your account has been blocked', 403);
  }

  // Compare password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

// Refresh Token
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify refresh token
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  if (!decoded) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Generate new access token
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const newAccessToken = generateAccessToken(user.id, user.role);

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    accessToken: newAccessToken,
  });
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

// Update User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

// Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are required', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

  // Verify current password
  const isPasswordMatch = await comparePassword(currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { password: hashedPassword },
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
