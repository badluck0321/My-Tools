import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../components/common';
import MasteryCard from '../../components/common/MasteryCard';
import FilterBar from '../../components/filters/FilterBar';
import { masteryService } from '../../services/MasteryService';

const sortItems = (items, sort) => {
  const sorted = [...items];
  if (sort === 'price-asc') return sorted.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === 'price-desc') return sorted.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === 'top') return sorted.sort((a, b) => Number(b.avgRating || 0) - Number(a.avgRating || 0));
  return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

const MasterysIndex = () => {
  const { t } = useTranslation();
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

  const filteredMasterys = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    const filtered = masterys.filter((mastery) => {
      const matchesSearch = !lower || `${mastery.title} ${mastery.description || ''}`.toLowerCase().includes(lower);
      const matchesType = selectedType === 'all' || mastery.typeId === selectedType;
      const matchesPrice = selectedPriceRange === 'all' || true;
      return matchesSearch && matchesType && matchesPrice;
    });
    return sortItems(filtered, selectedSort);
  }, [masterys, searchTerm, selectedType, selectedPriceRange, selectedSort]);

  useEffect(() => { setVisibleCount(12); }, [searchTerm, selectedType, selectedPriceRange, selectedSort]);
  useEffect(() => { setHasMore(visibleCount < filteredMasterys.length); }, [visibleCount, filteredMasterys.length]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setVisibleCount((count) => Math.min(count + 12, filteredMasterys.length));
    }, { rootMargin: '200px' });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, filteredMasterys.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633] py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"><span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">Masteries / Services</span></h1>
        </div>

        <FilterBar
          mode="masteries"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLookup={selectedType}
          onLookupChange={setSelectedType}
          lookupOptions={[]}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />

        {loading ? <Loading text={t('common.loading')} /> : error ? <div className="rounded-2xl bg-red-50 text-red-700 p-4">{error}</div> : filteredMasterys.length === 0 ? <div className="text-center py-20 text-[#8a8580] dark:text-[#7a756f]">No masteries found.</div> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMasterys.slice(0, visibleCount).map((mastery) => <MasteryCard key={mastery.id} mastery={mastery} />)}
            </div>
            <div ref={loaderRef} className="flex justify-center py-10">{hasMore && <Loading text={t('common.loading')} />}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default MasterysIndex;
