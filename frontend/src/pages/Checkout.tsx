import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, Truck, MapPin, Phone, Mail, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createOrder } from '@/redux/slices/orderSlice';
import { toast } from 'sonner';

interface ShippingAddress {
    fullName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

type PaymentMethod = 'COD' | 'CARD' | 'UPI';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, totalPrice, clearCart } = useCart();
    const { loading: orderLoading } = useAppSelector((state) => state.order);
    const { user } = useAppSelector((state) => state.auth);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: user?.name || '',
        phone: '',
        email: user?.email || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
    const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

    const shippingCost = 4.99;
    const tax = totalPrice * 0.1; // 10% tax
    const finalTotal = totalPrice + shippingCost + tax;

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const validateForm = (): boolean => {
        const newErrors: Partial<ShippingAddress> = {};

        if (!shippingAddress.fullName.trim() || shippingAddress.fullName.length < 2) {
            newErrors.fullName = 'Please enter your full name';
        }

        if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 10) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!shippingAddress.email.trim() || !emailRegex.test(shippingAddress.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!shippingAddress.addressLine1.trim() || shippingAddress.addressLine1.length < 5) {
            newErrors.addressLine1 = 'Please enter your street address';
        }

        if (!shippingAddress.city.trim() || shippingAddress.city.length < 2) {
            newErrors.city = 'Please enter your city';
        }

        if (!shippingAddress.state.trim()) {
            newErrors.state = 'Please enter your state';
        }

        if (!shippingAddress.zipCode.trim() || shippingAddress.zipCode.length < 5) {
            newErrors.zipCode = 'Please enter a valid ZIP code';
        }

        if (!shippingAddress.country.trim()) {
            newErrors.country = 'Please select your country';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof ShippingAddress, value: string) => {
        setShippingAddress(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        const orderData = {
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress,
            paymentMethod,
            totalAmount: finalTotal
        };

        try {
            const result = await dispatch(createOrder(orderData) as any);

            if (result.type === 'order/createOrder/fulfilled') {
                toast.success('Order placed successfully!');
                clearCart();
                navigate('/dashboard');
            } else {
                toast.error(result.payload as string || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error('An error occurred while placing your order');
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-2"
                        onClick={() => navigate('/cart')}
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Cart
                    </Button>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                        Checkout
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Section - Shipping & Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Shipping Address
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <User className="h-4 w-4 inline mr-1" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.fullName
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Phone className="h-4 w-4 inline mr-1" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={shippingAddress.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Mail className="h-4 w-4 inline mr-1" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={shippingAddress.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Address Line 1 */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <MapPin className="h-4 w-4 inline mr-1" />
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.addressLine1}
                                            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.addressLine1
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                            placeholder="123 Main Street"
                                        />
                                        {errors.addressLine1 && (
                                            <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
                                        )}
                                    </div>

                                    {/* Address Line 2 */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Apartment, Suite, etc. (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.addressLine2}
                                            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                            placeholder="Apartment 4B"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.city
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                            placeholder="New York"
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                        )}
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.state
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                            placeholder="NY"
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                                        )}
                                    </div>

                                    {/* ZIP Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ZIP/Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.zipCode}
                                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.zipCode
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                            placeholder="10001"
                                        />
                                        {errors.zipCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                                        )}
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Country *
                                        </label>
                                        <select
                                            value={shippingAddress.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.country
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-slate-700 focus:ring-blue-500'
                                                } bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none transition`}
                                        >
                                            <option value="USA">United States</option>
                                            <option value="CAN">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AUS">Australia</option>
                                            <option value="IND">India</option>
                                        </select>
                                        {errors.country && (
                                            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Payment Method
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {/* Cash on Delivery */}
                                    <button
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${paymentMethod === 'COD'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD'
                                                        ? 'border-blue-500'
                                                        : 'border-gray-300 dark:border-slate-600'
                                                    }`}>
                                                    {paymentMethod === 'COD' && (
                                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className=" font-semibold text-gray-900 dark:text-gray-100">
                                                        Cash on Delivery
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Pay when you receive your order
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">Recommended</Badge>
                                        </div>
                                    </button>

                                    {/* Credit/Debit Card */}
                                    <button
                                        onClick={() => setPaymentMethod('CARD')}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${paymentMethod === 'CARD'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CARD'
                                                    ? 'border-blue-500'
                                                    : 'border-gray-300 dark:border-slate-600'
                                                }`}>
                                                {paymentMethod === 'CARD' && (
                                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                    Credit/Debit Card
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Visa, Mastercard, American Express
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    {/* UPI */}
                                    <button
                                        onClick={() => setPaymentMethod('UPI')}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${paymentMethod === 'UPI'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'UPI'
                                                    ? 'border-blue-500'
                                                    : 'border-gray-300 dark:border-slate-600'
                                                }`}>
                                                {paymentMethod === 'UPI' && (
                                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                    UPI Payment
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Google Pay, PhonePe, Paytm
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 p-6 sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Order Summary
                                    </h2>
                                </div>

                                {/* Items */}
                                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-slate-800"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 pt-6 border-t dark:border-slate-700">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span>${shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Tax (10%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100 pt-3 border-t dark:border-slate-700">
                                        <span>Total</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={orderLoading}
                                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    {orderLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Place Order
                                        </>
                                    )}
                                </Button>

                                {/* Security Badge */}
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                                    🔒 Secure checkout - Your information is protected
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;