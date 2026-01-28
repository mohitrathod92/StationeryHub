import prisma from '../lib/prisma.js';
import { AppError, asyncHandler } from '../utils/errors.js';

// Get All Users (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    skip: parseInt(skip),
    take: parseInt(limit),
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { orders: true, wishlist: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.user.count({ where });

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  });
});

// Get User by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: { select: { id: true, total: true, status: true, createdAt: true } },
      wishlist: { include: { product: true } },
      _count: { select: { orders: true, reviews: true } },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({ success: true, data: user });
});

// Block User
export const blockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === 'ADMIN') {
    throw new AppError('Cannot block an admin', 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
    select: { id: true, firstName: true, lastName: true, email: true, isActive: true },
  });

  res.status(200).json({
    success: true,
    message: 'User blocked successfully',
    data: updatedUser,
  });
});

// Unblock User
export const unblockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
    select: { id: true, firstName: true, lastName: true, email: true, isActive: true },
  });

  res.status(200).json({
    success: true,
    message: 'User unblocked successfully',
    data: updatedUser,
  });
});

// Get Admin Statistics
export const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, totalProducts, revenue, recentOrders] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'DELIVERED' },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    }),
  ]);

  const stats = {
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue: revenue._sum.totalPrice || 0,
    recentOrders,
  };

  res.status(200).json({ success: true, data: stats });
});

// Get Dashboard Data (for Users)
export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const [user, orders, wishlistCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    }),
    prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    }),
    prisma.wishlist.count({ where: { userId } }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      user,
      recentOrders: orders,
      wishlistCount,
      orderCount: orders.length,
    },
  });
});
