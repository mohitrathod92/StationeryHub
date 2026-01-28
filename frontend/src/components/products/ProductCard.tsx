import { Star, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden card-hover">
      {/* Product Image */}
      <div className="aspect-square bg-secondary/50 relative overflow-hidden">
        {product.images && product.images.length > 0 && !imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-1 mb-1">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm text-muted-foreground">{product.rating}</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-cta text-cta-foreground hover:bg-cta/90"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;