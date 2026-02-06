// Redux Hooks - Quick Reference Guide
// Use these hooks in your React components

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProducts, clearError } from '../redux/slices/productsSlice';
import { addToCart, removeFromCart, clearCart } from '../redux/slices/cartSlice';

// ============================================================================
// TYPED REDUX HOOKS
// ============================================================================

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);

// ============================================================================
// PRODUCTS HOOKS
// ============================================================================

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, selectedProduct, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  return {
    products: items,
    selectedProduct,
    loading,
    error,
    fetchProducts: () => dispatch(fetchProducts()),
    clearError: () => dispatch(clearError()),
  };
};

// ============================================================================
// CART HOOKS
// ============================================================================

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return {
    cartItems: items,
    totalPrice,
    addItem: (item: any) => dispatch(addToCart(item)),
    removeItem: (productId: string) => dispatch(removeFromCart(productId)),
    clearCart: () => dispatch(clearCart()),
  };
};

// ============================================================================
// EXAMPLE COMPONENT USAGE
// ============================================================================

/*
import { useProducts, useCart } from '@/hooks/redux';

function ProductList() {
  const { products, loading, fetchProducts } = useProducts();
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addItem({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          })}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
*/

// ============================================================================
// DIRECT DISPATCH EXAMPLES
// ============================================================================

/*
// In component:
const dispatch = useDispatch<AppDispatch>();

// Fetch products
dispatch(fetchProducts());

// Clear error message
dispatch(clearError());

// Add to cart
dispatch(addToCart({
  id: '123',
  name: 'Product Name',
  price: 19.99,
  image: 'url',
  quantity: 2
}));

// Remove from cart
dispatch(removeFromCart('product-id'));

// Clear entire cart
dispatch(clearCart());
*/
