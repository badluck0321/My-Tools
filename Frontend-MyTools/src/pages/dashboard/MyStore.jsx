/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useKeycloak } from "../../providers/KeycloakProvider"; // adjust path
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Plus,
  Mail,
  Globe,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Package,
  BarChart2,
  Settings,
  Lock,
} from "lucide-react";
import { storeService } from "../../services/storeService";
import { useTranslation } from "react-i18next";

/* ─── API helpers ─────────────────────────────────── */
const fetchMyStore = async () => storeService.getMyStore();

const createStore = async (payload) => storeService.createStore(payload);

/* ─── Sub-components ──────────────────────────────── */

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="glass dark:glass-dark rounded-2xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-[#8a8580] dark:text-[#7a756f] uppercase tracking-wider">
        {label}
      </p>
      <p className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8]">
        {value}
      </p>
    </div>
  </motion.div>
);

const Badge = ({ active, verified }) => (
  <div className="flex gap-2 flex-wrap">
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
        active
          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
          : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
      }`}>
      {active ? <CheckCircle size={11} /> : <XCircle size={11} />}
      {active ? "Active" : "Inactive"}
    </span>
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
        verified
          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
          : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
      }`}>
      <Shield size={11} />
      {verified ? "Verified" : "Pending Verification"}
    </span>
  </div>
);

