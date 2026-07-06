/* eslint-disable no-unused-vars */
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  ShoppingBag,
  Store,
  Package,
  Settings,
  Sparkles,
  Bell,
  MessageCircle,
  BarChart3,
  CalendarDays,
  BadgeCheck,
  Shield,
  ListTree,
} from "lucide-react";
import { useKeycloak } from "../../providers/KeycloakProvider";

import Profile from "./Profile";
import MyStore from "./MyStore";
import MyProducts from "./MyProducts";
import MyFavorites from "./MyFavorites";
import MyOrders from "./MyOrders";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Analytics from "./Analytics";
import Bookings from "./Bookings";
import VendorVerification from "./VendorVerification";
import LookupAdmin from "./LookupAdmin";
import AdminPanel from "./AdminPanel";
import MyMasteries from "./MyMasteries";
import SettingsPage from "./Settings";

const DASHBOARD_TABS = [
  {
    id: "profile",
    name: "My Profile",
    icon: User,
    color: "from-[#6d2842] to-[#a64d6d]",
  },
  {
    id: "MyStore",
    name: "My Store",
    icon: Store,
    color: "from-[#b8862f] to-[#d4a343]",
    sellerOnly: true,
  },
  {
    id: "MyProducts",
    name: "My Products",
    icon: Package,
    color: "from-[#b8862f] to-[#d4a343]",
    sellerOnly: true,
  },
  {
    id: "MyMasteries",
    name: "My Masteries",
    icon: Sparkles,
    color: "from-[#508978] to-[#70a596]",
    sellerOnly: true,
  },
  {
    id: "favorites",
    name: "Favorites",
    icon: Heart,
    color: "from-[#508978] to-[#70a596]",
  },
  {
    id: "orders",
    name: "Orders",
    icon: ShoppingBag,
    color: "from-[#6d2842] to-[#b8862f]",
  },
  {
    id: "bookings",
    name: "Bookings",
    icon: CalendarDays,
    color: "from-[#508978] to-[#70a596]",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    color: "from-[#6d2842] to-[#a64d6d]",
    sellerOnly: true,
  },
  {
    id: "vendor-verification",
    name: "Vendor Verification",
    icon: BadgeCheck,
    color: "from-[#6d2842] to-[#a64d6d]",
    sellerOnly: true,
    craftOnly: true,
  },
  {
    id: "admin",
    name: "Admin Panel",
    icon: Shield,
    color: "from-[#4a4642] to-[#6d6762]",
    adminOnly: true,
  },
  {
    id: "lookups",
    name: "Lookups",
    icon: ListTree,
    color: "from-[#4a4642] to-[#6d6762]",
    adminOnly: true,
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    color: "from-[#b8862f] to-[#d4a343]",
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageCircle,
    color: "from-[#508978] to-[#70a596]",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    color: "from-[#4a4642] to-[#6d6762]",
  },
];

const Dashboard = () => {
  const { user, isAdmin, isStoreOwner, isCraftMan } = useKeycloak();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();
  const activeTab = currentPath === "dashboard" ? "profile" : currentPath;

  const visibleTabs = DASHBOARD_TABS.filter((tab) => {
    if (tab.adminOnly) return isAdmin;
    if (tab.id === "MyMasteries") return isAdmin || isCraftMan;
    if (tab.sellerOnly) return isAdmin || isStoreOwner;
    if (tab.craftOnly) return isAdmin || isCraftsMan;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#2d2a27] relative overflow-hidden py-12">
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #b8862f 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#6d2842]/5 dark:from-[#6d2842]/10 via-transparent to-[#b8862f]/5 dark:to-[#b8862f]/10" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl shadow-lg shadow-[#6d2842]/50">
              <Sparkles className="w-6 h-6 text-[#fafaf9]" />
            </div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#2d2a27] dark:from-[#fafaf9] via-[#6d2842] dark:via-[#d4a343] to-[#b8862f] bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-[#5d5955] dark:text-[#c4bfb9] text-lg">
            Welcome back,{" "}
            <span className="font-semibold text-[#6d2842] dark:text-[#d4a343]">
              {user?.first_name || user?.username || "User"}
            </span>
            !
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gradient-to-br dark:from-[#1a1816] dark:to-[#2d2a27] backdrop-blur-xl rounded-3xl p-6 sticky top-24 border border-[#e8e7e5] dark:border-[#4a4642] shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/50">
              <nav className="space-y-2">
                {visibleTabs.map((tab, index) => (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}>
                    <Link
                      to={`/dashboard/${tab.id}`}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-[#6d2842]/30`
                          : "text-[#5d5955] dark:text-[#c4bfb9] hover:bg-[#f5f5f3] dark:hover:bg-[#3a3633] hover:text-[#2d2a27] dark:hover:text-[#fafaf9] hover:shadow-md"
                      }`}>
                      <tab.icon
                        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                          activeTab === tab.id ? "text-white" : ""
                        }`}
                      />
                      <span className="font-medium">{tab.name}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gradient-to-br dark:from-[#1a1816] dark:to-[#2d2a27] backdrop-blur-xl rounded-3xl p-8 min-h-[600px] border border-[#e8e7e5] dark:border-[#4a4642] shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/50">
              <Routes>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="MyStore" element={<MyStore />} />
                <Route path="MyProducts" element={<MyProducts />} />
                <Route path="MyMasteries" element={<MyMasteries />} />
                <Route path="favorites" element={<MyFavorites />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route
                  path="vendor-verification"
                  element={<VendorVerification />}
                />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="lookups" element={<LookupAdmin />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
