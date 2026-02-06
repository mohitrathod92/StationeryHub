import { Star, ShoppingCart, Package, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const discountedPrice = product.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border dark:border-slate-700 hover:border-primary hover:shadow-xl transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
        {product.images && product.images.length > 0 && !imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-20 h-20 text-slate-300 dark:text-slate-500" />
          </div>
        )}
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {product.stock > 5 ? (
            <Badge className="bg-green-600 hover:bg-green-700">In Stock</Badge>
          ) : product.stock > 0 ? (
            <Badge className="bg-yellow-600 hover:bg-yellow-700">Low Stock ({product.stock})</Badge>
          ) : (
            <Badge className="bg-red-600 hover:bg-red-700">Out of Stock</Badge>
          )}
        </div>

        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
              {product.discount}% OFF
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleWishlist}
            className={isWishlisted ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-700'}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col h-full">
        {/* Title */}
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating || 0)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.rating || 0})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          {discountedPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">${discountedPrice}</span>
              <span className="text-sm line-through text-muted-foreground">${product.price.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;