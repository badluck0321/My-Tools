import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard, Loading } from '../../components/common';
import FilterBar from '../../components/filters/FilterBar';
import { PRICE_RANGES } from '../../utils/constants';
import { productService } from '../../services/productService';
import { useLookups } from '../../hooks/useLookups';
import { LOOKUP_TYPES, lookupOptions } from '../../utils/lookupUtils';

const sortItems = (items, sort) => {
  const sorted = [...items];
  if (sort === 'price-low') return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  if (sort === 'price-high') return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  if (sort === 'oldest') return sorted.reverse();
  return sorted;
};

const ProductsIndex = () => {
  const { lookups } = useLookups();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [availability, setAvailability] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    productService.getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.response?.data || 'Unable to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const categoryOptions = useMemo(() => lookupOptions(lookups, LOOKUP_TYPES.CATEGORY), [lookups]);

  const filteredProducts = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
    const filtered = products.filter((product) => {
      const matchesSearch = !lower || `${product.name} ${product.description || ''}`.toLowerCase().includes(lower);
      const matchesCategory = selectedCategory === 'all' || String(product.categoryId) === String(selectedCategory);
      const matchesPrice = selectedPriceRange === 'all' || (Number(product.price || 0) >= range.min && Number(product.price || 0) <= range.max);
      const matchesAvailability = availability === 'all' || (availability === 'available' ? product.isavailable : !product.isavailable);
      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
    return sortItems(filtered, selectedSort);
  }, [products, searchTerm, selectedCategory, selectedPriceRange, selectedSort, availability]);

  useEffect(() => { setVisibleCount(12); }, [searchTerm, selectedCategory, selectedPriceRange, selectedSort, availability]);
  useEffect(() => { setHasMore(visibleCount < filteredProducts.length); }, [visibleCount, filteredProducts.length]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setVisibleCount((prev) => prev + 12);
    }, { rootMargin: '200px' });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [hasMore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633] py-16">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"><span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">Products</span></h1>
          <p className="text-lg text-[#5d5955] dark:text-[#c4bfb9] max-w-2xl mx-auto">Browse professional tools with dynamic lookup filters and readable values.</p>
        </motion.div>

        <FilterBar
          mode="products"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLookup={selectedCategory}
          onLookupChange={setSelectedCategory}
          lookupOptions={categoryOptions}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          showAvailability
          availability={availability}
          onAvailabilityChange={setAvailability}
        />

        <div className="mb-6 text-sm text-[#5d5955] dark:text-[#c4bfb9]">Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</div>

        {loading ? <Loading text="Loading products..." /> : error ? <div className="rounded-2xl bg-red-50 text-red-700 p-4">{error}</div> : filteredProducts.length === 0 ? <div className="text-center py-20 text-[#8a8580] dark:text-[#7a756f]">No products found.</div> : (
          <>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, visibleCount).map((product) => <ProductCard key={product.id} product={product} />)}
            </motion.div>
            <div ref={loaderRef} className="flex justify-center py-10">{hasMore && <Loading text="Loading more products..." />}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsIndex;
