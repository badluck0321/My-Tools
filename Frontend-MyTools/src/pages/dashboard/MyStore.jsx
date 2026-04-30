// const MyStore = () => {
//     console.log("Rendering MyStore component");
//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold mb-4">My Store</h1>
//             <p>Welcome to your store dashboard! Here you can manage your products, view sales, and customize your storefront.</p>
//         </div>
//     )
// }
// export default MyStore;

import { useState, useEffect } from 'react';
import { useKeycloak } from '../../providers/KeycloakProvider'; // adjust path
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, Plus, Mail, Globe, Users, Shield,
  CheckCircle, XCircle, Clock, ChevronRight,
  Package, BarChart2, Settings, Lock,
} from 'lucide-react';
import interceptor from '../../interceptors/auth.interceptor'; // adjust to your axios interceptor path

/* ─── API helpers ─────────────────────────────────── */
const fetchMyStore = async (userId) => {
  const response = await interceptor.get(`/stores?ownerId=${userId}`);
  // backend returns an array — find the one owned by this user
  const stores = Array.isArray(response.data) ? response.data : [response.data];
  return stores.find((s) => s.ownerId?.includes(userId)) ?? null;
};

const createStore = async (payload) => {
  const response = await interceptor.post('/stores', payload);
  return response.data;
};

/* ─── Sub-components ──────────────────────────────── */

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="glass dark:glass-dark rounded-2xl p-5 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-[#8a8580] dark:text-[#7a756f] uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8]">{value}</p>
    </div>
  </motion.div>
);

const Badge = ({ active, verified }) => (
  <div className="flex gap-2 flex-wrap">
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
      active
        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
        : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
    }`}>
      {active ? <CheckCircle size={11} /> : <XCircle size={11} />}
      {active ? 'Active' : 'Inactive'}
    </span>
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
      verified
        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
        : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
    }`}>
      <Shield size={11} />
      {verified ? 'Verified' : 'Pending Verification'}
    </span>
  </div>
);

/* ─── Store Dashboard ─────────────────────────────── */
const StoreDashboard = ({ store }) => {
  const createdAt = new Date(store.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
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
            <Clock size={13} /> Member since {createdAt}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {store.associatsIds?.length ?? 0} associate{store.associatsIds?.length !== 1 ? 's' : ''}
          </span>
          {store.socialMedias?.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Globe size={13} /> {store.socialMedias.length} social link{store.socialMedias.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Package} label="Products" value="—" color="bg-[#6d2842]" />
        <StatCard icon={BarChart2} label="Sales" value="—" color="bg-[#2a6d58]" />
        <StatCard icon={Users} label="Associates" value={store.associatsIds?.length ?? 0} color="bg-[#2a4a6d]" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Package, label: 'Manage Products', desc: 'Add, edit or remove listings', href: '/products/manage' },
          { icon: Settings, label: 'Store Settings', desc: 'Update info, social links, branding', href: '/store/settings' },
        ].map(({ icon: Icon, label, desc, href }) => (
          <motion.a
            key={label}
            href={href}
            whileHover={{ x: 4 }}
            className="glass dark:glass-dark rounded-2xl p-5 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#6d2842]/10 dark:bg-[#6d2842]/30">
                <Icon size={18} className="text-[#6d2842] dark:text-[#e8a0b4]" />
              </div>
              <div>
                <p className="font-semibold text-[#1a1816] dark:text-[#f0ece8]">{label}</p>
                <p className="text-xs text-[#8a8580] dark:text-[#7a756f]">{desc}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#8a8580] group-hover:text-[#6d2842] transition-colors" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Create Store Form ───────────────────────────── */
const CreateStoreForm = ({ onCreated, userId }) => {
  const [form, setForm] = useState({ name: '', email: '', socialMedias: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
        associatsIds:[],
        socialMedias: form.socialMedias
          ? form.socialMedias.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };
      const created = await createStore(payload);
      onCreated(created);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to create store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
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
              Social Media Links
              <span className="text-[#8a8580] font-normal ml-1">(optional, comma-separated)</span>
            </label>
            <input
              name="socialMedias"
              value={form.socialMedias}
              onChange={handleChange}
              placeholder="https://instagram.com/mystore, https://facebook.com/mystore"
              className="w-full px-4 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] text-[#1a1816] dark:text-[#f0ece8] placeholder-[#b0aba5] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5"
            >
              <XCircle size={14} /> {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#6d2842]/20"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            {loading ? 'Creating…' : 'Create Store'}
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
    className="max-w-md mx-auto text-center"
  >
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
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#6d2842]/20"
      >
        Sign In to Continue
        <ChevronRight size={16} />
      </button>
    </div>
  </motion.div>
);

/* ─── Main Page ───────────────────────────────────── */
const MyStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    
//   const { keycloak, initialized } = useKeycloak();
//   const isAuthenticated = initialized && keycloak.authenticated;
//   const userId = keycloak?.tokenParsed?.sub;
const { initialized, authenticated, token, login } = useKeycloak();
    const isAuthenticated = initialized && authenticated;
    const userId = token
  ? JSON.parse(atob(token.split('.')[1]))?.sub
        : null;
    
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    setLoading(true);
    fetchMyStore(userId)
      .then((found) => setStore(found))
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setFetched(true);
      });
  }, [isAuthenticated, userId]);

  // Loading states
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
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
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">
              My Store
            </span>
          </h1>
          <p className="text-[#5d5955] dark:text-[#c4bfb9] max-w-xl mx-auto">
            Manage your storefront, products, and settings all in one place.
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
            <motion.div key="loading" exit={{ opacity: 0 }} className="flex justify-center py-20">
              <span className="w-8 h-8 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
            </motion.div>
          )}

          {/* Has a store → show dashboard */}
          {isAuthenticated && fetched && store && (
            <motion.div key="dashboard" exit={{ opacity: 0 }}>
              <StoreDashboard store={store} />
            </motion.div>
          )}

          {/* No store yet → show create form */}
          {isAuthenticated && fetched && !store && (
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