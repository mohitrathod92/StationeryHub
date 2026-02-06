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
import { Input } from '@/components/ui/input';
import { Filter, X, Search, Package } from 'lucide-react';

const Products = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch && product.isActive;
    });
  }, [selectedCategory, priceRange, searchQuery, products]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setSearchParams({});
    setPriceRange([0, 100]);
    setSearchQuery('');
  };

  // Calculate max price from products
  const maxPrice = Math.max(...(products.map((p: any) => p.price) || [50]), 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container-custom">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Our Collection</h1>
            <p className="text-lg text-muted-foreground">
              Discover our wide range of premium stationery products
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>

          {/* Filter Toggle & Results */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
              </h2>
              {selectedCategory && (
                <p className="text-sm text-muted-foreground">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl p-6 border border-border sticky top-24 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </h2>
                  {(selectedCategory || searchQuery || priceRange[0] !== 0 || priceRange[1] !== 100) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-8 pb-8 border-b border-border">
                  <Label className="text-sm font-bold mb-3 block text-foreground">Category</Label>
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
                          <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{category.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <Label className="text-sm font-bold mb-4 block text-foreground">
                    Price Range
                  </Label>
                  <div className="mb-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={maxPrice}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">${priceRange[0]}</span>
                    <span className="text-xs text-muted-foreground">to</span>
                    <span className="text-sm font-medium text-foreground">${Math.round(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading && filteredProducts.length === 0 ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product: any, index: number) => (
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
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Products Found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    {searchQuery ? 
                      'No products match your search. Try adjusting your filters.' :
                      'No products found matching your filters. Try clearing filters.'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-primary text-primary hover:bg-primary/5"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
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