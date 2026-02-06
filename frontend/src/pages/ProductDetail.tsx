import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Star, ShoppingCart, Minus, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchProducts } from '@/redux/slices/productsSlice';
import { toast } from 'sonner';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { addToCart } = useCart();

    const { items: products, loading } = useAppSelector((state) => state.products);
    const product = products.find(p => p.id === id);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts() as any);
        }
    }, [dispatch, products.length]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Package className="h-24 w-24 text-gray-300 dark:text-gray-700 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/products')}>
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const discountedPrice = product.discount
        ? (product.price * (1 - product.discount / 100)).toFixed(2)
        : null;

    const handleAddToCart = () => {
        if (product.stock === 0) {
            toast.error('Product is out of stock');
            return;
        }
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-2"
                        onClick={() => navigate('/products')}
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Back to Products
                    </Button>

                    {/* Product Detail Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery Section */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Discount Badge */}
                                {product.discount && product.discount > 0 && (
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-4 py-2">
                                            {product.discount}% OFF
                                        </Badge>
                                    </div>
                                )}

                                {/* Stock Badge */}
                                <div className="absolute top-4 right-4">
                                    {product.stock && product.stock > 5 ? (
                                        <Badge className="bg-green-600 hover:bg-green-700">In Stock</Badge>
                                    ) : product.stock && product.stock > 0 ? (
                                        <Badge className="bg-yellow-600 hover:bg-yellow-700">Low Stock ({product.stock})</Badge>
                                    ) : (
                                        <Badge className="bg-red-600 hover:bg-red-700">Out of Stock</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="flex flex-col">
                            {/* Category */}
                            <div className="mb-3">
                                <Badge variant="outline" className="text-sm">
                                    {product.category}
                                </Badge>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.rating || 0)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-base text-gray-600 dark:text-gray-400">
                                    ({product.rating || 0})
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {discountedPrice ? (
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                            ${discountedPrice}
                                        </span>
                                        <span className="text-2xl line-through text-gray-400 dark:text-gray-500">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className="text-lg text-green-600 dark:text-green-400 font-semibold">
                                            Save ${(product.price - parseFloat(discountedPrice)).toFixed(2)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-8 pb-8 border-b dark:border-slate-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Description
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="text-2xl font-semibold w-16 text-center text-gray-900 dark:text-gray-100">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={product.stock ? quantity >= product.stock : false}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    {product.stock && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                            ({product.stock} available)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold"
                                    size="lg"
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>

                                <Button
                                    onClick={handleWishlist}
                                    variant="outline"
                                    size="lg"
                                    className={`h-14 w-14 ${isWishlisted
                                            ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
                                            : ''
                                        }`}
                                >
                                    <Heart
                                        className={`h-6 w-6 ${isWishlisted
                                                ? 'fill-red-500 text-red-500'
                                                : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;
