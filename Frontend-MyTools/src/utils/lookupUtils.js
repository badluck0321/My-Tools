export const LOOKUP_TYPES = {
  CATEGORY: 'CATEGORY',
  MARK: 'MARK',
  CONDITION: 'CONDITION',
  LISTING_TYPE: 'LISTING_TYPE',
  CURRENCY: 'CURRENCY',
  MASTERY_TYPE: 'MASTERY_TYPE',
  MASTERY_STATUS: 'MASTERY_STATUS',
  PRICING_TYPE: 'PRICING_TYPE',
};

export const normalizeLookupCode = (value) => String(value ?? '').trim();

export const lookupLabel = (lookups, type, code, fallback = '—') => {
  if (code === null || code === undefined || code === '') return fallback;
  const normalized = normalizeLookupCode(code);
  const found = (lookups || []).find((item) =>
    item?.type === type && normalizeLookupCode(item?.code) === normalized
  );
  return found?.value || found?.label || fallback;
};

export const lookupOptions = (lookups, type, { includeAll = false, allLabel = 'All' } = {}) => {
  const options = (lookups || [])
    .filter((item) => item?.type === type && item?.active !== false && item?.isActive !== false)
    .map((item) => ({ value: item.code, label: item.value || item.label || item.code, id: item.id }));
  return includeAll ? [{ value: 'all', label: allLabel }, ...options] : options;
};

export const listingLabel = (lookups, listedForId) => {
  const normalized = Number(listedForId) === 30 ? '2' : String(listedForId ?? '');
  return lookupLabel(lookups, LOOKUP_TYPES.LISTING_TYPE, normalized, '—');
};

export const formatMoney = (amount, currency = 'MAD') => `${Number(amount || 0).toFixed(2)} ${currency}`;
