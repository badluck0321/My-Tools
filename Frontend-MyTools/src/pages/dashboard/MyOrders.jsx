/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.myOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const downloadInvoice = async (orderId) => {
    setActionId(orderId);
    setError('');
    try {
      const url = await orderService.downloadInvoice(orderId);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data || 'Unable to download invoice.');
    } finally {
      setActionId('');
    }
  };

  const payOrder = async (orderId) => {
    setActionId(orderId);
    setError('');
    try {
      const checkout = await paymentService.createCheckout(orderId);
      const data = checkout.data || {};
      if (data.provider === 'mock' && data.paymentId) {
        await paymentService.confirm(data.paymentId);
        await load();
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setError('Payment checkout did not return a usable URL.');
    } catch (err) {
      setError(err?.response?.data || 'Unable to start payment.');
    } finally {
      setActionId('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white"><ShoppingBag /></div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">My Orders</h2>
          <p className="text-sm text-[#8a8580]">Order history, payment status and invoices</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3">{error}</div>}

      <div className="space-y-4">
        {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
          <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No orders yet.</div>
        ) : orders.map((order) => (
          <div key={order.id} className="bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl p-5 border border-[#e8e7e5] dark:border-[#4a4642]">
            <div className="flex justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-[#2d2a27] dark:text-white">{order.invoiceNumber || order.id}</h3>
                <p className="text-sm text-[#8a8580]">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'No date'}</p>
              </div>
              <div className="text-right space-y-2">
                <div className="flex gap-2 justify-end flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1a1816] text-xs font-bold">{order.status}</span>
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1a1816] text-xs font-bold">{order.paymentStatus || 'UNPAID'}</span>
                </div>
                <p className="font-bold">{Number(order.totalAmount || 0).toFixed(2)} MAD</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {(order.items || []).map((item) => (
                <div key={`${order.id}-${item.productId}`} className="flex justify-between text-sm">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>{Number(item.lineTotal || 0).toFixed(2)} MAD</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {order.paymentStatus !== 'PAID' && (
                <button disabled={actionId === order.id} onClick={() => payOrder(order.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#508978] text-white text-sm font-semibold disabled:opacity-60">
                  <CreditCard size={15} /> {actionId === order.id ? 'Processing...' : 'Pay'}
                </button>
              )}
              <button disabled={actionId === order.id} onClick={() => downloadInvoice(order.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6d2842] text-white text-sm font-semibold disabled:opacity-60">
                <Download size={15} /> Invoice PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyOrders;
