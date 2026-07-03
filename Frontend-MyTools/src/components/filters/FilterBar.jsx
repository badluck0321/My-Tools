import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { Button, Input } from '../common';
import { PRICE_RANGES, SORT_OPTIONS } from '../../utils/constants';

const FilterBar = ({
  mode = 'products',
  searchTerm,
  onSearchChange,
  selectedLookup = 'all',
  onLookupChange,
  lookupOptions = [],
  selectedPriceRange,
  onPriceRangeChange,
  selectedSort,
  onSortChange,
  showAvailability = false,
  availability,
  onAvailabilityChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const lookupLabel = mode === 'masteries' ? 'Mastery type' : 'Category';

  const reset = () => {
    onSearchChange('');
    onLookupChange('all');
    onPriceRangeChange('all');
    onSortChange('newest');
    if (onAvailabilityChange) onAvailabilityChange('all');
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={`Search ${mode === 'masteries' ? 'masteries' : 'products'}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" icon={Filter} onClick={() => setShowFilters((v) => !v)} className="lg:hidden">
          Filters
        </Button>
      </div>

      <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="glass dark:glass-dark rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3">{lookupLabel}</label>
              <select value={selectedLookup} onChange={(e) => onLookupChange(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800">
                <option value="all">All</option>
                {lookupOptions.map((option) => (
                  <option key={`${option.value}-${option.label}`} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Price Range</label>
              <select value={selectedPriceRange} onChange={(e) => onPriceRangeChange(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800">
                {PRICE_RANGES.map((range) => <option key={range.id} value={range.id}>{range.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Sort By</label>
              <select value={selectedSort} onChange={(e) => onSortChange(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800">
                {SORT_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </div>

            {showAvailability && (
              <div>
                <label className="block text-sm font-medium mb-3">Availability</label>
                <select value={availability} onChange={(e) => onAvailabilityChange(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800">
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            )}
          </div>
          {(searchTerm || selectedLookup !== 'all' || selectedPriceRange !== 'all' || selectedSort !== 'newest' || availability !== 'all') && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" icon={X} onClick={reset}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
