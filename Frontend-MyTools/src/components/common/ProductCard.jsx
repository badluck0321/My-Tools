import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { useKeycloak } from '../../providers/KeycloakProvider';
import { cartService } from '../../services/cartService';
import { favoriteService } from '../../services/favoriteService';
import { useLookups } from '../../hooks/useLookups';
import { LOOKUP_TYPES, lookupLabel } from '../../utils/lookupUtils';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { authenticated, login } = useKeycloak();
  const { lookups } = useLookups();
  const [cartStatus, setCartStatus] = useState('idle');
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!authenticated || !product?.id) return;
    favoriteService.statusProduct(product.id)
      .then((res) => setIsFavorited(Boolean(res.data?.favorited)))
      .catch(() => setIsFavorited(false));
  }, [authenticated, product?.id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authenticated) { login(); return; }
    if (cartStatus === 'loading' || cartStatus === 'added') return;
    setCartStatus('loading');
    try {
      await cartService.addItem({ productId: product.id, listingType: Number(product.listedForId) === 1 ? 'RENT' : 'SALE' });
      setCartStatus('added');
    } catch (err) {
      console.error(err);
      setCartStatus('error');
    } finally {
      setTimeout(() => setCartStatus('idle'), 1800);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authenticated) { login(); return; }
    if (favLoading) return;
    setFavLoading(true);
    try {
      const res = await favoriteService.toggleProduct(product.id);
      setIsFavorited(Boolean(res.data?.favorited));
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const category = lookupLabel(lookups, LOOKUP_TYPES.CATEGORY, product.categoryId, 'Uncategorized');
  const mark = lookupLabel(lookups, LOOKUP_TYPES.MARK, product.markId, 'No mark');
  const currency = product.currencyId || 'MAD';

  return (
    <div onClick={() => navigate(`/products/${product.id}`)}>
      <motion.div whileHover={{ y: -8 }} className="card-elegant overflow-hidden group cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <img src={product.photoUrls?.length ? getImageUrl(product.photoUrls[0]) : '/no-image.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <motion.button onClick={handleFavorite} whileTap={{ scale: 0.85 }} disabled={favLoading} title={!authenticated ? 'Sign in to save' : isFavorited ? 'Remove from favorites' : 'Add to favorites'} className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 disabled:opacity-60 ${isFavorited ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500 hover:scale-110'}`}>
            {favLoading ? <span className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" /> : <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'fill-current' : ''}`} />}
          </motion.button>

          <motion.button onClick={handleAddToCart} whileTap={{ scale: 0.9 }} title={!authenticated ? 'Sign in to add to cart' : cartStatus === 'added' ? 'Added!' : 'Add to cart'} className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${cartStatus === 'added' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : cartStatus === 'error' ? 'bg-red-500 text-white' : 'bg-white/80 text-[#6d2842] hover:bg-white hover:scale-110'}`}>
            {cartStatus === 'loading' ? <span className="w-5 h-5 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin block" /> : cartStatus === 'added' ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </motion.button>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
          {product.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(product.price)} {currency !== 'MAD' ? currency : ''}</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">{category}</span>
          </div>
          <p className="mt-2 text-xs text-[#8a8580]">{mark}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;
