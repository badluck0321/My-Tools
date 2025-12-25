
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { ProductCard,ArtworkCard, Loading, Input, Button } from '../../components/common';
import { ART_CATEGORIES, PRICE_RANGES, SORT_OPTIONS } from '../../utils/constants';
import { productService } from '../../services/productService';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [likedProducts, setLikedProducts] = useState(new Set());

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    productService.getProduct()
      .then((data) => {
        setProducts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Local-only like toggle
  const handleLike = (productId) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
      return false;
    }

    if (selectedPriceRange !== 'all') {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      return matchesSearch && Number(product.price) >= range.min && Number(product.price) <= range.max;
    }

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633] py-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">
              Products / Services
            </span>
          </h1>
          <p className="text-lg text-[#5d5955] dark:text-[#c4bfb9] max-w-2xl mx-auto">
            Explore our curated collection of Products and Services
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <Button variant="outline" icon={Filter} onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              Filters
            </Button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="glass dark:glass-dark rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {ART_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                            : 'bg-white dark:bg-gray-800'
                        }`}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-3">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl"
                  >
                    {PRICE_RANGES.map((range) => (
                      <option key={range.id} value={range.id}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium mb-3">Sort By</label>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(searchTerm || selectedCategory !== 'all' || selectedPriceRange !== 'all') && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedPriceRange('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          Showing {filteredProducts.length} Products / Services
          {filteredProducts.length !== 1 && 's'}
        </div>

        {loading ? (
          <Loading text="Loading products..." />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">No products found</div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onLike={handleLike}
                isLiked={likedProducts.has(product.id)}
              />
              //               <ArtworkCard
              //   key={product._id || product.id}
              //   artwork={product} // You might rename ProductCard to ProductCard later
              //   onLike={handleLike}
              //   isLiked={likedProducts.has(product._id || product.id)}
              // />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;