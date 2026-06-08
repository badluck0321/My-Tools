import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, CheckCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useKeycloak } from '../../providers/KeycloakProvider';

const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
};

// ── Star Rating Input ────────────────────────────────
const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)}>
        <Star size={22} className={`transition-colors ${
          s <= value ? 'fill-[#b8862f] text-[#b8862f]' : 'text-[#d4cfc9]'
        }`} />
      </button>
    ))}
  </div>
);

// ── Star Display ─────────────────────────────────────
const StarDisplay = ({ value, size = 16 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size} className={`${
        s <= value ? 'fill-[#b8862f] text-[#b8862f]' : 'text-[#d4cfc9]'
      }`} />
    ))}
  </div>
);

// ── ReviewSection ────────────────────────────────────
const ReviewSection = ({ productId }) => {
  const { authenticated, token } = useKeycloak();
  const userId = token ? parseJwt(token)?.sub : null;

  const [reviews, setReviews]       = useState([]);
  const [average, setAverage]       = useState({ average: 0, count: 0 });
  const [loading, setLoading]       = useState(true);
  const [rating, setRating]         = useState(0);
  const [comment, setComment]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  const alreadyReviewed = reviews.some(r => r.userId === userId);

  const load = async () => {
    setLoading(true);
    try {
      const [rev, avg] = await Promise.all([
        reviewService.getReviews(productId),
        reviewService.getAverage(productId),
      ]);
      setReviews(rev.data);
      setAverage(avg.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    setSubmitting(true); setError(null);
    try {
      await reviewService.addReview({ productId, masteryId ,rating, comment });
      setRating(0); setComment('');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      await load();
    } catch { /* silent */ }
  };

  return (
    <div className="space-y-6 mt-8">

      {/* Header with average */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#1a1816] dark:text-[#f0ece8]">
          Reviews ({average.count})
        </h3>
        {average.count > 0 && (
          <div className="flex items-center gap-2">
            <StarDisplay value={Math.round(average.average)} />
            <span className="font-bold text-[#b8862f]">
              {average.average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Add review form */}
      {authenticated && !alreadyReviewed && (
        <form onSubmit={handleSubmit}
          className="glass dark:glass-dark rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9]">
            Leave a review
          </p>
          <StarInput value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
          />
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button type="submit" disabled={submitting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
            {submitting
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : 'Submit Review'
            }
          </button>
        </form>
      )}

      {alreadyReviewed && (
        <p className="text-sm text-[#8a8580] italic">
          You have already reviewed this product.
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <span className="w-6 h-6 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-[#8a8580] dark:text-[#7a756f] text-center py-6">
          No reviews yet. Be the first!
        </p>
      ) : (
        <AnimatePresence>
          {reviews.map(r => (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass dark:glass-dark rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1a1816] dark:text-[#f0ece8]">
                    {r.username}
                  </span>
                  {r.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle size={11} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StarDisplay value={r.rating} size={14} />
                  {r.userId === userId && (
                    <button onClick={() => handleDelete(r.id)}
                      className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">{r.comment}</p>
              )}
              <p className="text-xs text-[#b0aba5]">
                {new Date(r.createdAt).toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'})}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ReviewSection;