// import { useEffect, useState } from 'react';
// import { Shield, EyeOff, ShoppingBag, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
// import { productService } from '../../services/productService';
// import { adminService } from '../../services/adminService';
// import { orderService } from '../../services/orderService';
// import { useKeycloak } from '../../providers/KeycloakProvider';

// const AdminPanel = () => {
//   const { isAdmin } = useKeycloak();
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [productPage, setProductPage] = useState(1);
//   const [orderPage, setOrderPage] = useState(1);
//   const [pendingProductAction, setPendingProductAction] = useState(null);
//   const [pendingOrderAction, setPendingOrderAction] = useState(null);
//   const [editingProductId, setEditingProductId] = useState(null);
//   const [editingProductForm, setEditingProductForm] = useState({ name: '', price: '' });
//   const [savingProductId, setSavingProductId] = useState(null);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const [p, o] = await Promise.all([
//         productService.getProducts().catch(() => []),
//         orderService.adminOrders().then((res) => res.data).catch(() => []),
//       ]);
//       setProducts(Array.isArray(p) ? p : []);
//       setOrders(Array.isArray(o) ? o : []);
//     } catch (err) { setError(err?.response?.data || 'Unable to load admin data.'); }
//     finally { setLoading(false); }
//   };
//   useEffect(() => { if (isAdmin) load(); else setLoading(false); }, [isAdmin]);

//   useEffect(() => { setProductPage(1); }, [products.length]);
//   useEffect(() => { setOrderPage(1); }, [orders.length]);

//   const hide = async (id) => { await adminService.hideProduct(id); await load(); };

//   const startInlineEdit = (product) => {
//     setEditingProductId(product.id);
//     setEditingProductForm({ name: product.name || '', price: product.price || '' });
//   };

//   const saveInlineEdit = async (product) => {
//     try {
//       setSavingProductId(product.id);
//       const fd = new FormData();
//       fd.append('product', JSON.stringify({ ...product, name: editingProductForm.name.trim(), price: Number(editingProductForm.price || 0) }));
//       await productService.updateProduct(product.id, fd);
//       setEditingProductId(null);
//       await load();
//     } catch (err) {
//       setError(err?.response?.data || 'Unable to update product.');
//     } finally {
//       setSavingProductId(null);
//     }
//   };

//   const confirmAction = async () => {
//     if (!pendingProductAction) return;
//     if (pendingProductAction.type === 'hide') {
//       await hide(pendingProductAction.id);
//     }
//     setPendingProductAction(null);
//   };

//   const confirmOrderAction = async () => {
//     if (!pendingOrderAction) return;
//     try {
//       await orderService.updateStatus(pendingOrderAction.id, pendingOrderAction.status);
//       await load();
//     } finally {
//       setPendingOrderAction(null);
//     }
//   };

//   const productPageSize = 5;
//   const orderPageSize = 5;
//   const visibleProducts = products.slice((productPage - 1) * productPageSize, productPage * productPageSize);
//   const visibleOrders = orders.slice((orderPage - 1) * orderPageSize, orderPage * orderPageSize);

//   if (!isAdmin) return <div className="rounded-2xl bg-red-50 text-red-700 p-4">Admin role required.</div>;

