import { useEffect, useState } from 'react';
import { Shield, EyeOff, ShoppingBag, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [pendingProductAction, setPendingProductAction] = useState(null);
  const [pendingOrderAction, setPendingOrderAction] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductForm, setEditingProductForm] = useState({ name: '', price: '' });
  const [savingProductId, setSavingProductId] = useState(null);

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

  useEffect(() => { setProductPage(1); }, [products.length]);
  useEffect(() => { setOrderPage(1); }, [orders.length]);

  const hide = async (id) => { await adminService.hideProduct(id); await load(); };

  const startInlineEdit = (product) => {
    setEditingProductId(product.id);
    setEditingProductForm({ name: product.name || '', price: product.price || '' });
  };

  const saveInlineEdit = async (product) => {
    try {
      setSavingProductId(product.id);
      const fd = new FormData();
      fd.append('product', JSON.stringify({ ...product, name: editingProductForm.name.trim(), price: Number(editingProductForm.price || 0) }));
      await productService.updateProduct(product.id, fd);
      setEditingProductId(null);
      await load();
    } catch (err) {
      setError(err?.response?.data || 'Unable to update product.');
    } finally {
      setSavingProductId(null);
    }
  };

  const confirmAction = async () => {
    if (!pendingProductAction) return;
    if (pendingProductAction.type === 'hide') {
      await hide(pendingProductAction.id);
    }
    setPendingProductAction(null);
  };

  const confirmOrderAction = async () => {
    if (!pendingOrderAction) return;
    try {
      await orderService.updateStatus(pendingOrderAction.id, pendingOrderAction.status);
      await load();
    } finally {
      setPendingOrderAction(null);
    }
  };

  const productPageSize = 5;
  const orderPageSize = 5;
  const visibleProducts = products.slice((productPage - 1) * productPageSize, productPage * productPageSize);
  const visibleOrders = orders.slice((orderPage - 1) * orderPageSize, orderPage * orderPageSize);

  if (!isAdmin) return <div className="rounded-2xl bg-red-50 text-red-700 p-4">Admin role required.</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white"><Shield /></div><div><h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Admin Panel</h2><p className="text-sm text-[#8a8580]">Moderate products and review platform orders</p></div></div>
      {loading ? <p>Loading admin panel...</p> : error ? <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div> : <div className="space-y-8">
        <section><h3 className="font-bold text-xl mb-3 text-[#2d2a27] dark:text-white">Product moderation</h3>{products.length === 0 ? <div className="text-center py-10 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No visible products to moderate.</div> : <div className="space-y-3">{visibleProducts.map((p)=><div key={p.id} className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]"><div className="flex justify-between gap-3 items-start"><div><p className="font-bold">{p.name}</p><p className="text-sm text-[#8a8580]">Owner: {p.ownerId || 'unknown'} · {Number(p.price || 0).toFixed(2)} MAD</p></div><div className="flex gap-2"><button onClick={()=>startInlineEdit(p)} className="p-2 rounded-xl bg-white dark:bg-[#1a1816] text-sm"><Pencil size={14}/></button><button onClick={()=>setPendingProductAction({id:p.id,type:'hide'})} className="p-2 rounded-xl bg-red-600 text-white text-sm"><EyeOff size={14}/></button></div></div>{editingProductId === p.id && <div className="mt-3 rounded-2xl border border-[#e8e7e5] bg-white/80 p-3 dark:border-[#4a4642] dark:bg-[#1a1816]/70"><div className="grid gap-3 md:grid-cols-2"><input value={editingProductForm.name} onChange={(e)=>setEditingProductForm((prev)=>({...prev,name:e.target.value}))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Product name" /><input type="number" value={editingProductForm.price} onChange={(e)=>setEditingProductForm((prev)=>({...prev,price:e.target.value}))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Price" /></div><div className="mt-3 flex justify-end gap-2"><button onClick={()=>setEditingProductId(null)} className="rounded-xl border px-3 py-2 text-sm">Cancel</button><button disabled={savingProductId===p.id} onClick={()=>saveInlineEdit(p)} className="rounded-xl bg-[#6d2842] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingProductId===p.id?'Saving...':'Save'}</button></div></div>}</div>)}</div>}{products.length > productPageSize && <div className="mt-4 flex justify-between rounded-2xl border border-[#e8e7e5] bg-white px-4 py-3 dark:border-[#4a4642] dark:bg-[#2d2a27]"><p className="text-sm text-[#8a8580]">Page {productPage} of {Math.max(1, Math.ceil(products.length / productPageSize))}</p><div className="flex gap-2"><button onClick={()=>setProductPage((p)=>Math.max(1,p-1))} disabled={productPage===1} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Prev</button><button onClick={()=>setProductPage((p)=>Math.min(Math.ceil(products.length / productPageSize),p+1))} disabled={productPage===Math.max(1, Math.ceil(products.length / productPageSize))} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Next</button></div></div>}</section>
        <section><h3 className="font-bold text-xl mb-3 text-[#2d2a27] dark:text-white">All orders</h3>{orders.length === 0 ? <div className="text-center py-10 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No orders yet.</div> : <div className="space-y-3">{visibleOrders.map((o)=><div key={o.id} className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]"><div className="flex justify-between gap-3"><div className="flex items-center gap-2"><ShoppingBag size={16}/><strong>{o.invoiceNumber || o.id}</strong></div><span>{o.status}</span></div><p className="text-sm text-[#8a8580] mt-1">Buyer: {o.buyerUsername || o.buyerId} · {Number(o.totalAmount || 0).toFixed(2)} MAD</p><div className="mt-3 flex gap-2"><button onClick={()=>setPendingOrderAction({id:o.id,status:'CONFIRMED'})} className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-sm text-white"><CheckCircle size={14}/> Confirm</button><button onClick={()=>setPendingOrderAction({id:o.id,status:'CANCELLED'})} className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-sm text-white"><XCircle size={14}/> Cancel</button></div></div>)}</div>}{orders.length > orderPageSize && <div className="mt-4 flex justify-between rounded-2xl border border-[#e8e7e5] bg-white px-4 py-3 dark:border-[#4a4642] dark:bg-[#2d2a27]"><p className="text-sm text-[#8a8580]">Page {orderPage} of {Math.max(1, Math.ceil(orders.length / orderPageSize))}</p><div className="flex gap-2"><button onClick={()=>setOrderPage((p)=>Math.max(1,p-1))} disabled={orderPage===1} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Prev</button><button onClick={()=>setOrderPage((p)=>Math.min(Math.ceil(orders.length / orderPageSize),p+1))} disabled={orderPage===Math.max(1, Math.ceil(orders.length / orderPageSize))} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Next</button></div></div>}</section>
      </div>}
      {pendingProductAction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-[#2d2a27]"><h3 className="font-bold text-lg">Confirm action</h3><p className="mt-2 text-sm text-[#8a8580]">Are you sure you want to hide this product?</p><div className="mt-4 flex justify-end gap-2"><button onClick={()=>setPendingProductAction(null)} className="rounded-xl border px-3 py-2 text-sm">Cancel</button><button onClick={confirmAction} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white">Confirm</button></div></div></div>}
      {pendingOrderAction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-[#2d2a27]"><h3 className="font-bold text-lg">Confirm action</h3><p className="mt-2 text-sm text-[#8a8580]">Are you sure you want to mark this order as {pendingOrderAction.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}?</p><div className="mt-4 flex justify-end gap-2"><button onClick={()=>setPendingOrderAction(null)} className="rounded-xl border px-3 py-2 text-sm">Cancel</button><button onClick={confirmOrderAction} className="rounded-xl bg-[#6d2842] px-3 py-2 text-sm font-semibold text-white">Confirm</button></div></div></div>}
    </div>
  );
};

export default AdminPanel;
