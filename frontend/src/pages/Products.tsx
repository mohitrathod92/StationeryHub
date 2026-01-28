import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchProducts } from '@/redux/slices/productsSlice';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';

const Products = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50]);
  
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesPrice;
    });
  }, [selectedCategory, priceRange]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-foreground">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchParams({});
                      setPriceRange([0, 50]);
                    }}
                  >
                    Clear All
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <div className="space-y-2">
                    <Button
                      variant={!selectedCategory ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleCategoryChange('')}
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchParams({});
                      setPriceRange([0, 50]);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;