import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchUserOrders, cancelOrder } from '@/redux/slices/orderSlice';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Orders = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((state) => state.order);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        dispatch(fetchUserOrders() as any);
    }, [dispatch, isAuthenticated, navigate]);

    const toggleOrderExpansion = (orderId: string) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const handleCancelClick = (orderId: string) => {
        setSelectedOrderId(orderId);
        setCancelDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedOrderId) return;

        try {
            await dispatch(cancelOrder(selectedOrderId) as any).unwrap();
            toast.success('Order cancelled successfully');
            setCancelDialogOpen(false);
            setSelectedOrderId(null);
        } catch (error: any) {
            toast.error(error || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'pending':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const canCancelOrder = (status: string) => {
        const statusLower = status.toLowerCase();
        return statusLower === 'pending' || statusLower === 'processing';
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase());

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <Navbar />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">My Orders</h1>
                        <p className="text-lg text-muted-foreground">
                            Track and manage your orders
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? 'default' : 'outline'}
                                onClick={() => setFilterStatus(status)}
                                className="capitalize"
                            >
                                {status === 'all' ? 'All Orders' : status}
                            </Button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div className="bg-card rounded-xl border border-border p-12 text-center">
                            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                {filterStatus === 'all'
                                    ? "Start shopping to see your orders here"
                                    : `You don't have any ${filterStatus} orders`}
                            </p>
                            <Button onClick={() => navigate('/products')}>
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order: any) => {
                                const isExpanded = expandedOrders.has(order.id);

                                return (
                                    <div
                                        key={order.id}
                                        className="bg-card rounded-xl border border-border overflow-hidden transition-all hover:shadow-md"
                                    >
                                        {/* Order Header */}
                                        <div className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary/10 rounded-lg">
                                                        <Package className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-foreground">
                                                            Order #{order.id.slice(-8).toUpperCase()}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </div>

                                            {/* Order Summary */}
                                            <div className="flex items-center justify-between pt-4 border-t dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                                    <span className="text-2xl font-bold text-primary">
                                                        ₹{(order.totalPrice || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    {canCancelOrder(order.status) && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleCancelClick(order.id)}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Cancel Order
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleOrderExpansion(order.id)}
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <ChevronUp className="h-4 w-4 mr-1" />
                                                                Hide Details
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="h-4 w-4 mr-1" />
                                                                View Details
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Details (Expandable) */}
                                        {isExpanded && (
                                            <div className="px-6 pb-6 pt-0 border-t dark:border-slate-800">
                                                <div className="space-y-4 mt-4">
                                                    <h4 className="font-semibold text-foreground mb-3">Order Items</h4>
                                                    {order.items?.map((item: any, index: number) => (
                                                        <div key={index} className="flex gap-4 items-center">
                                                            <img
                                                                src={item.product?.images?.[0] || item.product?.image || '/placeholder-product.png'}
                                                                alt={item.product?.name || 'Product'}
                                                                className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-slate-800"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/placeholder-product.png';
                                                                }}
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-foreground">
                                                                    {item.product?.name || 'Unknown Product'}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Quantity: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <p className="font-semibold text-foreground">
                                                                ₹{(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}

                                                    {/* Shipping Address */}
                                                    {order.shippingAddress && (
                                                        <div className="mt-6 pt-4 border-t dark:border-slate-800">
                                                            <h4 className="font-semibold text-foreground mb-2">Shipping Address</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {order.shippingAddress.fullName}<br />
                                                                {order.shippingAddress.addressLine1}<br />
                                                                {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                                                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                                                {order.shippingAddress.country}<br />
                                                                Phone: {order.shippingAddress.phone}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            Cancel Order?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700">
                            Yes, Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Orders;
