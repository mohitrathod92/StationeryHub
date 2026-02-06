import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useRedux';
import { logout } from '@/redux/slices/authSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Ban, CheckCircle, Mail, Calendar, Package2, AlertCircle, ArrowLeft, Shield, Clock, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdminUsers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users?search=${search}`);
      setUsers(response.data.data || []);
    } catch (error: any) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.put(`/users/${userId}/${isActive ? 'block' : 'unblock'}`);
      toast.success(`User ${isActive ? 'blocked' : 'unblocked'} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const activeUsers = users.filter((user: any) => user.role !== 'ADMIN' && user.isActive).length;
  const blockedUsers = users.filter((user: any) => user.role !== 'ADMIN' && !user.isActive).length;
  const totalOrders = users.reduce((sum: number, user: any) => sum + (user._count?.orders || 0), 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

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

        {/* Header Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Users Management</h1>
              <p className="text-sm text-muted-foreground">Manage and monitor all registered users</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{users.filter((u: any) => u.role !== 'ADMIN').length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-300 dark:text-blue-500/60" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{activeUsers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-300 dark:text-green-500/60" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Blocked Users</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{blockedUsers}</p>
              </div>
              <Ban className="w-8 h-8 text-red-300 dark:text-red-500/60" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalOrders}</p>
              </div>
              <Package2 className="w-8 h-8 text-purple-300 dark:text-purple-500/60" />
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 border-slate-300 dark:border-slate-600"
            />
          </div>
        </Card>

        {/* Users Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground font-medium">Loading users...</p>
            </div>
          </div>
        ) : users.filter((user: any) => user.role !== 'ADMIN').length === 0 ? (
          <Card className="border-dashed dark:border-slate-700">
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No users found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users.filter((user: any) => user.role !== 'ADMIN').map((user: any) => (
              <Card key={user.id} className="p-4 hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                  {/* User Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground truncate">{user.firstName} {user.lastName}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="hidden lg:block">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>

                  {/* Orders */}
                  <div className="hidden lg:block">
                    <div className="flex items-center gap-2">
                      <Package2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">{user._count?.orders || 0} orders</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden lg:block">
                    <Badge 
                      variant={user.isActive ? "default" : "destructive"}
                      className={user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50'}
                    >
                      {user.isActive ? '✓ Active' : '✕ Blocked'}
                    </Badge>
                  </div>

                  {/* Action */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={user.isActive ? 'destructive' : 'default'}
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      className="flex-1 lg:flex-initial text-xs"
                    >
                      {user.isActive ? (
                        <>
                          <Ban className="w-3 h-3 mr-1" />
                          Block
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Unblock
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mobile Info */}
                <div className="lg:hidden flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs">
                    {user.role}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-xs">
                    <Package2 className="w-3 h-3 mr-1" />
                    {user._count?.orders || 0} orders
                  </Badge>
                  <Badge 
                    variant={user.isActive ? "default" : "destructive"}
                    className={user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs hover:bg-green-100 dark:hover:bg-green-900/50' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs hover:bg-red-100 dark:hover:bg-red-900/50'}
                  >
                    {user.isActive ? '✓ Active' : '✕ Blocked'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
