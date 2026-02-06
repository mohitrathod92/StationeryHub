import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @route POST /api/payment/create-order
 */
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, notes } = req.body;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount',
            });
        }

        // Razorpay expects amount in smallest currency unit (paise for INR)
        const amountInPaise = Math.round(amount * 100);

        // Create order options
        const options = {
            amount: amountInPaise,
            currency: currency,
            receipt: receipt || `order_${Date.now()}`,
            notes: notes || {},
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
            },
            key: process.env.RAZORPAY_KEY_ID, // Send public key to frontend
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message,
        });
    }
};

/**
 * Verify Razorpay payment signature
 * @route POST /api/payment/verify
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details',
            });
        }

        // Create expected signature
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        // Compare signatures
        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            // Payment is verified, you can update order status in database here
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: error.message,
        });
    }
};

/**
 * Get payment details
 * @route GET /api/payment/:paymentId
 */
export const getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required',
            });
        }

        // Fetch payment details from Razorpay
        const payment = await razorpay.payments.fetch(paymentId);

        res.status(200).json({
            success: true,
            payment: {
                id: payment.id,
                amount: payment.amount / 100, // Convert paise to rupees
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                email: payment.email,
                contact: payment.contact,
                createdAt: payment.created_at,
            },
        });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details',
            error: error.message,
        });
    }
};

/**
 * Handle payment callback (webhook)
 * @route POST /api/payment/webhook
 */
export const handlePaymentWebhook = async (req, res) => {
    try {
        // Verify webhook signature
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (webhookSecret) {
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (expectedSignature !== webhookSignature) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid webhook signature',
                });
            }
        }

        // Process webhook event
        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        console.log('Webhook event:', event);
        console.log('Payment details:', payload);

        // Handle different event types
        switch (event) {
            case 'payment.authorized':
                // Payment authorized, you might want to capture it
                console.log('Payment authorized:', payload.id);
                break;

            case 'payment.captured':
                // Payment captured successfully
                console.log('Payment captured:', payload.id);
                // Update order status in database
                break;

            case 'payment.failed':
                // Payment failed
                console.log('Payment failed:', payload.id);
                // Update order status in database
                break;

            default:
                console.log('Unhandled event:', event);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({
            success: false,
            message: 'Webhook processing failed',
            error: error.message,
        });
    }
};
