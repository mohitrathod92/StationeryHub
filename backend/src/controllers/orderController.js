import prisma from '../lib/prisma.js';
import { AppError, asyncHandler } from '../utils/errors.js';

// Get User Cart (from Order items - not yet placed)
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // For now, return empty cart structure
  // In production, you might want to store cart in session or database
  res.status(200).json({
    success: true,
    data: {
      items: [],
      totalPrice: 0,
    },
  });
});

// Create Order (Place Order)
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    throw new AppError('No items in order', 400);
  }

  if (!shippingAddress || !paymentMethod) {
    throw new AppError('Shipping address and payment method are required', 400);
  }

  // Create order with items
  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice: parseFloat(totalPrice),
      shippingAddress,
      paymentMethod,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

// Get User Orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, data: orders });
});

// Get Order Details
export const getOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if order belongs to user or user is admin
  if (order.userId !== userId) {
    throw new AppError('Access denied', 403);
  }

  res.status(200).json({ success: true, data: order });
});

// Get All Orders (Admin Only)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, skip = 0, take = 10 } = req.query;

  const where = {};
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: { items: true, user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    skip: parseInt(skip),
    take: parseInt(take),
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.order.count({ where });

  res.status(200).json({
    success: true,
    data: orders,
    pagination: { total, skip: parseInt(skip), take: parseInt(take) },
  });
});

// Update Order Status (Admin Only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } } },
  });

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order,
  });
});

// Cancel Order
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.userId !== userId) {
    throw new AppError('Access denied', 403);
  }

  if (order.status !== 'PENDING') {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  res.status(200).json({
    success: true,
    message: 'Order cancelled',
    data: updatedOrder,
  });
});
