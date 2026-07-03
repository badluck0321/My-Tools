import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '../../components/common';
import MasteryCard from '../../components/common/MasteryCard';
import FilterBar from '../../components/filters/FilterBar';
import { PRICE_RANGES } from '../../utils/constants';
import { masteryService } from '../../services/MasteryService';
import { useLookups } from '../../hooks/useLookups';
import { LOOKUP_TYPES, lookupOptions } from '../../utils/lookupUtils';

const sortItems = (items, sort) => {
  const sorted = [...items];
  if (sort === 'price-low') return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  if (sort === 'price-high') return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  if (sort === 'oldest') return sorted.reverse();
  return sorted;
};

const MasterysIndex = () => {
  const { lookups } = useLookups();
  const [masterys, setMasterys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    masteryService.getMasterys()
      .then((data) => setMasterys(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.response?.data || 'Unable to load masteries.'))
      .finally(() => setLoading(false));
  }, []);

  const typeOptions = useMemo(() => lookupOptions(lookups, LOOKUP_TYPES.MASTERY_TYPE), [lookups]);

  const filteredMasterys = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
    const filtered = masterys.filter((mastery) => {
      const typeCode = mastery.typeId ?? mastery.masteryTypeId;
      const matchesSearch = !lower || `${mastery.title} ${mastery.description || ''}`.toLowerCase().includes(lower);
      const matchesType = selectedType === 'all' || String(typeCode) === String(selectedType);
      const matchesPrice = selectedPriceRange === 'all' || (Number(mastery.price || 0) >= range.min && Number(mastery.price || 0) <= range.max);
      return matchesSearch && matchesType && matchesPrice;
    });
    return sortItems(filtered, selectedSort);
  }, [masterys, searchTerm, selectedType, selectedPriceRange, selectedSort]);

  useEffect(() => { setVisibleCount(12); }, [searchTerm, selectedType, selectedPriceRange, selectedSort]);
  useEffect(() => { setHasMore(visibleCount < filteredMasterys.length); }, [visibleCount, filteredMasterys.length]);
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
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"><span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">Masteries / Services</span></h1>
          <p className="text-lg text-[#5d5955] dark:text-[#c4bfb9] max-w-2xl mx-auto">Discover services using dynamic mastery-specific filters.</p>
        </motion.div>

        <FilterBar
          mode="masteries"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLookup={selectedType}
          onLookupChange={setSelectedType}
          lookupOptions={typeOptions}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />

        <div className="mb-6 text-sm text-[#5d5955] dark:text-[#c4bfb9]">Showing {Math.min(visibleCount, filteredMasterys.length)} of {filteredMasterys.length} masteries</div>
        {loading ? <Loading text="Loading masteries..." /> : error ? <div className="rounded-2xl bg-red-50 text-red-700 p-4">{error}</div> : filteredMasterys.length === 0 ? <div className="text-center py-20 text-[#8a8580] dark:text-[#7a756f]">No masteries found.</div> : (
          <>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMasterys.slice(0, visibleCount).map((mastery) => <MasteryCard key={mastery.id} mastery={mastery} />)}
            </motion.div>
            <div ref={loaderRef} className="flex justify-center py-10">{hasMore && <Loading text="Loading more masteries..." />}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default MasterysIndex;