/* ─── Store Dashboard ─────────────────────────────── */
const StoreDashboard = ({ store }) => {
  const { t } = useTranslation();
  const createdAt = new Date(store.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8">
      {/* Store Header */}
      <div className="glass dark:glass-dark rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6d2842] to-[#a64d6d] flex items-center justify-center shadow-lg shadow-[#6d2842]/20">
              <Store size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-[#1a1816] dark:text-[#f0ece8]">
                {store.name}
              </h2>
              <p className="text-[#8a8580] dark:text-[#7a756f] flex items-center gap-1.5 mt-1">
                <Mail size={13} /> {store.email}
              </p>
            </div>
          </div>
          <Badge active={store.isActive} verified={store.isVerified} />
        </div>

        <div className="mt-6 pt-6 border-t border-[#e8e7e5] dark:border-[#3a3633] flex flex-wrap gap-6 text-sm text-[#8a8580] dark:text-[#7a756f]">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {t("myStore.memberSince", { date: createdAt })}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {store.associatsIds?.length ?? 0}{" "}
            {t("myStore.associates", {
              count: store.associatsIds?.length ?? 0,
            })}
          </span>
          {store.socialMedias?.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Globe size={13} /> {store.socialMedias.length}{" "}
              {t("myStore.socialMedia", { count: store.socialMedias.length })}
            </span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Products"
          value="—"
          color="bg-[#6d2842]"
        />
        <StatCard
          icon={BarChart2}
          label="Sales"
          value="—"
          color="bg-[#2a6d58]"
        />
        <StatCard
          icon={Users}
          label="Associates"
          value={store.associatsIds?.length ?? 0}
          color="bg-[#2a4a6d]"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Package,
            label: "Manage Products",
            desc: "Add, edit or remove listings",
            href: "/dashboard/MyProducts",
          },
          {
            icon: Settings,
            label: "Store Settings",
            desc: "Update info, social links, branding",
            href: "/store/settings",
          },
        ].map(({ icon: Icon, label, desc, href }) => (
          <motion.a
            key={label}
            href={href}
            whileHover={{ x: 4 }}
            className="glass dark:glass-dark rounded-2xl p-5 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#6d2842]/10 dark:bg-[#6d2842]/30">
                <Icon
                  size={18}
                  className="text-[#6d2842] dark:text-[#e8a0b4]"
                />
              </div>
              <div>
                <p className="font-semibold text-[#1a1816] dark:text-[#f0ece8]">
                  {label}
                </p>
                <p className="text-xs text-[#8a8580] dark:text-[#7a756f]">
                  {desc}
                </p>
              </div>
            </div>
            <ChevronRight
              size={16}
              className="text-[#8a8580] group-hover:text-[#6d2842] transition-colors"
            />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Create Store Form ───────────────────────────── */
const CreateStoreForm = ({ onCreated, userId }) => {
  const [form, setForm] = useState({ name: "", email: "", socialMedias: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        ownerId: [userId],
        isActive: true,
        isVerified: false,
        associatsIds: [],
        socialMedias: form.socialMedias
          ? form.socialMedias
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      const created = await createStore(payload);
      onCreated(created);
    } catch (err) {
      setError(
        err?.response?.data?.message ??
          "Failed to create store. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto">
      <div className="glass dark:glass-dark rounded-3xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6d2842] to-[#a64d6d] flex items-center justify-center mx-auto shadow-lg shadow-[#6d2842]/20">
            <Plus size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-[#1a1816] dark:text-[#f0ece8]">
            Create Your Store
          </h2>
          <p className="text-sm text-[#8a8580] dark:text-[#7a756f]">
            Set up your storefront and start listing your tools and services.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
              Store Name <span className="text-[#6d2842]">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Pro Tools Hub"
              className="w-full px-4 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-[#1a1816] dark:text-[#f0ece8] placeholder-[#b0aba5] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
              Store Email <span className="text-[#6d2842]">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="store@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-[#1a1816] dark:text-[#f0ece8] placeholder-[#b0aba5] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
              {t("myStore.socialMediaLinks")}
              <span className="text-[#8a8580] font-normal ml-1">
                ({t("common.optional")}, {t("common.commaSeparated")})
              </span>
            </label>
            <input
              name="socialMedias"
              value={form.socialMedias}
              onChange={handleChange}
              placeholder={t("myStore.socialMediaPlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-[#1a1816] dark:text-[#f0ece8] placeholder-[#b0aba5] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <XCircle size={14} /> {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#6d2842]/20">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            {loading ? t("common.creating") : t("myStore.createStore")}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

/* ─── Not Authenticated State ─────────────────────── */
const NotAuthenticated = ({ onLogin }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-md mx-auto text-center">
    <div className="glass dark:glass-dark rounded-3xl p-10 space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-[#f0eeeb] dark:bg-[#3a3633] flex items-center justify-center mx-auto">
        <Lock size={24} className="text-[#6d2842] dark:text-[#e8a0b4]" />
      </div>
      <div>
        <h2 className="text-2xl font-display font-bold text-[#1a1816] dark:text-[#f0ece8]">
          Authentication Required
        </h2>
        <p className="text-sm text-[#8a8580] dark:text-[#7a756f] mt-2">
          Please sign in to access your store dashboard.
        </p>
      </div>
      <button
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#6d2842]/20">
        Sign In to Continue
        <ChevronRight size={16} />
      </button>
    </div>
  </motion.div>
);

/* ─── Main Page ───────────────────────────────────── */
const MyStore = () => {
  const [store, setStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [updatingStoreId, setUpdatingStoreId] = useState(null);
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState(null);
  const [editStoreId, setEditStoreId] = useState(null);
  const [editStoreForm, setEditStoreForm] = useState({ name: "", email: "" });
  const [savingStoreId, setSavingStoreId] = useState(null);
  const { initialized, authenticated, user, login, isStoreOwner, isAdmin } =
    useKeycloak();
  const isAuthenticated = initialized && authenticated;
  const userId = user?.id;
  const canManageStore = isAdmin || isStoreOwner;

  const loadStoreData = async () => {
    if (!isAuthenticated || !userId) return;

    setLoading(true);
    try {
      if (isAdmin) {
        const allStores = await storeService.getStores();
        setStores(Array.isArray(allStores) ? allStores : []);
        setStore(null);
      } else {
        const found = await fetchMyStore();
        setStore(found);
        setStores([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  const handleStoreToggle = async (storeId, field, value) => {
    try {
      setUpdatingStoreId(storeId);
      const updated = await storeService.updateStore(storeId, {
        [field]: value,
      });
      setStores((prev) =>
        prev.map((item) => (item.id === storeId ? updated : item))
      );
      if (store?.id === storeId) {
        setStore(updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingStoreId(null);
      setPendingAction(null);
    }
  };

  const startInlineEdit = (item) => {
    setEditStoreId(item.id);
    setEditStoreForm({ name: item.name || "", email: item.email || "" });
  };

  const saveInlineEdit = async (item) => {
    try {
      setSavingStoreId(item.id);
      const updated = await storeService.updateStore(item.id, {
        name: editStoreForm.name.trim(),
        email: editStoreForm.email.trim(),
      });
      setStores((prev) =>
        prev.map((entry) => (entry.id === item.id ? updated : entry))
      );
      if (store?.id === item.id) {
        setStore(updated);
      }
      setEditStoreId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingStoreId(null);
    }
  };

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(stores.length / pageSize));
  const visibleStores = stores.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    loadStoreData();
  }, [isAuthenticated, userId, isAdmin]);

  useEffect(() => {
    setPage(1);
  }, [stores.length]);

  // Loading states
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
      </div>
    );
  }

  if (!canManageStore) {
    return (
      <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center text-[#5d5955] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#c4bfb9]">
        <h2 className="text-xl font-semibold text-[#2d2a27] dark:text-white">
          Access restricted
        </h2>
        <p className="mt-2">Only admins and store owners can manage stores.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633] py-16">
      <div className="container-custom">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">
              {isAdmin ? "Stores" : "My Store"}
            </span>
          </h1>
          <p className="text-[#5d5955] dark:text-[#c4bfb9] max-w-xl mx-auto">
            {isAdmin
              ? "Review and manage all stores across the platform from one place."
              : "Manage your storefront, products, and settings all in one place."}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Not authenticated */}
          {!isAuthenticated && (
            <motion.div key="not-auth" exit={{ opacity: 0 }}>
              <NotAuthenticated onLogin={() => login()} />
            </motion.div>
          )}

          {/* Loading store data */}
          {isAuthenticated && loading && (
            <motion.div
              key="loading"
              exit={{ opacity: 0 }}
              className="flex justify-center py-20">
              <span className="w-8 h-8 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
            </motion.div>
          )}

          {/* Admin overview of all stores */}
          {isAuthenticated && fetched && isAdmin && (
            <motion.div
              key="admin-stores"
              exit={{ opacity: 0 }}
              className="space-y-4">
              {stores.length === 0 ? (
                <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center text-[#5d5955] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#c4bfb9]">
                  No stores found.
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleStores.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#e8e7e5] bg-white p-5 shadow-sm dark:border-[#4a4642] dark:bg-[#2d2a27]">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-[#1a1816] dark:text-[#f0ece8]">
                            {item.name}
                          </h3>
                          <p className="text-sm text-[#8a8580] dark:text-[#7a756f]">
                            {item.email}
                          </p>
                          <p className="mt-2 text-sm text-[#8a8580] dark:text-[#7a756f]">
                            Owner: {item.ownerId?.join(", ") || "—"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startInlineEdit(item)}
                            className="rounded-xl border border-[#d4cfc9] px-3 py-2 text-sm font-semibold text-[#2d2a27] dark:border-[#4a4642] dark:text-[#f0ece8]">
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({
                                id: item.id,
                                type: "active",
                                value: !item.isActive,
                              })
                            }
                            disabled={updatingStoreId === item.id}
                            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                              item.isActive
                                ? "bg-amber-600 text-white"
                                : "bg-emerald-600 text-white"
                            }`}>
                            {updatingStoreId === item.id
                              ? "Updating…"
                              : item.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({
                                id: item.id,
                                type: "verified",
                                value: !item.isVerified,
                              })
                            }
                            disabled={updatingStoreId === item.id}
                            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                              item.isVerified
                                ? "bg-slate-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}>
                            {updatingStoreId === item.id
                              ? "Updating…"
                              : item.isVerified
                              ? "Unverify"
                              : "Verify"}
                          </button>
                        </div>
                      </div>
                      {editStoreId === item.id && (
                        <div className="mt-4 rounded-2xl border border-[#e8e7e5] bg-[#f8f7f5] p-3 dark:border-[#4a4642] dark:bg-[#1f1c1a]">
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              value={editStoreForm.name}
                              onChange={(e) =>
                                setEditStoreForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="rounded-xl border border-[#d4cfc9] bg-transparent px-3 py-2 text-sm"
                              placeholder="Store name"
                            />
                            <input
                              value={editStoreForm.email}
                              onChange={(e) =>
                                setEditStoreForm((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="rounded-xl border border-[#d4cfc9] bg-transparent px-3 py-2 text-sm"
                              placeholder="Store email"
                            />
                          </div>
                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              onClick={() => setEditStoreId(null)}
                              className="rounded-xl border px-3 py-2 text-sm">
                              Cancel
                            </button>
                            <button
                              disabled={savingStoreId === item.id}
                              onClick={() => saveInlineEdit(item)}
                              className="rounded-xl bg-[#6d2842] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
                              {savingStoreId === item.id ? "Saving…" : "Save"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {stores.length > pageSize && (
                    <div className="flex items-center justify-between rounded-2xl border border-[#e8e7e5] bg-white px-4 py-3 dark:border-[#4a4642] dark:bg-[#2d2a27]">
                      <p className="text-sm text-[#8a8580]">
                        Page {page} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={page === 1}
                          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">
                          Prev
                        </button>
                        <button
                          onClick={() =>
                            setPage((prev) => Math.min(totalPages, prev + 1))
                          }
                          disabled={page === totalPages}
                          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50">
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Has a store → show dashboard */}
          {isAuthenticated && fetched && !isAdmin && store && (
            <motion.div key="dashboard" exit={{ opacity: 0 }}>
              <StoreDashboard store={store} />
            </motion.div>
          )}

          {/* No store yet → show create form */}
          {isAuthenticated && fetched && !isAdmin && !store && (
            <motion.div key="create" exit={{ opacity: 0 }}>
              <CreateStoreForm
                userId={userId}
                onCreated={(newStore) => setStore(newStore)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyStore;
