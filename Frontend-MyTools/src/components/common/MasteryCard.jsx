import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const MasteryCard = ({ mastery, onLike, isLiked = false }) => {
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) onLike(mastery._id);
  };

  return (
    // <Link to={`/product/${mastery.id}`}>
    <div onClick={() => navigate(`/mastery/${mastery.id}`)} className="cursor-pointer ...">
      <motion.div
        whileHover={{ y: -8 }}
        className="card-elegant overflow-hidden group cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={
              mastery.photoUrls
                ? getImageUrl(mastery.photoId)
                : "/no-image.png"
            }
            alt={mastery.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {mastery.title}
          </h3>

          {mastery.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {mastery.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(mastery.price)}
            </span>

            {mastery.categoryId && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                Category {mastery.typeId}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
    //</Link> 
  );
};

export default MasteryCard;
