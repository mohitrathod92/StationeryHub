import prisma from '../lib/prisma.js';
import { AppError, asyncHandler } from '../utils/errors.js';

// Get All Products
export const getAllProducts = asyncHandler(async (req, res) => {
  const { category, skip = 0, take = 10, search } = req.query;

  const where = { isActive: true };
  if (category) where.category = category;
  if (search) {
    where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
  }

  const products = await prisma.product.findMany({
    where,
    skip: parseInt(skip),
    take: parseInt(take),
  });

  const total = await prisma.product.count({ where });

  res.status(200).json({
    success: true,
    data: products,
    pagination: { total, skip: parseInt(skip), take: parseInt(take) },
  });
});

// Get Product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { reviews: true },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({ success: true, data: product });
});

// Create Product (Admin Only)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discount, stock, category, images } = req.body;

  if (!name || !description || price === undefined || !category) {
    throw new AppError('Missing required fields', 400);
  }

  const product = await prisma.product.create({
    data: { 
      name, 
      description, 
      price: parseFloat(price), 
      discount: discount !== undefined ? parseFloat(discount) : 0, 
      stock: stock !== undefined ? parseInt(stock) : 0, 
      category, 
      images: Array.isArray(images) ? images.filter(img => img) : [] 
    },
  });

  res.status(201).json({ success: true, message: 'Product created', data: product });
});

// Update Product (Admin Only)
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount, stock, category, images } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (discount !== undefined) updateData.discount = parseFloat(discount);
  if (stock !== undefined) updateData.stock = parseInt(stock);
  if (category !== undefined) updateData.category = category;
  if (images !== undefined) updateData.images = Array.isArray(images) ? images.filter(img => img) : [];

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json({ success: true, message: 'Product updated', data: product });
});

// Delete Product (Admin Only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  res.status(200).json({ success: true, message: 'Product deleted' });
});

// Get Products by Category
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { skip = 0, take = 10 } = req.query;

  const products = await prisma.product.findMany({
    where: { category, isActive: true },
    skip: parseInt(skip),
    take: parseInt(take),
  });

  const total = await prisma.product.count({ where: { category, isActive: true } });

  res.status(200).json({
    success: true,
    data: products,
    pagination: { total, skip: parseInt(skip), take: parseInt(take) },
  });
});
