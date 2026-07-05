import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Pencil,
  Plus,
  Store,
  Trash2,
  User,
  X,
} from "lucide-react";
import { productService } from "../../services/productService";
import { useLookups } from "../../hooks/useLookups";
import {
  LOOKUP_TYPES,
  listingLabel,
  lookupLabel,
  lookupOptions,
} from "../../utils/lookupUtils";
import interceptor from "../../interceptors/auth.interceptor";
import { useKeycloak } from "../../providers/KeycloakProvider";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  markId: "",
  serieNum: "",
  conditionId: "",
  listedForId: "1",
  currencyId: "MAD",
  duration: 0,
  city: "",
  isavailable: true,
};
const inputCls =
  "w-full px-3.5 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#1a1816] text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition text-sm";
const labelCls =
  "block text-xs font-semibold text-[#5d5955] dark:text-[#9b9791] uppercase tracking-wider mb-1.5";

const fetchMyStore = async () => {
  try {
    const res = await interceptor.get("/stores/mine");
    return res.status === 204 ? null : res.data;
  } catch {
    return null;
  }
};

const ProductFormModal = ({ initial, lookups, onClose, onSaved }) => {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(
    isEdit
      ? {
          name: initial.name || "",
          description: initial.description || "",
          price: initial.price || "",
          categoryId: initial.categoryId || "",
          markId: initial.markId || "",
          serieNum: initial.serieNum || "",
          conditionId: initial.conditionId || "",
          listedForId: initial.listedForId ?? "1",
          currencyId: initial.currencyId || "MAD",
          duration: initial.duration || 0,
          city: initial.city || "",
          isavailable: initial.isavailable ?? true,
        }
      : emptyForm
  );
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.CATEGORY),
    [lookups]
  );
  const markOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.MARK),
    [lookups]
  );
  const conditionOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.CONDITION),
    [lookups]
  );
  const listingOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.LISTING_TYPE),
    [lookups]
  );
  const currencyOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.CURRENCY),
    [lookups]
  );
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.categoryId) return setError("Category is required.");
    if (!form.markId) return setError("Mark is required.");
    if (Number(form.price) < 0) return setError("Price cannot be negative.");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price || 0),
        categoryId: Number(form.categoryId),
        markId: Number(form.markId),
        serieNum: Number(form.serieNum || 0),
        conditionId: Number(form.conditionId || 0),
        listedForId: Number(form.listedForId),
        duration: Number(form.duration || 0),
      };
      const fd = new FormData();
      fd.append("product", JSON.stringify(payload));
      photos.forEach((file) => fd.append("photos", file));
      isEdit
        ? await productService.updateProduct(initial.id, fd)
        : await productService.createProduct(fd);
      onSaved();
    } catch (err) {
      setError(err?.response?.data || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#2d2a27] rounded-3xl p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8e7e5] dark:border-[#4a4642]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#6d2842] to-[#a64d6d]">
              {isEdit ? (
                <Pencil size={15} className="text-white" />
              ) : (
                <Plus size={15} className="text-white" />
              )}
            </div>
            <h2 className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8]">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors text-[#8a8580]">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Price</label>
              <input
                min="0"
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select
                value={form.currencyId}
                onChange={(e) => set("currencyId", e.target.value)}
                className={inputCls}>
                {currencyOptions.length === 0 && (
                  <option value="MAD">MAD</option>
                )}
                {currencyOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Listed for</label>
              <select
                value={form.listedForId}
                onChange={(e) => set("listedForId", e.target.value)}
                className={inputCls}>
                {listingOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className={inputCls}>
                <option value="">Select category</option>
                {categoryOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Mark *</label>
              <select
                required
                value={form.markId}
                onChange={(e) => set("markId", e.target.value)}
                className={inputCls}>
                <option value="">Select mark</option>
                {markOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Condition</label>
              <select
                value={form.conditionId}
                onChange={(e) => set("conditionId", e.target.value)}
                className={inputCls}>
                <option value="">Select condition</option>
                {conditionOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Serie</label>
              <input
                type="number"
                value={form.serieNum}
                onChange={(e) => set("serieNum", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Duration</label>
              <input
                min="0"
                type="number"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isavailable"
              type="checkbox"
              checked={form.isavailable}
              onChange={() => set("isavailable", !form.isavailable)}
            />
            <label htmlFor="isavailable" className="text-sm">
              Available
            </label>
          </div>
          <div>
            <label className={labelCls}>Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(Array.from(e.target.files || []))}
              className={inputCls}
            />
          </div>
          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">
              {String(error)}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border">
              Cancel
            </button>
            <button
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#6d2842] text-white font-semibold disabled:opacity-60">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const MyProducts = () => {
  const { lookups } = useLookups();
  const { isAdmin, isStoreOwner } = useKeycloak();
  const [store, setStore] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isAdmin) {
        // Admin can see all products - use the general products endpoint
        const res = await interceptor.get("/products");
        setProducts(res.data || []);
      } else {
        // Store owners can only see their own products
        setProducts(await productService.getMyProducts());
      }
    } catch (err) {
      setError(err?.response?.data || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchMyStore().then(setStore);
  }, []);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  const saved = () => {
    setShowForm(false);
    setEditTarget(null);
    loadProducts();
  };
  const remove = async () => {
    if (!deleteTarget) return;
    await productService.deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    loadProducts();
  };
  const canManageProducts = isAdmin || isStoreOwner;

  if (!canManageProducts) {
    return (
      <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center text-[#5d5955] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#c4bfb9]">
        <h2 className="text-xl font-semibold text-[#2d2a27] dark:text-white">
          Access restricted
        </h2>
        <p className="mt-2">
          Only admins and store owners can manage products.
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#2a6d58] to-[#3d9b7e] rounded-2xl shadow-lg shadow-[#2a6d58]/30">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-[#fafaf9]">
            My Products
          </h2>
          {store !== undefined && (
            <div className="mt-1">
              {store ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#6d2842]/10 text-[#6d2842]">
                  <Store size={10} /> Listed under: {store.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0eeeb] dark:bg-[#3a3633]">
                  <User size={10} /> Listed under: Personal account
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setShowForm(true);
          }}
          className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold px-4 py-2 rounded-xl text-sm">
          <Plus size={15} /> Add Product
        </button>
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">
          No products yet.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]">
              <div className="flex justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-bold text-[#2d2a27] dark:text-white">
                    {p.name}
                  </h3>
                  <p className="text-sm text-[#8a8580]">
                    {lookupLabel(
                      lookups,
                      LOOKUP_TYPES.CATEGORY,
                      p.categoryId,
                      "—"
                    )}{" "}
                    · {lookupLabel(lookups, LOOKUP_TYPES.MARK, p.markId, "—")} ·{" "}
                    {listingLabel(lookups, p.listedForId)} ·{" "}
                    {Number(p.price || 0).toFixed(2)} {p.currencyId || "MAD"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditTarget(p);
                      setShowForm(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-[#1a1816] text-sm inline-flex items-center gap-1">
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm inline-flex items-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {showForm && (
          <ProductFormModal
            initial={editTarget}
            lookups={lookups}
            onClose={() => {
              setShowForm(false);
              setEditTarget(null);
            }}
            onSaved={saved}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-6 max-w-sm w-full">
              <h3 className="font-bold text-lg mb-2">Delete product?</h3>
              <p className="text-sm text-[#8a8580] mb-4">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-xl border">
                  Cancel
                </button>
                <button
                  onClick={remove}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white inline-flex items-center gap-1">
                  <CheckCircle size={15} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyProducts;
