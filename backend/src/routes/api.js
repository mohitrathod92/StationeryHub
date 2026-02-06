import express from 'express';
import { registerUser, loginUser, refreshToken, getCurrentUser, updateUserProfile, changePassword } from '../controllers/authController.js';
import { getAllProducts, getAllProductsAdmin, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory } from '../controllers/productController.js';
import { createOrder, getUserOrders, getOrderDetails, getAllOrders, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { getWishlist, addToWishlist, removeFromWishlist, isInWishlist } from '../controllers/wishlistController.js';
import { getAllUsers, getUserById, blockUser, unblockUser, getAdminStats, getUserDashboard } from '../controllers/userController.js';
import { authenticateToken, authorizeAdmin, authorizeUser } from '../middlewares/auth.js';
import { body, param, query, validationResult } from 'express-validator';

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ==================== AUTH ROUTES ====================
router.post(
  '/auth/register',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  handleValidationErrors,
  registerUser
);

router.post(
  '/auth/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  loginUser
);

router.post('/auth/refresh', refreshToken);

router.get('/auth/profile', authenticateToken, getCurrentUser);

router.put(
  '/auth/profile',
  authenticateToken,
  [body('name').optional().notEmpty().withMessage('Name cannot be empty')],
  handleValidationErrors,
  updateUserProfile
);

router.put(
  '/auth/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  handleValidationErrors,
  changePassword
);

// ==================== PRODUCT ROUTES ====================
// Admin endpoint - Get ALL products (including deleted)
router.get(
  '/admin/products',
  authenticateToken,
  authorizeAdmin,
  getAllProductsAdmin
);

router.get(
  '/products',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isString(),
  ],
  handleValidationErrors,
  getAllProducts
);

router.get(
  '/products/category/:category',
  [param('category').isString()],
  handleValidationErrors,
  getProductsByCategory
);

router.get(
  '/products/:id',
  [param('id').isString()],
  handleValidationErrors,
  getProductById
);

router.post(
  '/products',
  authenticateToken,
  authorizeAdmin,
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  handleValidationErrors,
  createProduct
);

router.put(
  '/products/:id',
  authenticateToken,
  authorizeAdmin,
  [param('id').isString()],
  handleValidationErrors,
  updateProduct
);

router.delete(
  '/products/:id',
  authenticateToken,
  authorizeAdmin,
  [param('id').isString()],
  handleValidationErrors,
  deleteProduct
);

// ==================== ORDER ROUTES ====================
router.post(
  '/orders',
  authenticateToken,
  authorizeUser,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').isString().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  ],
  handleValidationErrors,
  createOrder
);

router.get('/orders/user', authenticateToken, authorizeUser, getUserOrders);

router.get(
  '/orders/:id',
  authenticateToken,
  [param('id').isString()],
  handleValidationErrors,
  getOrderDetails
);

router.put(
  '/orders/:id/status',
  authenticateToken,
  authorizeAdmin,
  [
    param('id').isString(),
    body('status').isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).withMessage('Invalid status'),
  ],
  handleValidationErrors,
  updateOrderStatus
);

router.put(
  '/orders/:id/cancel',
  authenticateToken,
  authorizeUser,
  [param('id').isString()],
  handleValidationErrors,
  cancelOrder
);

router.get('/orders', authenticateToken, authorizeAdmin, getAllOrders);

// ==================== WISHLIST ROUTES ====================
router.get('/wishlist', authenticateToken, authorizeUser, getWishlist);

router.post(
  '/wishlist',
  authenticateToken,
  authorizeUser,
  [body('productId').isString().withMessage('Product ID is required')],
  handleValidationErrors,
  addToWishlist
);

router.delete(
  '/wishlist/:productId',
  authenticateToken,
  authorizeUser,
  [param('productId').isString()],
  handleValidationErrors,
  removeFromWishlist
);

router.get(
  '/wishlist/check/:productId',
  authenticateToken,
  authorizeUser,
  [param('productId').isString()],
  handleValidationErrors,
  isInWishlist
);

// ==================== USER ROUTES ====================
router.get('/users', authenticateToken, authorizeAdmin, getAllUsers);

router.get(
  '/users/:userId',
  authenticateToken,
  authorizeAdmin,
  [param('userId').isString()],
  handleValidationErrors,
  getUserById
);

router.put(
  '/users/:userId/block',
  authenticateToken,
  authorizeAdmin,
  [param('userId').isString()],
  handleValidationErrors,
  blockUser
);

router.put(
  '/users/:userId/unblock',
  authenticateToken,
  authorizeAdmin,
  [param('userId').isString()],
  handleValidationErrors,
  unblockUser
);

// ==================== ADMIN ROUTES ====================
router.get('/admin/stats', authenticateToken, authorizeAdmin, getAdminStats);

// ==================== DASHBOARD ROUTES ====================
router.get('/dashboard/user', authenticateToken, authorizeUser, getUserDashboard);

export default router;
