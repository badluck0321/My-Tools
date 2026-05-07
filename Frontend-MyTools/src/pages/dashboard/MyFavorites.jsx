import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import interceptor from '../../interceptors/auth.interceptor'; // adjust path

/* ─── API helpers ─────────────────────────────────── */
const fetchFavorites   = ()           => interceptor.get('/favorites');
const removeFavorite   = (productId) => interceptor.delete(`/favorites/${productId}`);
const addToCart        = (productId, listingType = 'SALE') =>
  interceptor.post('/cart/items', { productId, listingType });

/* ─── Favorite Product Card ───────────────────────── */
const FavoriteCard = ({ item, onRemoved, onCartAdded }) => {
  const navigate = useNavigate();
  const [removing, setRemoving]     = useState(false);
  const [cartStatus, setCartStatus] = useState('idle'); // idle | loading | added

  const handleRemove = async (e) => {
    e.stopPropagation();
    setRemoving(true);
    try {
      await removeFavorite(item.productId);
      onRemoved(item.productId);
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (cartStatus !== 'idle') return;
    setCartStatus('loading');
    try {
      await addToCart(item.productId);
      setCartStatus('added');
      setTimeout(() => setCartStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setCartStatus('idle');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, height: 0 }}
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/products/${item.productId}`)}
      className="bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all"
    >
      {/* Top color band */}
      <div className="h-1.5 bg-gradient-to-r from-[#6d2842] to-[#a64d6d]" />

      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#1a1816] dark:text-[#f0ece8] truncate group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors">
              {item.productName}
            </h3>
            <p className="text-lg font-bold bg-gradient-to-r from-[#6d2842] to-[#a64d6d] bg-clip-text text-transparent mt-0.5">
              ${item.price?.toFixed(2)}
            </p>
          </div>
          {/* External link hint */}
          <ExternalLink
            size={14}
            className="text-[#c4bfb9] group-hover:text-[#6d2842] transition-colors flex-shrink-0 mt-1"
          />
        </div>

        {/* Saved date */}
        {item.savedAt && (
          <p className="text-xs text-[#b0aba5] dark:text-[#6d6762]">
            Saved {new Date(item.savedAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </p>
        )}

        {/* Actions */}
        <div
          className="flex gap-2 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={cartStatus !== 'idle'}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              cartStatus === 'added'
                ? 'bg-green-500 text-white'
                : 'bg-[#6d2842]/10 dark:bg-[#6d2842]/30 text-[#6d2842] dark:text-[#e8a0b4] hover:bg-[#6d2842]/20 active:scale-95'
            }`}
          >
            {cartStatus === 'loading' ? (
              <span className="w-3.5 h-3.5 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
            ) : cartStatus === 'added' ? (
              <><Check size={13} /> Added!</>
            ) : (
              <><ShoppingCart size={13} /> Add to Cart</>
            )}
          </button>

          {/* Remove from Favorites */}
          <button
            onClick={handleRemove}
            disabled={removing}
            title="Remove from favorites"
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-500 transition-colors active:scale-95 disabled:opacity-50"
          >
            {removing
              ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
              : <Trash2 size={15} />
            }
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── MyFavorites ────────────────────────────── */
const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFavorites();
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRemoved = (productId) => {
    setFavorites((prev) => prev.filter((f) => f.productId !== productId));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#508978] to-[#70a596] rounded-2xl shadow-lg shadow-[#508978]/30">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-[#fafaf9]">My Favorites</h2>
          {!loading && (
            <p className="text-sm text-[#8a8580] dark:text-[#7a756f] mt-0.5">
              {favorites.length} saved product{favorites.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#f5f5f3] dark:bg-gradient-to-br dark:from-[#3a3633] dark:to-[#2d2a27] rounded-2xl p-6 border border-[#e8e7e5] dark:border-[#4a4642]">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-7 h-7 border-2 border-[#508978]/30 border-t-[#508978] rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#eeece9] dark:bg-[#2d2a27] flex items-center justify-center mx-auto">
              <Heart size={24} className="text-[#c4bfb9]" />
            </div>
            <p className="text-[#8a8580] dark:text-[#7a756f]">No favorites yet.</p>
            <button
              onClick={() => navigate('/Products')}
              className="text-sm text-[#6d2842] dark:text-[#e8a0b4] underline underline-offset-4 hover:opacity-75 transition"
            >
              Browse products
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {favorites.map((item) => (
                <FavoriteCard
                  key={item.productId}
                  item={item}
                  onRemoved={handleRemoved}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyFavorites;