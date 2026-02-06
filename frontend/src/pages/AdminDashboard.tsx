import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getProfile, logout } from '@/redux/slices/authSlice';
import { fetchAdminStats } from '@/redux/slices/adminSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShoppingBag, Package, DollarSign, ArrowLeft, LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

// Loading Skeleton Component
const StatSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-24 mb-3 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </Card>
);

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { stats, loading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    // Fetch profile if user is not loaded (e.g. page refresh)
    if (isAuthenticated && !user) {
      dispatch(getProfile() as any);
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    // Fetch stats when we have user
    if (isAuthenticated && user && !stats) {
      dispatch(fetchAdminStats() as any);
    }
  }, [dispatch, isAuthenticated, user, stats]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Memoize recent orders to prevent unnecessary re-renders
  const recentOrders = useMemo(() => {
    return stats?.recentOrders?.slice(0, 10) || [];
  }, [stats?.recentOrders]);

  if (!user) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse mb-2"></div>
          <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </AdminLayout>
    );
  }

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse mb-2"></div>
          <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </AdminLayout>
    );
  }

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
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName} {user?.lastName}!</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers ?? 0}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalOrders ?? 0}</p>
                </div>
                <ShoppingBag className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalProducts ?? 0}</p>
                </div>
                <Package className="w-12 h-12 text-purple-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">${(stats.totalRevenue ?? 0).toFixed(2)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-yellow-500 opacity-50" />
              </div>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            {stats?.recentOrders && stats.recentOrders.length > 10 && (
              <button 
                onClick={() => navigate('/admin/orders')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All ({stats.recentOrders.length})
              </button>
            )}
          </div>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.firstName} {order.user?.lastName} ({order.user?.email})
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">{order.status}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>${(order.totalPrice ?? 0).toFixed(2)}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No orders yet</p>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
