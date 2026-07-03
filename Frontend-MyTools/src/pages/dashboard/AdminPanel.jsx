import { useEffect, useState } from 'react';
import { Shield, EyeOff, ShoppingBag } from 'lucide-react';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { useKeycloak } from '../../providers/KeycloakProvider';

const AdminPanel = () => {
  const { isAdmin } = useKeycloak();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([
        productService.getProducts().catch(() => []),
        orderService.adminOrders().then((res) => res.data).catch(() => []),
      ]);
      setProducts(Array.isArray(p) ? p : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch (err) { setError(err?.response?.data || 'Unable to load admin data.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (isAdmin) load(); else setLoading(false); }, [isAdmin]);

  const hide = async (id) => { await adminService.hideProduct(id); await load(); };

  if (!isAdmin) return <div className="rounded-2xl bg-red-50 text-red-700 p-4">Admin role required.</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white"><Shield /></div><div><h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Admin Panel</h2><p className="text-sm text-[#8a8580]">Moderate products and review platform orders</p></div></div>
      {loading ? <p>Loading admin panel...</p> : error ? <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div> : <div className="space-y-8">
        <section><h3 className="font-bold text-xl mb-3 text-[#2d2a27] dark:text-white">Product moderation</h3>{products.length === 0 ? <div className="text-center py-10 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No visible products to moderate.</div> : <div className="space-y-3">{products.map((p)=><div key={p.id} className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] flex justify-between gap-3 items-center"><div><p className="font-bold">{p.name}</p><p className="text-sm text-[#8a8580]">Owner: {p.ownerId || 'unknown'} · {Number(p.price || 0).toFixed(2)} MAD</p></div><button onClick={()=>hide(p.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white text-sm"><EyeOff size={15}/> Hide</button></div>)}</div>}</section>
        <section><h3 className="font-bold text-xl mb-3 text-[#2d2a27] dark:text-white">All orders</h3>{orders.length === 0 ? <div className="text-center py-10 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No orders yet.</div> : <div className="space-y-3">{orders.map((o)=><div key={o.id} className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27]"><div className="flex justify-between gap-3"><div className="flex items-center gap-2"><ShoppingBag size={16}/><strong>{o.invoiceNumber || o.id}</strong></div><span>{o.status}</span></div><p className="text-sm text-[#8a8580] mt-1">Buyer: {o.buyerUsername || o.buyerId} · {Number(o.totalAmount || 0).toFixed(2)} MAD</p></div>)}</div>}</section>
      </div>}
    </div>
  );
};

export default AdminPanel;
