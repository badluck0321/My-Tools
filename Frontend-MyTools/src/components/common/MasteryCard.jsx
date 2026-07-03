import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { useKeycloak } from '../../providers/KeycloakProvider';
import { favoriteService } from '../../services/favoriteService';
import { useLookups } from '../../hooks/useLookups';
import { LOOKUP_TYPES, lookupLabel } from '../../utils/lookupUtils';

const MasteryCard = ({ mastery }) => {
  const navigate = useNavigate();
  const { authenticated, login } = useKeycloak();
  const { lookups } = useLookups();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticated || !mastery?.id) return;
    favoriteService.statusMastery(mastery.id)
      .then((res) => setIsLiked(Boolean(res.data?.favorited)))
      .catch(() => setIsLiked(false));
  }, [authenticated, mastery?.id]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authenticated) { login(); return; }
    if (loading) return;
    setLoading(true);
    try {
      const res = await favoriteService.toggleMastery(mastery.id);
      setIsLiked(Boolean(res.data?.favorited));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const typeCode = mastery.typeId ?? mastery.masteryTypeId;
  const typeLabel = lookupLabel(lookups, LOOKUP_TYPES.MASTERY_TYPE, typeCode, 'Service');

  return (
    <div onClick={() => navigate(`/Masterys/${mastery.id}`)}>
      <motion.div whileHover={{ y: -8 }} className="card-elegant overflow-hidden group cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <img src={mastery.photoUrls?.length ? getImageUrl(mastery.photoUrls[0]) : '/no-image.png'} alt={mastery.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <button onClick={handleLike} disabled={loading} className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 disabled:opacity-60 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'}`}>
            {loading ? <span className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" /> : <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />}
          </button>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{mastery.title}</h3>
          {mastery.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{mastery.description}</p>}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(mastery.price)}</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">{typeLabel}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MasteryCard;
