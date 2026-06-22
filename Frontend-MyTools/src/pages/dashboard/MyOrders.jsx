import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/orderService';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await orderService.myOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const downloadInvoice = async (orderId) => {
    const url = await orderService.downloadInvoice(orderId);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white"><ShoppingBag /></div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">My Orders</h2>
          <p className="text-sm text-[#8a8580]">Order history, status and invoices</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
          <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No orders yet.</div>
        ) : orders.map((order) => (
          <div key={order.id} className="bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl p-5 border border-[#e8e7e5] dark:border-[#4a4642]">
            <div className="flex justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-[#2d2a27] dark:text-white">{order.invoiceNumber || order.id}</h3>
                <p className="text-sm text-[#8a8580]">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1a1816] text-xs font-bold">{order.status}</span>
                <p className="mt-2 font-bold">{Number(order.totalAmount || 0).toFixed(2)} MAD</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {(order.items || []).map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>{Number(item.lineTotal || 0).toFixed(2)} MAD</span>
                </div>
              ))}
            </div>
            <button onClick={() => downloadInvoice(order.id)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6d2842] text-white text-sm font-semibold">
              <Download size={15} /> Invoice PDF
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyOrders;
