import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { getProfile, logout } from '@/redux/slices/authSlice';
import { fetchUserOrders } from '@/redux/slices/orderSlice';
import { fetchWishlist } from '@/redux/slices/wishlistSlice';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingBag, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Loading Skeleton
const StatSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-3 animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
    </div>
  </Card>
);

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useAppSelector((state) => state.order);
  const { items: wishlistItems, loading: wishlistLoading } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    // Fetch profile if user is not loaded (e.g. page refresh)
    if (isAuthenticated && !user) {
      dispatch(getProfile() as any);
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    // Fetch data when authenticated
    if (isAuthenticated) {
      if (!orders || orders.length === 0) {
        dispatch(fetchUserOrders() as any);
      }
      if (!wishlistItems || wishlistItems.length === 0) {
        dispatch(fetchWishlist() as any);
      }
    }
  }, [dispatch, isAuthenticated, user?.id]);

  // Memoize recent orders
  const recentOrders = useMemo(() => {
    return orders?.slice(0, 5) || [];
  }, [orders]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isLoading = !user || (ordersLoading && (!orders || orders.length === 0));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <StatSkeleton key={i} />
              ))}
            </div>

            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome, {user?.firstName} {user?.lastName}!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{user?.email}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold mt-2 dark:text-gray-100">{orders?.length ?? 0}</p>
                </div>
                <ShoppingBag className="w-12 h-12 text-blue-500 dark:text-blue-400 opacity-50" />
              </div>
            </Card>

            <Card className="p-6 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Wishlist Items</p>
                  <p className="text-3xl font-bold mt-2 dark:text-gray-100">{wishlistItems?.length ?? 0}</p>
                </div>
                <Heart className="w-12 h-12 text-red-500 dark:text-red-400 opacity-50" />
              </div>
            </Card>

            <Card className="p-6 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Account Status</p>
                  <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">Active</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-gray-100">Recent Orders</h2>
              {orders && orders.length > 5 && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All ({orders.length})
                </button>
              )}
            </div>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <Card key={order.id} className="p-6 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg dark:text-gray-100">Order #{order.id?.slice(0, 8)}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg dark:text-gray-100">${(order.totalPrice ?? order.total ?? 0).toFixed(2)}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 dark:border-slate-700">
                <p className="text-gray-600 dark:text-gray-400 text-center">No orders yet. Start shopping!</p>
                <Button className="w-full mt-4" onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/wishlist')}
              className="flex-1"
            >
              View Wishlist
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
