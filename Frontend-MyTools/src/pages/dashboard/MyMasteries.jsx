import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, CheckCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import interceptor from "../../interceptors/auth.interceptor";
import { masteryService } from "../../services/MasteryService";
import { useLookups } from "../../hooks/useLookups";
import {
  LOOKUP_TYPES,
  lookupLabel,
  lookupOptions,
} from "../../utils/lookupUtils";
import { useKeycloak } from "../../providers/KeycloakProvider";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  masteryTypeId: "",
  masteryStatuId: "ACTIVE",
  pricingType: "FIXED",
  masterName: "",
  masterPhone: "",
  city: "",
  experienceYears: 0,
  currencyId: "MAD",
};

const inputCls =
  "w-full px-3.5 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#1a1816] text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition text-sm";
const labelCls =
  "block text-xs font-semibold text-[#5d5955] dark:text-[#9b9791] uppercase tracking-wider mb-1.5";

const MasteryFormModal = ({ initial, lookups, onClose, onSaved }) => {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(
    isEdit
      ? {
          title: initial.title || "",
          description: initial.description || "",
          price: initial.price || "",
          masteryTypeId: initial.masteryTypeId ?? initial.typeId ?? "",
          masteryStatuId: initial.masteryStatuId || "ACTIVE",
          pricingType: initial.pricingType || "FIXED",
          masterName: initial.masterName || "",
          masterPhone: initial.masterPhone || "",
          city: initial.city || "",
          experienceYears: initial.experienceYears || 0,
        }
      : emptyForm
  );
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const typeOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.MASTERY_TYPE),
    [lookups]
  );
  const statusOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.MASTERY_STATUS),
    [lookups]
  );
  const pricingOptions = useMemo(
    () => lookupOptions(lookups, LOOKUP_TYPES.PRICING_TYPE),
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
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.masteryTypeId) return setError("Mastery type is required.");
    if (Number(form.price) < 0) return setError("Price cannot be negative.");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append(
        "mastery",
        JSON.stringify({
          ...form,
          masteryTypeId: Number(form.masteryTypeId),
          price: Number(form.price || 0),
          experienceYears: Number(form.experienceYears || 0),
        })
      );
      photos.forEach((file) => fd.append("photos", file));
      isEdit
        ? await masteryService.updateMastery(initial.id, fd)
        : await masteryService.createMastery(fd);
      onSaved();
    } catch (err) {
      setError(err?.response?.data || "Unable to save mastery.");
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
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#508978] to-[#70a596]">
              {isEdit ? (
                <Pencil size={15} className="text-white" />
              ) : (
                <Plus size={15} className="text-white" />
              )}
            </div>
            <h2 className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8]">
              {isEdit ? "Edit Mastery" : "Add New Mastery"}
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
            <label className={labelCls}>Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
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
              <label className={labelCls}>Type *</label>
              <select
                required
                value={form.masteryTypeId}
                onChange={(e) => set("masteryTypeId", e.target.value)}
                className={inputCls}>
                <option value="">Select type</option>
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={form.masteryStatuId}
                onChange={(e) => set("masteryStatuId", e.target.value)}
                className={inputCls}>
                {statusOptions.length === 0 && (
                  <option value="ACTIVE">Active</option>
                )}
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Pricing</label>
              <select
                value={form.pricingType}
                onChange={(e) => set("pricingType", e.target.value)}
                className={inputCls}>
                {pricingOptions.length === 0 && (
                  <option value="FIXED">Fixed Price</option>
                )}
                {pricingOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
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
              <label className={labelCls}>Experience years</label>
              <input
                min="0"
                type="number"
                value={form.experienceYears}
                onChange={(e) => set("experienceYears", e.target.value)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Master name</label>
              <input
                value={form.masterName}
                onChange={(e) => set("masterName", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input
                value={form.masterPhone}
                onChange={(e) => set("masterPhone", e.target.value)}
                className={inputCls}
              />
            </div>
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

const MyMasteries = () => {
  const { lookups } = useLookups();
  const { isAdmin, isStoreOwner, isCraftMan } = useKeycloak();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const canCreateNew = !isCraftMan || items.length === 0;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isAdmin) {
        // Admin can see all masteries - use the general masteries endpoint
        const res = await interceptor.get("/masterys");
        setItems(res.data || []);
      } else {
        // Store owners and craftmen can only see their own masteries
        setItems(await masteryService.getMyMasterys());
      }
    } catch (err) {
      setError(err?.response?.data || "Unable to load masteries.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const saved = () => {
    setShowForm(false);
    setEditTarget(null);
    load();
  };
  const remove = async () => {
    if (!deleteTarget) return;
    await masteryService.deleteMastery(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };
  const canManageMasteries = isAdmin || isCraftMan;

  if (!canManageMasteries) {
    return (
      <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center text-[#5d5955] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#c4bfb9]">
        <h2 className="text-xl font-semibold text-[#2d2a27] dark:text-white">
          Access restricted
        </h2>
        <p className="mt-2">Only admins and craftsmen can manage masteries.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#508978] to-[#70a596] rounded-2xl shadow-lg shadow-[#508978]/30">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-[#fafaf9]">
            My Masteries
          </h2>
          <p className="text-sm text-[#8a8580]">
            Create, edit, view and delete your service listings.
          </p>
        </div>
        {canCreateNew ? (
          <button
            onClick={() => {
              setEditTarget(null);
              setShowForm(true);
            }}
            className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold px-4 py-2 rounded-xl text-sm">
            <Plus size={15} /> Add Mastery
          </button>
        ) : (
          <div className="ml-auto rounded-2xl bg-[#f5f5f3] dark:bg-[#3a3633] text-sm text-[#5d5955] dark:text-[#c4bfb9] px-4 py-3">
            As a craftsman, you can only manage one mastery listing. Edit your
            existing mastery below.
          </div>
        )}
      </div>

      {loading ? (
        <p>Loading masteries...</p>
      ) : error ? (
        <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">
          No masteries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]">
              <div className="flex justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-bold text-[#2d2a27] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#8a8580]">
                    {lookupLabel(
                      lookups,
                      LOOKUP_TYPES.MASTERY_TYPE,
                      item.typeId ?? item.masteryTypeId,
                      "Service"
                    )}{" "}
                    ·{" "}
                    {lookupLabel(
                      lookups,
                      LOOKUP_TYPES.MASTERY_STATUS,
                      item.masteryStatuId,
                      item.masteryStatuId || "—"
                    )}{" "}
                    · {Number(item.price || 0).toFixed(2)} MAD
                  </p>
                  {isAdmin && (
                    <p className="text-sm text-[#8a8580] mt-1">
                      Master: {item.masterName || item.masterId || "Unknown"}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditTarget(item);
                      setShowForm(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-[#1a1816] text-sm inline-flex items-center gap-1">
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
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
          <MasteryFormModal
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
              <h3 className="font-bold text-lg mb-2">Delete mastery?</h3>
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

export default MyMasteries;
