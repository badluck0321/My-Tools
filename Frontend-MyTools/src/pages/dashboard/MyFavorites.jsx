import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../../services/favoriteService';

const targetPath = (item) => {
  const type = item.targetType || (item.masteryId ? 'MASTERY' : 'PRODUCT');
  const id = item.targetId || item.masteryId || item.productId;
  return type === 'MASTERY' ? `/Masterys/${id}` : `/products/${id}`;
};

const targetId = (item) => item.targetId || item.masteryId || item.productId;
const targetType = (item) => item.targetType || (item.masteryId ? 'MASTERY' : 'PRODUCT');

const FavoriteCard = ({ item, onRemoved }) => {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);
  const id = targetId(item);
  const type = targetType(item);

  const handleRemove = async (e) => {
    e.stopPropagation();
    setRemoving(true);
    try {
      if (type === 'MASTERY') await favoriteService.removeMastery(id);
      else await favoriteService.removeProduct(id);
      onRemoved(type, id);
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, height: 0 }} whileHover={{ y: -3 }} onClick={() => navigate(targetPath(item))} className="bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all">
      <div className={`h-1.5 ${type === 'MASTERY' ? 'bg-gradient-to-r from-[#508978] to-[#70a596]' : 'bg-gradient-to-r from-[#6d2842] to-[#a64d6d]'}`} />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] uppercase tracking-wide text-[#8a8580]">{type === 'MASTERY' ? 'Mastery' : 'Product'}</span>
            <h3 className="font-semibold text-[#1a1816] dark:text-[#f0ece8] truncate group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors">{item.itemName || item.productName || 'Saved item'}</h3>
            <p className="text-lg font-bold bg-gradient-to-r from-[#6d2842] to-[#a64d6d] bg-clip-text text-transparent mt-0.5">{Number(item.price || 0).toFixed(2)} MAD</p>
          </div>
          <ExternalLink size={14} className="text-[#c4bfb9] group-hover:text-[#6d2842] transition-colors flex-shrink-0 mt-1" />
        </div>
        {item.savedAt && <p className="text-xs text-[#b0aba5] dark:text-[#6d6762]">Saved {new Date(item.savedAt).toLocaleDateString()}</p>}
        <button onClick={handleRemove} disabled={removing} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors active:scale-95 disabled:opacity-50 text-sm font-semibold">
          {removing ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" /> : <Trash2 size={15} />}
          Remove
        </button>
      </div>
    </motion.div>
  );
};

const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await favoriteService.list();
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data || 'Unable to load favorites.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRemoved = (type, id) => {
    setFavorites((prev) => prev.filter((f) => !(targetType(f) === type && targetId(f) === id)));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#508978] to-[#70a596] rounded-2xl shadow-lg shadow-[#508978]/30"><Heart className="w-6 h-6 text-white" /></div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-[#fafaf9]">My Favorites</h2>
          {!loading && <p className="text-sm text-[#8a8580] dark:text-[#7a756f] mt-0.5">{favorites.length} saved item{favorites.length !== 1 ? 's' : ''}</p>}
        </div>
      </div>

      <div className="bg-[#f5f5f3] dark:bg-gradient-to-br dark:from-[#3a3633] dark:to-[#2d2a27] rounded-2xl p-6 border border-[#e8e7e5] dark:border-[#4a4642]">
        {loading ? <div className="flex justify-center py-16"><span className="w-7 h-7 border-2 border-[#508978]/30 border-t-[#508978] rounded-full animate-spin" /></div> : error ? <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div> : favorites.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#eeece9] dark:bg-[#2d2a27] flex items-center justify-center mx-auto"><Heart size={24} className="text-[#c4bfb9]" /></div>
            <p className="text-[#8a8580] dark:text-[#7a756f]">No favorites yet.</p>
            <div className="flex justify-center gap-4 text-sm"><button onClick={() => navigate('/Products')} className="text-[#6d2842] underline underline-offset-4">Browse products</button><button onClick={() => navigate('/Masterys')} className="text-[#6d2842] underline underline-offset-4">Browse masteries</button></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>{favorites.map((item) => <FavoriteCard key={`${targetType(item)}-${targetId(item)}`} item={item} onRemoved={handleRemoved} />)}</AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyFavorites;
