import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { useKeycloak } from '../../providers/KeycloakProvider'; // adjust path
import interceptor from '../../interceptors/auth.interceptor'; // adjust path

/* ─── API helpers ─────────────────────────────────── */
const addToCart = (productId, listingType = 'SALE') =>
  interceptor.post('/cart/items', { productId, listingType });

const toggleFavorite = (productId) =>
  interceptor.post(`/favorites/${productId}`);

const checkFavorite = (productId) =>
  interceptor.get(`/favorites/${productId}/status`);

/* ─── ProductCard ─────────────────────────────────── */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { authenticated, login } = useKeycloak();

  // cart state
  const [cartStatus, setCartStatus] = useState('idle'); // idle | loading | added | error

  // favorite state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // check favorite status on mount (only if authenticated)
  useEffect(() => {
    if (!authenticated) return;
    checkFavorite(product.id)
      .then((res) => setIsFavorited(res.data?.favorited ?? false))
      .catch(() => {});
  }, [authenticated, product.id]);

  /* ── Add to Cart ── */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authenticated) { login(); return; }
    if (cartStatus === 'loading' || cartStatus === 'added') return;

    setCartStatus('loading');
    try {
      await addToCart(
        product.id,
        product.listedFor === 1 ? 'RENT' : 'SALE'
      );
      setCartStatus('added');
      setTimeout(() => setCartStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setCartStatus('error');
      setTimeout(() => setCartStatus('idle'), 2000);
    }
  };

  /* ── Toggle Favorite ── */
  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authenticated) { login(); return; }
    if (favLoading) return;

    setFavLoading(true);
    try {
      const res = await toggleFavorite(product.id);
      setIsFavorited(res.data?.favorited ?? !isFavorited);
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div onClick={() => navigate(`/products/${product.id}`)}>
      <motion.div
        whileHover={{ y: -8 }}
        className="card-elegant overflow-hidden group cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={
              product.photoUrls?.length > 0
                ? getImageUrl(product.photoUrls[0])
                : '/no-image.png'
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* ── Favorite Button (top-left) ── */}
          <motion.button
            onClick={handleFavorite}
            whileTap={{ scale: 0.85 }}
            disabled={favLoading}
            title={!authenticated ? 'Sign in to save' : isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 disabled:opacity-60 ${
              isFavorited
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500 hover:scale-110'
            }`}
          >
            {favLoading ? (
              <span className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
            ) : (
              <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'fill-current' : ''}`} />
            )}
          </motion.button>

          {/* ── Add to Cart Button (top-right) ── */}
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.9 }}
            title={
              !authenticated ? 'Sign in to add to cart'
              : cartStatus === 'added' ? 'Added!'
              : 'Add to cart'
            }
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              cartStatus === 'added'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                : cartStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-[#6d2842] hover:bg-white hover:scale-110'
            }`}
          >
            {cartStatus === 'loading' ? (
              <span className="w-5 h-5 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin block" />
            ) : cartStatus === 'added' ? (
              <Check className="w-5 h-5" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(product.price)}
            </span>

            {product.categoryId && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                Category {product.categoryId}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;