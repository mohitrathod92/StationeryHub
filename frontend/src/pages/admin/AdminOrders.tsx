import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useRedux';
import { logout } from '@/redux/slices/authSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, MapPin, CreditCard, Calendar, ArrowLeft, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useTheme } from '@/contexts/ThemeContext';

// Helper function to format shipping address professionally
const formatShippingAddress = (addressString: string) => {
  try {
    const address = JSON.parse(addressString);
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        {/* Name */}
        <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
          <p className="text-base font-bold text-gray-900 dark:text-gray-100">
            {address.fullName}
          </p>
        </div>

        {/* Address Lines */}
        <div className="space-y-2 mb-3">
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]">Address:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {address.addressLine1}
            </span>
          </div>
          {address.addressLine2 && (
            <div className="flex gap-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {address.addressLine2}
              </span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]">City:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{address.city}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]">State:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{address.state}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]">ZIP Code:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{address.zipCode}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]">Country:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{address.country}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]">Phone:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{address.phone}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[80px]">Email:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{address.email}</span>
          </div>
        </div>
      </div>
    );
  } catch {
    return <p className="text-gray-700 dark:text-gray-300 text-sm">{addressString}</p>;
  }
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
    } catch (error: any) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ShoppingBag className="w-5 h-5 text-yellow-500" />;
      case 'SHIPPED': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      case 'RETURNED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const filteredOrders = filterStatus
    ? orders.filter((order: any) => order.status === filterStatus)
    : orders;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  Light
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>

        {/* Filter Section */}
        <Card className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</span>
            <Select value={filterStatus || "ALL"} onValueChange={(value) => setFilterStatus(value === "ALL" ? "" : value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="RETURNED">Returned</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600 dark:text-gray-400">({filteredOrders.length} orders)</span>
          </div>
        </Card>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center dark:border-slate-700">
            <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Orders Found</h3>
            <p className="text-gray-500 dark:text-gray-500">There are no orders to display</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: any) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  {/* Left Section - Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {order.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 dark:border dark:border-slate-700 rounded-lg">
                  {/* Customer Info */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">CUSTOMER</p>
                    <p className="font-semibold text-sm text-foreground">{order.user?.firstName} {order.user?.lastName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{order.user?.email}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      DATE
                    </p>
                    <p className="font-semibold text-sm text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>

                  {/* Items Count */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      ITEMS
                    </p>
                    <p className="font-semibold text-sm text-foreground">{order.items?.length || 0} product(s)</p>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      TOTAL
                    </p>
                    <p className="font-bold text-lg text-primary">₹{(order.totalPrice || 0).toFixed(2)}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-6 mb-4">
                  {/* Shipping Address */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      SHIPPING ADDRESS
                    </p>
                    {formatShippingAddress(order.shippingAddress)}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-3 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      PAYMENT METHOD
                    </p>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {order.paymentMethod === 'COD' && '💵 Cash on Delivery'}
                        {order.paymentMethod === 'CARD' && '💳 Credit/Debit Card'}
                        {order.paymentMethod === 'UPI' && '📱 UPI Payment'}
                        {!['COD', 'CARD', 'UPI'].includes(order.paymentMethod) && order.paymentMethod}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {order.paymentMethod === 'COD' && 'Pay when you receive'}
                        {order.paymentMethod === 'CARD' && 'Card payment'}
                        {order.paymentMethod === 'UPI' && 'Instant payment'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Update Status:</p>
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="RETURNED">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
