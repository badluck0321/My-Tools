import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart, X, Trash2, Plus, Minus,
  ChevronRight, ShoppingBag, Package,
} from 'lucide-react';
import { useKeycloak } from '../../providers/KeycloakProvider'; // adjust path
import interceptor from '../../interceptors/auth.interceptor'; // adjust path

/* ─── service ─────────────────────────────────────── */
const cartService = {
  getCart:      ()           => interceptor.get('/cart'),
  removeItem:   (productId) => interceptor.delete(`/cart/items/${productId}`),
  clearCart:    ()           => interceptor.delete('/cart'),
  updateQty:    (productId, quantity) =>
    interceptor.put(`/cart/items/${productId}`, { quantity }),
};

/* ─── CartWidget ──────────────────────────────────── */
const CartWidget = () => {
  const { authenticated } = useKeycloak();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const itemCount = cart?.items?.length ?? 0;

  /* ── fetch cart ── */
  const loadCart = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  // load on mount + when authenticated changes
  useEffect(() => { loadCart(); }, [loadCart]);

  // reload when panel opens
  useEffect(() => { if (open) loadCart(); }, [open, loadCart]);

  /* ── remove item ── */
  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await cartService.removeItem(productId);
      await loadCart();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  /* ── clear cart ── */
  const handleClear = async () => {
    try {
      await cartService.clearCart();
      setCart((prev) => ({ ...prev, items: [] }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ── checkout ── */
  const handleCheckout = () => {
    setOpen(false);
    navigate('/checkout');
  };

  /* ── total ── */
  const total = cart?.items?.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  ) ?? 0;

  // don't render if not authenticated
  if (!authenticated) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">

      {/* Expanded Cart Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="w-80 bg-white dark:bg-[#2d2a27] rounded-3xl shadow-2xl border border-[#e8e7e5] dark:border-[#4a4642] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#6d2842] to-[#a64d6d]">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-white" />
                <span className="text-white font-bold text-sm">{t('cart.title')}</span>
                {itemCount > 0 && (
                  <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {itemCount > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-white/70 hover:text-white text-xs transition-colors"
                  >
                    {t('cart.clearAll')}
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X size={15} className="text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-72 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10">
                  <span className="w-6 h-6 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
                </div>
              ) : !cart?.items?.length ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5f5f3] dark:bg-[#3a3633] flex items-center justify-center">
                    <ShoppingBag size={22} className="text-[#c4bfb9]" />
                  </div>
                  <p className="text-sm text-[#8a8580] dark:text-[#7a756f]">
                    {t('cart.empty')}
                  </p>
                  <button
                    onClick={() => { setOpen(false); navigate('/Products'); }}
                    className="text-xs text-[#6d2842] dark:text-[#e8a0b4] underline underline-offset-4 hover:opacity-75 transition"
                  >
                    {t('cart.browseProducts')}
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#f0eeeb] dark:divide-[#3a3633]">
                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <motion.li
                        key={item.productId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        {/* Icon placeholder */}
                        <div className="w-9 h-9 rounded-xl bg-[#f5f5f3] dark:bg-[#3a3633] flex items-center justify-center flex-shrink-0">
                          <Package size={15} className="text-[#8a8580]" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a1816] dark:text-[#f0ece8] truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-[#8a8580] dark:text-[#7a756f]">
                            ${item.price.toFixed(2)}
                            {item.listingType === 'RENT' && (
                              <span className="ml-1 text-[#6d2842] dark:text-[#e8a0b4]">· {t('common.rent')}</span>
                            )}
                          </p>
                        </div>

                        {/* Qty + Remove */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-xs font-semibold text-[#5d5955] dark:text-[#c4bfb9] w-5 text-center">
                            ×{item.quantity}
                          </span>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            disabled={removingId === item.productId}
                            className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-colors disabled:opacity-40"
                          >
                            {removingId === item.productId
                              ? <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin block" />
                              : <Trash2 size={13} />
                            }
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer — total + checkout */}
            {itemCount > 0 && (
              <div className="px-5 py-4 border-t border-[#e8e7e5] dark:border-[#4a4642] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8a8580] dark:text-[#7a756f]">{t('cart.total')}</span>
                  <span className="text-base font-bold bg-gradient-to-r from-[#6d2842] to-[#a64d6d] bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#6d2842]/20 text-sm"
                >
                  {t('cart.checkout')}
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="relative w-14 h-14 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl shadow-xl shadow-[#6d2842]/30 flex items-center justify-center transition-all"
      >
        <ShoppingCart size={22} className="text-white" />

        {/* Item count badge */}
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#b8862f] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default CartWidget;
