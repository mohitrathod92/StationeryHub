import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct } from '@/redux/slices/productsSlice';
import { logout } from '@/redux/slices/authSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Package, Image as ImageIcon, ArrowLeft, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { categories } from '@/data/products';

export default function AdminProducts() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    discount: '0',
    images: ['']
  });

  useEffect(() => {
    dispatch(fetchAdminProducts() as any);
  }, [dispatch]);

  // Fetch admin products (including deleted ones)
  useEffect(() => {
    const fetchAdminProdsData = async () => {
      try {
        await dispatch(fetchAdminProducts() as any);
      } catch (error) {
        console.error('Failed to fetch admin products');
      }
    };
    fetchAdminProdsData();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', discount: '0', images: [''] });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      discount: product.discount?.toString() || '0',
      images: product.images?.length > 0 ? product.images : ['']
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Stock must be 0 or greater');
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: parseFloat(formData.discount),
        images: formData.images.filter(img => img.trim() !== '')
      };

      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, data: productData }) as any).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(productData) as any).unwrap();
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      dispatch(fetchAdminProducts() as any);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await dispatch(deleteProduct(id) as any).unwrap();
      toast.success('Product deleted successfully');
      // Don't refetch - Redux state is already updated
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const productList = Array.isArray(products) ? products.filter((p: any) => p.isActive) : [];

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

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Products Management</h1>
            <p className="text-muted-foreground">Manage your product inventory ({productList.length} products)</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name */}
                <div>
                  <Label className="font-semibold">Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Premium Leather Journal"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="font-semibold">Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed product description..."
                    required
                    rows={4}
                  />
                </div>

                {/* Price and Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Price (₹) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label className="font-semibold">Discount (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Stock and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Stock Quantity *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <Label className="font-semibold">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Product Image */}
                <div>
                  <Label className="font-semibold mb-2 block">Product Image</Label>
                  <ImageUpload
                    value={formData.images[0] || ''}
                    onChange={(url) => setFormData({ ...formData, images: [url] })}
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        {loading && productList.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : productList.length === 0 ? (
          <Card className="p-12 text-center dark:border-slate-700">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first product</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product: any) => {
              const discountedPrice = product.discount
                ? (product.price * (1 - product.discount / 100)).toFixed(2)
                : null;

              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow dark:border-slate-700">
                  {/* Product Image */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center"
                      style={{ display: product.images?.[0] ? 'none' : 'flex' }}
                    >
                      <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-2 right-2">
                      {product.stock > 0 ? (
                        <Badge className="bg-green-600">In Stock ({product.stock})</Badge>
                      ) : (
                        <Badge className="bg-red-600">Out of Stock</Badge>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-orange-600">{product.discount}% OFF</Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </Badge>
                      {!product.isActive && (
                        <Badge className="bg-red-600 text-white text-xs">Deleted</Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-1 line-clamp-2 text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

                    {/* Price */}
                    <div className="mb-4">
                      {discountedPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">₹{discountedPrice}</span>
                          <span className="text-sm line-through text-muted-foreground">₹{product.price}</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
