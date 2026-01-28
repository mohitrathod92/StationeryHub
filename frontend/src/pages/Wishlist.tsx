import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: wishlistItems, loading } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(fetchWishlist() as any);
  }, [isAuthenticated, dispatch, navigate]);

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId) as any);
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
    navigate('/cart');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-2">{wishlistItems.length} items saved</p>
          </div>

          {/* Wishlist Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">Loading wishlist...</p>
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item: any) => (
                <Card key={item.productId} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.product.description}</p>

                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-blue-600">${item.product.price}</p>
                      {item.product.stock > 0 ? (
                        <p className="text-sm text-green-600">{item.product.stock} in stock</p>
                      ) : (
                        <p className="text-sm text-red-600">Out of stock</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(item.product)}
                        disabled={item.product.stock === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Start adding your favorite products to your wishlist!</p>
              <Button onClick={() => navigate('/products')} size="lg">
                Browse Products
              </Button>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Package() {
  return null;
}
