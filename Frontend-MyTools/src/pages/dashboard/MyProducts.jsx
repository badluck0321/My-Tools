/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Package, Store, User,
  X, XCircle, AlertTriangle, CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '../../providers/KeycloakProvider'; // adjust path
import interceptor from '../../interceptors/auth.interceptor'; // adjust path

/* ─── helpers ─────────────────────────────────────── */
const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
};

const fetchMyStore = async () => {
  try {
    const res = await interceptor.get('/stores/mine');
    return res.status === 204 ? null : res.data;
  } catch { return null; }
};

const fetchMyProducts = async (ownerId) => {
  const res = await interceptor.get(`/products?ownerId=${ownerId}`);
  return Array.isArray(res.data) ? res.data : [];
};

const createProduct = (payload) =>
  interceptor.post('/products', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

const updateProduct = (id, payload) =>
  interceptor.put(`/products/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

const deleteProduct = (id) => interceptor.delete(`/products/${id}`);

/* ─── Constants ───────────────────────────────────── */
const LISTED_FOR = [
  { value: 0, label: 'For Sale' },
  { value: 1, label: 'For Rent' },
  { value: 30, label: 'Both' },
];

const emptyForm = {
  name: '', description: '', price: '',
  categoryId: '', markId: '', serieNum: '',
  listedForId: 0, duration: 0, isavailable: true,
};

/* ─── Product Form Modal (Add / Edit) ─────────────── */
const ProductFormModal = ({ initial, ownerId, onClose, onSaved }) => {
  const isEdit = !!initial;

  const [form, setForm] = useState(isEdit ? {
    name:        initial.name        ?? '',
    description: initial.description ?? '',
    price:       initial.price       ?? '',
    categoryId:  initial.categoryId  ?? '',
    markId:      initial.markId      ?? '',
    serieNum:    initial.serieNum    ?? '',
    listedForId:   initial.listedForId   ?? 0,
    duration:    initial.duration    ?? 0,
    isavailable: initial.isavailable ?? true,
  } : emptyForm);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('product', JSON.stringify({ ...form, ownerId, price: Number(form.price) }));
      photos.forEach((f) => fd.append('photos', f));
      isEdit ? await updateProduct(initial.id, fd) : await createProduct(fd);
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#1a1816] text-[#1a1816] dark:text-[#f0ece8] placeholder-[#b0aba5] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition text-sm";
  const labelCls = "block text-xs font-semibold text-[#5d5955] dark:text-[#9b9791] uppercase tracking-wider mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#2d2a27] rounded-3xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8e7e5] dark:border-[#4a4642]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#6d2842] to-[#a64d6d]">
              {isEdit
                ? <Pencil size={15} className="text-white" />
                : <Plus size={15} className="text-white" />
              }
            </div>
            <h2 className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8]">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors text-[#8a8580]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Name <span className="text-[#6d2842]">*</span></label>
            <input
              required value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Cordless Drill"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3} value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe your product..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Price + Listed For */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price <span className="text-[#6d2842]">*</span></label>
              <input
                required type="number" min="0" step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Listed For</label>
              <select
                value={form.listedForId}
                onChange={(e) => set('listedForId', Number(e.target.value))}
                className={inputCls}
              >
                {LISTED_FOR.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category + Mark + Serie */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Category</label>
              <input
                type="number" value={form.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                placeholder="e.g. 8"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Mark</label>
              <input
                type="number" value={form.markId}
                onChange={(e) => set('markId', e.target.value)}
                placeholder="e.g. 19"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Serie</label>
              <input
                type="number" value={form.serieNum}
                onChange={(e) => set('serieNum', e.target.value)}
                placeholder="e.g. 1001"
                className={inputCls}
              />
            </div>
          </div>

          {/* Duration + Availability */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className={labelCls}>Duration (months)</label>
              <input
                type="number" min="0" value={form.duration}
                onChange={(e) => set('duration', Number(e.target.value))}
                placeholder="0"
                className={inputCls}
              />
            </div>
            <div className="pt-5">
              <button
                type="button"
                onClick={() => set('isavailable', !form.isavailable)}
                className="flex items-center gap-2.5"
              >
                <div className={`relative w-10 h-5 rounded-full transition-colors ${
                  form.isavailable ? 'bg-[#6d2842]' : 'bg-[#d4cfc9] dark:bg-[#4a4642]'
                }`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    form.isavailable ? 'left-5' : 'left-0.5'
                  }`} />
                </div>
                <span className="text-sm text-[#2d2a27] dark:text-[#c4bfb9]">
                  {form.isavailable ? 'Available' : 'Unavailable'}
                </span>
              </button>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Photos</label>
              <label
                htmlFor="photo-upload"
                className="cursor-pointer text-xs font-semibold text-[#6d2842] dark:text-[#e8a0b4] hover:opacity-75 transition"
              >
                + Add photos
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotos((prev) => [...prev, ...Array.from(e.target.files)])}
                className="hidden"
              />
            </div>

            {/* Thumbnail strip — existing (greyed) + new (vivid) side by side */}
            <div className="flex flex-wrap gap-1.5">

              {/* Existing photos — only in edit mode, shown greyed if new ones selected */}
              {isEdit && photos.length === 0 && initial.photoIds?.map((id, i) => (
                <div
                  key={id}
                  className="w-8 h-8 rounded-md overflow-hidden border border-[#d4cfc9] dark:border-[#4a4642] flex-shrink-0"
                  title={`Current photo ${i + 1}`}
                >
                  <img
                    src={`/products/photos/${id}`}
                    alt={`current ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ))}

              {/* New selected photos — with remove button */}
              {photos.map((file, i) => (
                <div
                  key={i}
                  className="relative w-8 h-8 rounded-md overflow-hidden border border-[#6d2842]/50 flex-shrink-0 group"
                  title={file.name}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}

              {/* Empty state */}
              {!isEdit && photos.length === 0 && (
                <label
                  htmlFor="photo-upload"
                  className="w-8 h-8 rounded-md border-2 border-dashed border-[#d4cfc9] dark:border-[#4a4642] flex items-center justify-center cursor-pointer hover:border-[#6d2842]/50 transition flex-shrink-0"
                >
                  <Plus size={12} className="text-[#b0aba5]" />
                </label>
              )}
            </div>

            {/* Replace hint in edit mode when new photos are selected */}
            {isEdit && photos.length > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠ {photos.length} new photo{photos.length > 1 ? 's' : ''} will replace the existing ones on save.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl"
            >
              <XCircle size={14} /> {error}
            </motion.p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] text-[#5d5955] dark:text-[#c4bfb9] hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : isEdit ? 'Save Changes' : 'Add Product'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─── Delete Confirm Modal ────────────────────────── */
const DeleteModal = ({ product, onClose, onConfirm, loading }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <motion.div
      initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
      className="bg-white dark:bg-[#2d2a27] rounded-3xl p-7 w-full max-w-sm shadow-2xl border border-[#e8e7e5] dark:border-[#4a4642] text-center space-y-4"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
        <AlertTriangle size={22} className="text-red-500" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-[#1a1816] dark:text-[#f0ece8]">Delete Product</h3>
        <p className="text-sm text-[#8a8580] dark:text-[#7a756f] mt-1">
          Are you sure you want to delete{' '}
          <strong className="text-[#1a1816] dark:text-[#f0ece8]">{product.name}</strong>?
          This cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] text-[#5d5955] dark:text-[#c4bfb9] hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Trash2 size={14} />
          }
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Main Component ─────────────────────────────── */
const MyProducts = () => {
  const { token } = useKeycloak();
  const navigate = useNavigate();

  const [store, setStore] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [listedFilter, setListedFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const userId = token ? parseJwt(token)?.sub : null;
  const ownerId = store?.id ?? userId;

  /* ─── Load ───────────────────────────────────── */
  const loadProducts = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      setProducts(await fetchMyProducts(ownerId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => { fetchMyStore().then(setStore); }, []);
  useEffect(() => { if (store === undefined) return; loadProducts(); }, [store, loadProducts]);

  /* ─── Delete ─────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditTarget(null);
    loadProducts();
  };

  /* ─── Filtering ──────────────────────────────── */
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && p.isavailable) ||
      (statusFilter === 'unavailable' && !p.isavailable);
    const matchListed =
      listedFilter === 'all' ||
      (listedFilter === 'sale' && p.listedForId === 0) ||
      (listedFilter === 'rent' && p.listedForId === 1) ||
      (listedFilter === 'both' && p.listedForId === 30);
    return matchSearch && matchStatus && matchListed;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  /* ─── Render ─────────────────────────────────── */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#2a6d58] to-[#3d9b7e] rounded-2xl shadow-lg shadow-[#2a6d58]/30">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-[#fafaf9]">My Products</h2>
          {store !== undefined && (
            <div className="mt-1">
              {store ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#6d2842]/10 text-[#6d2842] dark:bg-[#6d2842]/30 dark:text-[#e8a0b4]">
                  <Store size={10} /> Listed under: {store.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0eeeb] dark:bg-[#3a3633] text-[#5d5955] dark:text-[#c4bfb9]">
                  <User size={10} /> Listed under: Personal account
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#6d2842]/20 text-sm"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-sm text-[#1a1816] dark:text-[#f0ece8] placeholder-[#b0aba5] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/30 transition"
        />
        <select
          value={listedFilter}
          onChange={(e) => { setListedFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-sm text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/30 transition"
        >
          <option value="all">All Types</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="both">Both</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-sm text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/30 transition"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#f5f5f3] dark:bg-gradient-to-br dark:from-[#3a3633] dark:to-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-7 h-7 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Package size={28} className="text-[#c4bfb9] mx-auto" />
            <p className="text-sm text-[#8a8580] dark:text-[#7a756f]">No products match your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e7e5] dark:border-[#4a4642] bg-[#eeece9] dark:bg-[#2d2a27]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8580] dark:text-[#7a756f] uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8580] dark:text-[#7a756f] uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8580] dark:text-[#7a756f] uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#8a8580] dark:text-[#7a756f] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#8a8580] dark:text-[#7a756f] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e7e5] dark:divide-[#4a4642]">
                  {paginated.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="hover:bg-[#eeece9] dark:hover:bg-[#3a3633] cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3 font-medium text-[#1a1816] dark:text-[#f0ece8] group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-[#5d5955] dark:text-[#c4bfb9]">
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-[#5d5955] dark:text-[#c4bfb9]">
                        {p.listedForId === 0 && 'Sale'}
                        {p.listedForId === 1 && 'Rent'}
                        {p.listedForId === 30 && 'Both'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                          p.isavailable
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        }`}>
                          {p.isavailable
                            ? <><CheckCircle size={9} /> Available</>
                            : <><XCircle size={9} /> Unavailable</>
                          }
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()} // ← prevent row click
                      >
                        <button
                          onClick={() => { setEditTarget(p); setShowForm(true); }}
                          className="p-1.5 rounded-lg hover:bg-[#6d2842]/10 text-[#6d2842] dark:text-[#e8a0b4] transition-colors mr-1"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#e8e7e5] dark:border-[#4a4642]">
              <span className="text-xs text-[#8a8580] dark:text-[#7a756f]">
                Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 text-xs rounded-lg border border-[#d4cfc9] dark:border-[#4a4642] disabled:opacity-40 hover:bg-[#eeece9] dark:hover:bg-[#3a3633] transition text-[#5d5955] dark:text-[#c4bfb9]"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 text-xs rounded-lg border border-[#d4cfc9] dark:border-[#4a4642] disabled:opacity-40 hover:bg-[#eeece9] dark:hover:bg-[#3a3633] transition text-[#5d5955] dark:text-[#c4bfb9]"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Hovering Form */}
      <AnimatePresence>
        {showForm && (
          <ProductFormModal
            initial={editTarget}
            ownerId={ownerId}
            onClose={() => { setShowForm(false); setEditTarget(null); }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            product={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default MyProducts;