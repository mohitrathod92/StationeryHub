import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">Manage all customer orders</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {getStatusIcon(order.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Customer: {order.user?.firstName} {order.user?.lastName} ({order.user?.email})</p>
                      <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                      <p>Items: {order.items?.length || 0}</p>
                      <p>Payment: {order.paymentMethod}</p>
                      <p className="font-medium text-foreground">Total: ${order.totalPrice}</p>
                    </div>
                  </div>
                </div>
                <div className="w-48">
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger>
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
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
