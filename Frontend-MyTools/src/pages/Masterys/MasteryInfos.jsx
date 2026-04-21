import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  CheckCircle,
  XCircle,
  Heart,
  ShoppingCart,
  Share2,
} from 'lucide-react';
import { Loading } from '../../components/common';
import { productService } from '../../services/productService';

/* ─── PhotoImage: fetches one photo via service, renders it ── */
const PhotoImage = ({ photoId, alt, className }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let objectUrl = null;
    productService.getProductPhoto(photoId)
      .then((url) => {
        objectUrl = url;
        setSrc(url);
      })
      .catch(() => setSrc(null));

    // revoke the blob URL when the component unmounts or photoId changes
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [photoId]);

  if (!src)
    return (
      <div className={`${className} bg-[#f0eeeb] dark:bg-[#2d2a27] flex items-center justify-center text-[#8a8580] text-sm`}>
        Loading…
      </div>
    );

  return <img src={src} alt={alt} className={className} />;
};

/* ─── Image Gallery ───────────────────────────────── */
const Gallery = ({ photoIds }) => {
  const [current, setCurrent] = useState(0);
  const total = photoIds.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative w-full">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#f0eeeb] dark:bg-[#2d2a27] aspect-[4/3]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <PhotoImage
              photoId={photoIds[current]}
              alt={`Photo ${current + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows — only if multiple photos */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition-transform"
            >
              <ChevronRight size={20} />
            </button>

            {/* Counter badge */}
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {current + 1} / {total}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails — only if multiple photos */}
      {total > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {photoIds.map((id, i) => (
            <button
              key={id}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === current
                  ? 'border-[#6d2842] scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <PhotoImage
                photoId={id}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Badge ───────────────────────────────────────── */
const Badge = ({ children, color = 'default' }) => {
  const colors = {
    default: 'bg-[#f0eeeb] dark:bg-[#3a3633] text-[#5d5955] dark:text-[#c4bfb9]',
    green: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
    primary: 'bg-[#6d2842]/10 text-[#6d2842] dark:bg-[#6d2842]/30 dark:text-[#e8a0b4]',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
};

/* ─── Info Row ────────────────────────────────────── */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-[#e8e7e5] dark:border-[#3a3633] last:border-0">
    <span className="text-sm text-[#8a8580] dark:text-[#7a756f]">{label}</span>
    <span className="text-sm font-medium text-[#2d2a27] dark:text-[#e8e4e0]">{value}</span>
  </div>
);

/* ─── Main Component ──────────────────────────────── */
const MasteryInfos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService.getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err?.message ?? 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading text="Loading product..." />;

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#6d2842] font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm underline"
        >
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );

  const listedForLabel =
    product.listedFor === 0 ? 'Sale' : product.listedFor === 1 ? 'Rent' : 'Both';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633]">
      <div className="container-custom py-12">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#5d5955] dark:text-[#c4bfb9] hover:text-[#6d2842] dark:hover:text-[#e8a0b4] transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Left: Gallery ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {product.photoIds && product.photoIds.length > 0 ? (
              <Gallery photoIds={product.photoIds} />
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-[#f0eeeb] dark:bg-[#2d2a27] flex items-center justify-center text-[#8a8580]">
                No image available
              </div>
            )}
          </motion.div>

          {/* ── Right: Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              <Badge color={product.isavailable ? 'green' : 'red'}>
                {product.isavailable ? (
                  <><CheckCircle size={12} /> Available</>
                ) : (
                  <><XCircle size={12} /> Unavailable</>
                )}
              </Badge>
              <Badge color="primary">
                <Tag size={12} /> {listedForLabel}
              </Badge>
              {product.duration > 0 && (
                <Badge>
                  <Clock size={12} /> {product.duration} months
                </Badge>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-[#1a1816] dark:text-[#f0ece8]">
                {product.name}
              </h1>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[#5d5955] dark:text-[#c4bfb9] leading-relaxed text-base">
                {product.description}
              </p>
            )}

            {/* Details table */}
            <div className="glass dark:glass-dark rounded-2xl px-5 py-1">
              <InfoRow label="Serie No." value={`#${product.serieNum}`} />
              <InfoRow label="Category ID" value={product.categoryId} />
              <InfoRow label="Mark ID" value={product.markId} />
              {product.ownerId && (
                <InfoRow label="Owner" value={product.ownerId} />
              )}
              <InfoRow
                label="Photos"
                value={`${product.photoIds?.length ?? 0} image${product.photoIds?.length !== 1 ? 's' : ''}`}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#6d2842]/20"
              >
                <ShoppingCart size={18} />
                {product.listedFor === 1 ? 'Rent Now' : 'Add to Cart'}
              </button>

              <button
                onClick={() => setIsLiked((v) => !v)}
                className={`p-3.5 rounded-xl border transition-all active:scale-95 ${
                  isLiked
                    ? 'bg-[#6d2842] border-[#6d2842] text-white'
                    : 'border-[#d4cfc9] dark:border-[#4a4642] text-[#5d5955] dark:text-[#c4bfb9] hover:border-[#6d2842] hover:text-[#6d2842]'
                }`}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              </button>

              <button className="p-3.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] text-[#5d5955] dark:text-[#c4bfb9] hover:border-[#6d2842] hover:text-[#6d2842] transition-all active:scale-95">
                <Share2 size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MasteryInfos;