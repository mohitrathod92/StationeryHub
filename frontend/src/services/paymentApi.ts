import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface CreateOrderRequest {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, any>;
}

export interface CreateOrderResponse {
    success: boolean;
    order: {
        id: string;
        amount: number;
        currency: string;
        receipt: string;
    };
    key: string;
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    paymentId?: string;
    orderId?: string;
}

/**
 * Create a Razorpay order on the backend
 */
export const createRazorpayOrder = async (
    orderData: CreateOrderRequest
): Promise<CreateOrderResponse> => {
    try {
        const response = await axios.post(`${API_URL}/payment/create-order`, orderData);
        return response.data;
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to create payment order'
        );
    }
};

/**
 * Verify payment signature on the backend
 */
export const verifyPayment = async (
    paymentData: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> => {
    try {
        const response = await axios.post(`${API_URL}/payment/verify`, paymentData);
        return response.data;
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to verify payment'
        );
    }
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentId: string) => {
    try {
        const response = await axios.get(`${API_URL}/payment/${paymentId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching payment details:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to fetch payment details'
        );
    }
};
