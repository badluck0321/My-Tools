import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, PackageCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cartService } from '../../services/cartService';
import { orderService } from '../../services/orderService';

const CartPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (err) {
      setError(err?.response?.data || t('cart.failedLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const items = cart?.items || [];
  const total = useMemo(() => items.reduce((sum, item) => {
    const days = item.listingType === 'RENT' && item.startDate && item.endDate ? Math.max(1, Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24))) : 1;
    return sum + Number(item.price || 0) * Number(item.quantity || 1) * days;
  }, 0), [items]);

  const updateQuantity = async (productId, quantity) => {
    const res = await cartService.updateQuantity(productId, quantity);
    setCart(res.data);
  };

  const removeItem = async (productId) => {
    const res = await cartService.removeItem(productId);
    setCart(res.data);
  };

  const checkout = async () => {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await orderService.checkout({ shippingAddress });
      navigate('/dashboard/orders', { state: { orderId: res.data.id } });
    } catch (err) {
      setError(err?.response?.data || t('cart.failedCheckout'));
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <div className="container-custom py-16 text-center">{t('cart.loading')}</div>;

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816] py-12">
      <div className="container-custom max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6 text-[#6d2842]">
          <ArrowLeft size={16} /> {t('common.back')}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6d2842] to-[#a64d6d] text-white"><ShoppingCart /></div>
          <div>
            <h1 className="text-3xl font-bold text-[#2d2a27] dark:text-white">{t('cart.title')}</h1>
            <p className="text-sm text-[#8a8580]">{items.length} {items.length === 1 ? t('cart.items') : t('cart.itemsPlural')}</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600">{String(error)}</div>}

        {items.length === 0 ? (
          <div className="bg-white dark:bg-[#2d2a27] rounded-3xl p-12 text-center border border-[#e8e7e5] dark:border-[#4a4642]">
            <PackageCheck className="mx-auto text-[#c4bfb9] mb-4" size={48} />
            <p className="text-[#8a8580] mb-4">{t('cart.empty')}</p>
            <Link to="/Products" className="inline-flex px-5 py-3 rounded-xl bg-[#6d2842] text-white font-semibold">{t('cart.browseProducts')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <motion.div key={`${item.productId}-${item.startDate || ''}`} layout className="bg-white dark:bg-[#2d2a27] rounded-2xl p-5 border border-[#e8e7e5] dark:border-[#4a4642] flex items-center justify-between gap-4">
                  <div>
                    <Link to={`/products/${item.productId}`} className="font-bold text-[#2d2a27] dark:text-white hover:text-[#6d2842]">
                      {item.productName}
                    </Link>
                    <p className="text-sm text-[#8a8580]">{item.listingType} · {Number(item.price).toFixed(2)} MAD</p>
                    {item.listingType === 'RENT' && <p className="text-xs text-[#8a8580]">{item.startDate} → {item.endDate}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 rounded-lg bg-[#f5f5f3] dark:bg-[#3a3633]"><Minus size={14} /></button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 rounded-lg bg-[#f5f5f3] dark:bg-[#3a3633]"><Plus size={14} /></button>
                    <button onClick={() => removeItem(item.productId)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#2d2a27] rounded-3xl p-6 border border-[#e8e7e5] dark:border-[#4a4642] h-fit space-y-4">
              <h2 className="text-xl font-bold text-[#2d2a27] dark:text-white">{t('cart.summary')}</h2>
              <div className="flex justify-between text-lg"><span>{t('cart.total')}</span><strong>{total.toFixed(2)} MAD</strong></div>
              <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} rows={3} placeholder={t('cart.shippingPlaceholder')} className="w-full rounded-xl border p-3 bg-transparent" />
              <button onClick={checkout} disabled={checkingOut} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold disabled:opacity-60">
                {checkingOut ? t('cart.creatingOrder') : t('cart.checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
