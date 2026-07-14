import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService } from '../../services/productService';
import { masteryService } from '../../services/MasteryService';

const highlight = (text = '', query = '') => {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<mark className="bg-[#d4a343]/30 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>;
};

const GlobalSearch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ref = useRef(null);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [masteries, setMasteries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) { setProducts([]); setMasteries([]); setLoading(false); return; }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const [p, m] = await Promise.all([
          productService.getProducts().catch(() => []),
          masteryService.getMasterys().catch(() => []),
        ]);
        const lower = term.toLowerCase();
        setProducts((Array.isArray(p) ? p : []).filter((item) => `${item.name} ${item.description || ''}`.toLowerCase().includes(lower)).slice(0, 5));
        setMasteries((Array.isArray(m) ? m : []).filter((item) => `${item.title} ${item.description || ''}`.toLowerCase().includes(lower)).slice(0, 5));
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [query]);

  const hasResults = products.length > 0 || masteries.length > 0;
  const normalized = useMemo(() => query.trim(), [query]);

  const go = (path) => {
    setQuery('');
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8580]" />
        <input
          value={query}
          onFocus={() => normalized.length >= 2 && setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="w-full rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] bg-[#f5f5f3] dark:bg-[#1a1816] py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#6d2842]/30"
          aria-label={t("search.ariaLabel")}
        />
      </div>
      {open && normalized.length >= 2 && (
        <div className="absolute right-0 mt-2 w-full min-w-[320px] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] shadow-2xl overflow-hidden z-50">
          {loading ? <div className="p-4 text-sm text-[#8a8580]">{t("search.searching")}</div> : !hasResults ? <div className="p-4 text-sm text-[#8a8580]">{t("search.noResults")}</div> : (
            <div className="max-h-96 overflow-auto py-2">
              {products.length > 0 && <p className="px-4 py-2 text-xs uppercase tracking-wide text-[#8a8580]">{t("search.products")}</p>}
              {products.map((item) => (
                <button key={`p-${item.id}`} onClick={() => go(`/products/${item.id}`)} className="block w-full text-left px-4 py-2 hover:bg-[#f5f5f3] dark:hover:bg-[#1a1816]">
                  <p className="font-semibold text-sm">{highlight(item.name, normalized)}</p>
                  <p className="text-xs text-[#8a8580] truncate">{item.description || t("search.productListing")}</p>
                </button>
              ))}
              {masteries.length > 0 && <p className="px-4 py-2 text-xs uppercase tracking-wide text-[#8a8580]">{t("search.masteries")}</p>}
              {masteries.map((item) => (
                <button key={`m-${item.id}`} onClick={() => go(`/Masterys/${item.id}`)} className="block w-full text-left px-4 py-2 hover:bg-[#f5f5f3] dark:hover:bg-[#1a1816]">
                  <p className="font-semibold text-sm">{highlight(item.title, normalized)}</p>
                  <p className="text-xs text-[#8a8580] truncate">{item.description || t("search.serviceListing")}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
