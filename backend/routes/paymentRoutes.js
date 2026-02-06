import express from 'express';
import {
    createRazorpayOrder,
    verifyPayment,
    getPaymentDetails,
    handlePaymentWebhook,
} from '../controllers/paymentController.js';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify payment
router.post('/verify', verifyPayment);

// Get payment details
router.get('/:paymentId', getPaymentDetails);

// Webhook endpoint (for production use)
router.post('/webhook', handlePaymentWebhook);

export default router;
