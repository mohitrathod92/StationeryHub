import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getProfile } from '@/redux/slices/authSlice';
import { fetchAdminStats } from '@/redux/slices/adminSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Users, ShoppingBag, Package, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { stats, loading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    dispatch(fetchAdminStats() as any);
  }, [dispatch, navigate, isAuthenticated, user?.role]);

  if (loading || !user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName} {user?.lastName}!</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                </div>
                <ShoppingBag className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                </div>
                <Package className="w-12 h-12 text-purple-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">${stats.totalRevenue}</p>
                </div>
                <DollarSign className="w-12 h-12 text-yellow-500 opacity-50" />
              </div>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {order.user.firstName} {order.user.lastName} ({order.user.email})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.totalPrice}</p>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No orders yet</p>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
