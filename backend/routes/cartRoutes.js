import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.delete('/:userId/:productId', removeFromCart);
router.put('/:userId/:productId', updateCartItem);
router.delete('/:userId', clearCart);

export default router;