//   return (
//     <div>
//       <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white"><Shield /></div><div><h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Admin Panel</h2><p className="text-sm text-[#8a8580]">Moderate products and review platform orders</p></div></div>
//       {loading ? <p>Loading admin panel...</p> : error ? <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div> : <div className="space-y-8">
//         <section><h3 className="font-bold text-xl mb-3 text-[#2d2a27] dark:text-white">Product moderation</h3>{products.length === 0 ? <div className="text-center py-10 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No visible products to moderate.</div> : <div className="space-y-3">{visibleProducts.map((p)=><div key={p.id} className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]"><div className="flex justify-between gap-3 items-start"><div><p className="font-bold">{p.name}</p><p className="text-sm text-[#8a8580]">Owner: {p.ownerId || 'unknown'} · {Number(p.price || 0).toFixed(2)} MAD</p></div><div className="flex gap-2"><button onClick={()=>startInlineEdit(p)} className="p-2 rounded-xl bg-white dark:bg-[#1a1816] text-sm"><Pencil size={14}/></button><button onClick={()=>setPendingProductAction({id:p.id,type:'hide'})} className="p-2 rounded-xl bg-red-600 text-white text-sm"><EyeOff size={14}/></button></div></div>{editingProductId === p.id && <div className="mt-3 rounded-2xl border border-[#e8e7e5] bg-white/80 p-3 dark:border-[#4a4642] dark:bg-[#1a1816]/70"><div className="grid gap-3 md:grid-cols-2"><input value={editingProductForm.name} onChange={(e)=>setEditingProductForm((prev)=>({...prev,name:e.target.value}))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Product name" /><input type="number" value={editingProductForm.price} onChange={(e)=>setEditingProductForm((prev)=>({...prev,price:e.target.value}))} className="rounded-xl border px-3 py-2 text-sm" placeholder="Price" /></div><div className="mt-3 flex justify-end gap-2"><button onClick={()=>setEditingProductId(null)} className="rounded-xl border px-3 py-2 text-sm">Cancel</button><button disabled={savingProductId===p.id} onClick={()=>saveInlineEdit(p)} className="rounded-xl bg-[#6d2842] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingProductId===p.id?'Saving...':'Save'}</button></div></div>}</div>)}</div>}{products.length > productPageSize && <div className="mt-4 flex justify-between rounded-2xl border border-[#e8e7e5] bg-white px-4 py-3 dark:border-[#4a4642] dark:bg-[#2d2a27]"><p className="text-sm text-[#8a8580]">Page {productPage} of {Math.max(1, Math.ceil(products.length / productPageSize))}</p><div className="flex gap-2"><button onClick={()=>setProductPage((p)=>Math.max(1,p-1))} disabled={productPage===1} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Prev</button><button onClick={()=>setProductPage((p)=>Math.min(Math.ceil(products.length / productPageSize),p+1))} disabled={productPage===Math.max(1, Math.ceil(products.length / productPageSize))} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Next</button></div></div>}</section>
//         <section><h3 className="font-bold text-xl mb-3 text-[#2d2a27] dark:text-white">All orders</h3>{orders.length === 0 ? <div className="text-center py-10 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No orders yet.</div> : <div className="space-y-3">{visibleOrders.map((o)=><div key={o.id} className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]"><div className="flex justify-between gap-3"><div className="flex items-center gap-2"><ShoppingBag size={16}/><strong>{o.invoiceNumber || o.id}</strong></div><span>{o.status}</span></div><p className="text-sm text-[#8a8580] mt-1">Buyer: {o.buyerUsername || o.buyerId} · {Number(o.totalAmount || 0).toFixed(2)} MAD</p><div className="mt-3 flex gap-2"><button onClick={()=>setPendingOrderAction({id:o.id,status:'CONFIRMED'})} className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-sm text-white"><CheckCircle size={14}/> Confirm</button><button onClick={()=>setPendingOrderAction({id:o.id,status:'CANCELLED'})} className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-sm text-white"><XCircle size={14}/> Cancel</button></div></div>)}</div>}{orders.length > orderPageSize && <div className="mt-4 flex justify-between rounded-2xl border border-[#e8e7e5] bg-white px-4 py-3 dark:border-[#4a4642] dark:bg-[#2d2a27]"><p className="text-sm text-[#8a8580]">Page {orderPage} of {Math.max(1, Math.ceil(orders.length / orderPageSize))}</p><div className="flex gap-2"><button onClick={()=>setOrderPage((p)=>Math.max(1,p-1))} disabled={orderPage===1} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Prev</button><button onClick={()=>setOrderPage((p)=>Math.min(Math.ceil(orders.length / orderPageSize),p+1))} disabled={orderPage===Math.max(1, Math.ceil(orders.length / orderPageSize))} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">Next</button></div></div>}</section>
//       </div>}
//       {pendingProductAction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-[#2d2a27]"><h3 className="font-bold text-lg">Confirm action</h3><p className="mt-2 text-sm text-[#8a8580]">Are you sure you want to hide this product?</p><div className="mt-4 flex justify-end gap-2"><button onClick={()=>setPendingProductAction(null)} className="rounded-xl border px-3 py-2 text-sm">Cancel</button><button onClick={confirmAction} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white">Confirm</button></div></div></div>}
//       {pendingOrderAction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-[#2d2a27]"><h3 className="font-bold text-lg">Confirm action</h3><p className="mt-2 text-sm text-[#8a8580]">Are you sure you want to mark this order as {pendingOrderAction.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}?</p><div className="mt-4 flex justify-end gap-2"><button onClick={()=>setPendingOrderAction(null)} className="rounded-xl border px-3 py-2 text-sm">Cancel</button><button onClick={confirmOrderAction} className="rounded-xl bg-[#6d2842] px-3 py-2 text-sm font-semibold text-white">Confirm</button></div></div></div>}
//     </div>
//   );
// };

