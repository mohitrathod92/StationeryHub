import prisma from '../lib/prisma.js';
import { AppError, asyncHandler } from '../utils/errors.js';

// Get User Wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
  });

  res.status(200).json({ success: true, data: wishlist });
});

// Add to Wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }

  // Check if product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check if already in wishlist
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    throw new AppError('Product already in wishlist', 400);
  }

  const wishlistItem = await prisma.wishlist.create({
    data: { userId, productId },
    include: { product: true },
  });

  res.status(201).json({
    success: true,
    message: 'Added to wishlist',
    data: wishlistItem,
  });
});

// Remove from Wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  const wishlistItem = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (!wishlistItem) {
    throw new AppError('Item not in wishlist', 404);
  }

  await prisma.wishlist.delete({
    where: { userId_productId: { userId, productId } },
  });

  res.status(200).json({
    success: true,
    message: 'Removed from wishlist',
  });
});

// Check if Product in Wishlist
export const isInWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  const item = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  res.status(200).json({
    success: true,
    inWishlist: !!item,
  });
});
