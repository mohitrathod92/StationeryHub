import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/redux/slices/productsSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { categories } from '@/data/products';

export default function AdminProducts() {
  const dispatch = useAppDispatch();
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
    dispatch(fetchProducts() as any);
  }, [dispatch]);

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
    } catch (error: any) {
      toast.error(error.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await dispatch(deleteProduct(id) as any).unwrap();
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const productList = Array.isArray(products) ? products : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Products Management</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Product Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price ($)</Label>
                    <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required>
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
                  <div>
                    <Label>Discount (%)</Label>
                    <Input type="number" step="0.01" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
                  </div>
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input value={formData.images[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} placeholder="https://..." />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading && productList.length === 0 ? (
          <div className="text-center py-12">Loading products...</div>
        ) : productList.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first product</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product: any) => (
              <Card key={product.id} className="p-4">
                <div className="flex items-start gap-4">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
                  ) : null}
                  <div className="w-16 h-16 bg-accent rounded flex items-center justify-center" style={{ display: product.images?.[0] ? 'none' : 'flex' }}>
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <Badge variant="secondary" className="text-xs shrink-0">{categories.find(c => c.id === product.category)?.name || product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="font-bold">${product.price}</p>
                        <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(product.id)} disabled={loading}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