// export default AdminPanel;
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Shield, EyeOff, ShoppingBag, Pencil, CheckCircle, XCircle,
  BarChart3, Download, Package, Star, Wallet, Users, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { analyticsService } from '../../services/analyticsService';
import { roleRequestService } from '../../services/roleRequestService';
import { useKeycloak } from '../../providers/KeycloakProvider';

// ─── Reusable stat card ────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'from-[#6d2842] to-[#a64d6d]' }) => (
  <div className="rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] p-5 border border-[#e8e7e5] dark:border-[#4a4642]">
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-[#8a8580]">{label}</p>
        <p className="text-2xl font-bold text-[#2d2a27] dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

// ─── Reusable pagination bar ───────────────────────────────────────────────
const Pagination = ({ page, total, pageSize, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#e8e7e5] bg-white px-4 py-3 dark:border-[#4a4642] dark:bg-[#2d2a27]">
      <p className="text-sm text-[#8a8580]">
        Page <span className="font-semibold text-[#2d2a27] dark:text-white">{page}</span> of{' '}
        <span className="font-semibold text-[#2d2a27] dark:text-white">{totalPages}</span>
        &nbsp;·&nbsp;{total} items
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-40 hover:bg-[#f5f5f3] dark:hover:bg-[#3a3633] transition-colors">
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-40 hover:bg-[#f5f5f3] dark:hover:bg-[#3a3633] transition-colors">
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Status badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    PENDING:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    SHIPPED:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    DELIVERED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-[#f5f5f3] text-[#8a8580]'}`}>
      {status ?? '—'}
    </span>
  );
};

// ─── Analytics section (shared between admin + seller views) ───────────────
const AnalyticsSection = ({ isAdmin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsService.dashboard()
      .then((res) => setData(res.data || {}))
      .catch((err) => setError(err?.response?.data || 'Unable to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  const downloadCsv = async () => {
    const url = await analyticsService.downloadOrdersCsv();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl text-[#2d2a27] dark:text-white">
          {isAdmin ? 'Platform Analytics' : 'My Analytics'}
        </h3>
        <button
          onClick={downloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6d2842] text-white text-sm hover:bg-[#5a1f35] transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] p-5 border border-[#e8e7e5] dark:border-[#4a4642] animate-pulse h-24" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 text-red-700 p-4">{error}</div>
      ) : !data ? (
        <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No analytics data yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={ShoppingBag} label="Orders"   value={data.orders   ?? 0} color="from-[#6d2842] to-[#a64d6d]" />
          <StatCard icon={Wallet}      label="Revenue"  value={`${Number(data.revenue  || 0).toFixed(2)} MAD`} color="from-[#b8862f] to-[#d4a343]" />
          <StatCard icon={Package}     label="Products" value={data.products  ?? 0} color="from-[#508978] to-[#70a596]" />
          <StatCard icon={Star}        label="Reviews"  value={data.reviews   ?? 0} color="from-[#4a4642] to-[#6d6762]" />
          {isAdmin && data.users != null && (
            <StatCard icon={Users} label="Users" value={data.users} color="from-[#6d2842] to-[#b8862f]" />
          )}
        </div>
      )}
    </section>
  );
};

// ─── Main component ────────────────────────────────────────────────────────
const AdminPanel = () => {
  const { isAdmin, isStoreOwner, isCraftMan } = useKeycloak();

  const [products, setProducts]   = useState([]);
  const [orders, setOrders]       = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // pagination
  const PAGE_SIZE = 8;
  const [productPage, setProductPage] = useState(1);
  const [orderPage,   setOrderPage]   = useState(1);

  // product inline edit
  const [editingProductId,   setEditingProductId]   = useState(null);
  const [editingProductForm, setEditingProductForm] = useState({ name: '', price: '' });
  const [savingProductId,    setSavingProductId]    = useState(null);

  // confirm modals
  const [pendingProductAction, setPendingProductAction] = useState(null);
  const [pendingOrderAction,   setPendingOrderAction]   = useState(null);
  const [pendingRoleAction,    setPendingRoleAction]    = useState(null);
  const [roleComment,          setRoleComment]          = useState('');

  // ── load data ────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const [p, o, r] = await Promise.all([
        productService.getProducts().catch(() => []),
        orderService.adminOrders().then((res) => res.data).catch(() => []),
        roleRequestService.all().then((res) => res.data).catch(() => []),
      ]);
      setProducts(Array.isArray(p) ? p : []);
      setOrders(Array.isArray(o) ? o : []);
      setRoleRequests(Array.isArray(r) ? r : []);
    } catch (err) {
      setError(err?.response?.data || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) load(); else setLoading(false); }, [isAdmin]);
  useEffect(() => { setProductPage(1); }, [products.length]);
  useEffect(() => { setOrderPage(1);   }, [orders.length]);

  // ── product actions ───────────────────────────────────────────────────────
  const startInlineEdit = (product) => {
    setEditingProductId(product.id);
    setEditingProductForm({ name: product.name || '', price: product.price || '' });
  };

  const saveInlineEdit = async (product) => {
    try {
      setSavingProductId(product.id);
      const fd = new FormData();
      fd.append('product', JSON.stringify({
        ...product,
        name:  editingProductForm.name.trim(),
        price: Number(editingProductForm.price || 0),
      }));
      await productService.updateProduct(product.id, fd);
      setEditingProductId(null);
      await load();
    } catch (err) {
      setError(err?.response?.data || 'Unable to update product.');
    } finally {
      setSavingProductId(null);
    }
  };

  const confirmProductAction = async () => {
    if (!pendingProductAction) return;
    await adminService.hideProduct(pendingProductAction.id);
    setPendingProductAction(null);
    await load();
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

  const confirmRoleAction = async () => {
    if (!pendingRoleAction) return;
    try {
      await roleRequestService.review(pendingRoleAction.id, pendingRoleAction.status, roleComment);
      setPendingRoleAction(null);
      setRoleComment('');
      await load();
    } catch (err) {
      setError(err?.response?.data || 'Unable to review role request.');
    }
  };

  // ── slices for current page ───────────────────────────────────────────────
  const visibleProducts = products.slice((productPage - 1) * PAGE_SIZE, productPage * PAGE_SIZE);
  const visibleOrders   = orders.slice(  (orderPage   - 1) * PAGE_SIZE, orderPage   * PAGE_SIZE);

  // ── seller / craftsman only view ──────────────────────────────────────────
  if (!isAdmin && (isStoreOwner || isCraftMan)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white">
            <BarChart3 />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Analytics</h2>
            <p className="text-sm text-[#8a8580]">Your store performance</p>
          </div>
        </div>
        <AnalyticsSection isAdmin={false} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-2xl bg-red-50 text-red-700 p-4">
        Admin role required.
      </div>
    );
  }

  // ── admin view ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white">
          <Shield />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Admin Panel</h2>
          <p className="text-sm text-[#8a8580]">Platform analytics, product moderation and order management</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {/* ── Analytics ───────────────────────────────────────────────────── */}
      <AnalyticsSection isAdmin />

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Orders table ────────────────────────────────────────────── */}
          <section>
            <h3 className="font-bold text-xl mb-4 text-[#2d2a27] dark:text-white">
              All Orders
              <span className="ml-2 text-sm font-normal text-[#8a8580]">({orders.length} total)</span>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl text-[#8a8580]">
                No orders yet.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642]">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[#f5f5f3] dark:bg-[#2d2a27] text-left text-[#8a8580]">
                        <th className="px-4 py-3 font-semibold">Invoice</th>
                        <th className="px-4 py-3 font-semibold">Buyer</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleOrders.map((o, idx) => (
                        <tr
                          key={o.id}
                          className={`border-t border-[#e8e7e5] dark:border-[#4a4642] transition-colors hover:bg-[#f5f5f3] dark:hover:bg-[#2d2a27]/60 ${
                            idx % 2 === 0 ? '' : 'bg-[#fafaf9] dark:bg-[#1a1816]/30'
                          }`}>
                          <td className="px-4 py-3 font-mono text-xs text-[#2d2a27] dark:text-white">
                            {o.invoiceNumber || o.id?.slice(0, 8) + '…'}
                          </td>
                          <td className="px-4 py-3 text-[#5d5955] dark:text-[#c4bfb9]">
                            {o.buyerUsername || o.buyerId || '—'}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#2d2a27] dark:text-white">
                            {Number(o.totalAmount || 0).toFixed(2)} MAD
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={o.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setPendingOrderAction({ id: o.id, status: 'CONFIRMED' })}
                                className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 transition-colors">
                                <CheckCircle size={12} /> Confirm
                              </button>
                              <button
                                onClick={() => setPendingOrderAction({ id: o.id, status: 'CANCELLED' })}
                                className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 transition-colors">
                                <XCircle size={12} /> Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={orderPage}
                  total={orders.length}
                  pageSize={PAGE_SIZE}
                  onChange={setOrderPage}
                />
              </>
            )}
          </section>

          {/* ── Products moderation table ────────────────────────────────── */}
          <section>
            <h3 className="font-bold text-xl mb-4 text-[#2d2a27] dark:text-white">
              Product Moderation
              <span className="ml-2 text-sm font-normal text-[#8a8580]">({products.length} visible)</span>
            </h3>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl text-[#8a8580]">
                No visible products to moderate.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642]">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[#f5f5f3] dark:bg-[#2d2a27] text-left text-[#8a8580]">
                        <th className="px-4 py-3 font-semibold">Product</th>
                        <th className="px-4 py-3 font-semibold">Owner</th>
                        <th className="px-4 py-3 font-semibold">Price</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleProducts.map((p, idx) => (
                        <>
                          <tr
                            key={p.id}
                            className={`border-t border-[#e8e7e5] dark:border-[#4a4642] transition-colors hover:bg-[#f5f5f3] dark:hover:bg-[#2d2a27]/60 ${
                              idx % 2 === 0 ? '' : 'bg-[#fafaf9] dark:bg-[#1a1816]/30'
                            }`}>
                            <td className="px-4 py-3 font-medium text-[#2d2a27] dark:text-white">
                              {p.name}
                            </td>
                            <td className="px-4 py-3 text-[#8a8580] font-mono text-xs">
                              {p.ownerId ? p.ownerId.slice(0, 12) + '…' : '—'}
                            </td>
                            <td className="px-4 py-3 font-semibold text-[#2d2a27] dark:text-white">
                              {Number(p.price || 0).toFixed(2)} MAD
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startInlineEdit(p)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] bg-white dark:bg-[#1a1816] px-3 py-1.5 text-xs hover:bg-[#f5f5f3] dark:hover:bg-[#2d2a27] transition-colors">
                                  <Pencil size={12} /> Edit
                                </button>
                                <button
                                  onClick={() => setPendingProductAction({ id: p.id, type: 'hide' })}
                                  className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 transition-colors">
                                  <EyeOff size={12} /> Hide
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* inline edit row */}
                          {editingProductId === p.id && (
                            <tr className="border-t border-[#e8e7e5] dark:border-[#4a4642]">
                              <td colSpan={4} className="px-4 py-3 bg-[#fafaf9] dark:bg-[#1a1816]/50">
                                <div className="flex flex-wrap gap-3 items-center">
                                  <input
                                    value={editingProductForm.name}
                                    onChange={(e) => setEditingProductForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Product name"
                                    className="rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] px-3 py-2 text-sm flex-1 min-w-[160px]"
                                  />
                                  <input
                                    type="number"
                                    value={editingProductForm.price}
                                    onChange={(e) => setEditingProductForm((prev) => ({ ...prev, price: e.target.value }))}
                                    placeholder="Price"
                                    className="rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] px-3 py-2 text-sm w-32"
                                  />
                                  <button
                                    onClick={() => setEditingProductId(null)}
                                    className="rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] px-3 py-2 text-sm hover:bg-[#f5f5f3] dark:hover:bg-[#2d2a27] transition-colors">
                                    Cancel
                                  </button>
                                  <button
                                    disabled={savingProductId === p.id}
                                    onClick={() => saveInlineEdit(p)}
                                    className="rounded-xl bg-[#6d2842] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#5a1f35] transition-colors">
                                    {savingProductId === p.id ? 'Saving…' : 'Save'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={productPage}
                  total={products.length}
                  pageSize={PAGE_SIZE}
                  onChange={setProductPage}
                />
              </>
            )}
          </section>

          {/* ── Role requests (Store Owner / Craftsman) ─────────────────── */}
          <section>
            <h3 className="font-bold text-xl mb-4 text-[#2d2a27] dark:text-white">
              Role Requests
              <span className="ml-2 text-sm font-normal text-[#8a8580]">
                ({roleRequests.filter((r) => r.status === 'PENDING').length} pending)
              </span>
            </h3>

            {roleRequests.length === 0 ? (
              <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl text-[#8a8580]">
                No role requests yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642]">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-[#f5f5f3] dark:bg-[#2d2a27] text-left text-[#8a8580]">
                      <th className="px-4 py-3 font-semibold">User</th>
                      <th className="px-4 py-3 font-semibold">Requested Role</th>
                      <th className="px-4 py-3 font-semibold">Reason</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleRequests.map((r, idx) => (
                      <tr
                        key={r.id}
                        className={`border-t border-[#e8e7e5] dark:border-[#4a4642] transition-colors hover:bg-[#f5f5f3] dark:hover:bg-[#2d2a27]/60 ${
                          idx % 2 === 0 ? '' : 'bg-[#fafaf9] dark:bg-[#1a1816]/30'
                        }`}>
                        <td className="px-4 py-3 font-medium text-[#2d2a27] dark:text-white">
                          {r.username || r.userId?.slice(0, 12) + '…'}
                        </td>
                        <td className="px-4 py-3 text-[#5d5955] dark:text-[#c4bfb9]">
                          {r.type === 'STORE_OWNER' ? 'Store Owner' : 'Craftsman'}
                        </td>
                        <td className="px-4 py-3 text-[#8a8580] max-w-xs truncate" title={r.description}>
                          {r.description || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-4 py-3">
                          {r.status === 'PENDING' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setPendingRoleAction({ id: r.id, status: 'APPROVED' }); setRoleComment(''); }}
                                className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 transition-colors">
                                <CheckCircle size={12} /> Approve
                              </button>
                              <button
                                onClick={() => { setPendingRoleAction({ id: r.id, status: 'REJECTED' }); setRoleComment(''); }}
                                className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 transition-colors">
                                <XCircle size={12} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-[#8a8580]">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Confirm product hide modal ───────────────────────────────────── */}
      {pendingProductAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#2d2a27] p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-[#2d2a27] dark:text-white">Hide product?</h3>
            <p className="mt-2 text-sm text-[#8a8580]">This product will be hidden from the marketplace. You can restore it later.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPendingProductAction(null)} className="rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] px-4 py-2 text-sm hover:bg-[#f5f5f3] transition-colors">
                Cancel
              </button>
              <button onClick={confirmProductAction} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                Hide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm order action modal ───────────────────────────────────── */}
      {pendingOrderAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#2d2a27] p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-[#2d2a27] dark:text-white">Confirm action</h3>
            <p className="mt-2 text-sm text-[#8a8580]">
              Mark this order as{' '}
              <span className="font-semibold text-[#2d2a27] dark:text-white">
                {pendingOrderAction.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}
              </span>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPendingOrderAction(null)} className="rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] px-4 py-2 text-sm hover:bg-[#f5f5f3] transition-colors">
                Cancel
              </button>
              <button
                onClick={confirmOrderAction}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors ${
                  pendingOrderAction.status === 'CONFIRMED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Role request review modal ──────────────────────────────────── */}
      {pendingRoleAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#2d2a27] p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-[#2d2a27] dark:text-white">
              {pendingRoleAction.status === 'APPROVED' ? 'Approve' : 'Reject'} role request?
            </h3>
            <p className="mt-2 text-sm text-[#8a8580]">
              {pendingRoleAction.status === 'APPROVED'
                ? 'The matching Keycloak role will be assigned and the user notified.'
                : 'The user will be notified that their request was rejected.'}
            </p>
            <textarea
              value={roleComment}
              onChange={(e) => setRoleComment(e.target.value)}
              placeholder="Optional note to the user"
              className="mt-3 w-full rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] bg-white dark:bg-[#1a1816] px-3 py-2 text-sm"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPendingRoleAction(null)} className="rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] px-4 py-2 text-sm hover:bg-[#f5f5f3] transition-colors">
                Cancel
              </button>
              <button
                onClick={confirmRoleAction}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors ${
                  pendingRoleAction.status === 'APPROVED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;