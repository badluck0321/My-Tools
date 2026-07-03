import { useEffect, useMemo, useState } from 'react';
import { lookupService } from '../services/lookupService';
import { lookupLabel, lookupOptions } from '../utils/lookupUtils';

let lookupCache = null;
let lookupPromise = null;

const loadLookupCache = async () => {
  if (lookupCache) return lookupCache;
  if (!lookupPromise) {
    lookupPromise = lookupService.list().then((res) => {
      lookupCache = Array.isArray(res.data) ? res.data : [];
      return lookupCache;
    });
  }
  return lookupPromise;
};

export const invalidateLookupCache = () => {
  lookupCache = null;
  lookupPromise = null;
};

export const useLookups = () => {
  const [lookups, setLookups] = useState(lookupCache || []);
  const [loading, setLoading] = useState(!lookupCache);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(!lookupCache);
    loadLookupCache()
      .then((items) => { if (mounted) setLookups(items); })
      .catch((err) => { if (mounted) setError(err?.response?.data || 'Unable to load lookups.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const helpers = useMemo(() => ({
    label: (type, code, fallback) => lookupLabel(lookups, type, code, fallback),
    options: (type, opts) => lookupOptions(lookups, type, opts),
  }), [lookups]);

  return { lookups, loading, error, ...helpers };
};
