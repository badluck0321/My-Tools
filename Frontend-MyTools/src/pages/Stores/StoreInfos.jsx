import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Store,
  ShoppingBag,
  MapPin,
  Mail,
  Users,
} from "lucide-react";
import { Loading } from "../../components/common";
import { storeService } from "../../services/storeService";
import { productService } from "../../services/productService";
import ProductCard from "../../components/common/ProductCard";

const StoreInfos = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    setLoadingStore(true);
    storeService
      .getStoreByOwner(ownerId)
      .then(setStore)
      .catch((err) => {
        console.error(err);
        setError("Store not found.");
      })
      .finally(() => setLoadingStore(false));
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) return;
    setLoadingProducts(true);
    productService
      .getProductsByOwner(ownerId)
      .then((data) => setProducts(data || []))
      .catch((err) => {
        console.error(err);
        setProducts([]);
      })
      .finally(() => setLoadingProducts(false));
  }, [ownerId]);

  if (loadingStore) return <Loading text="Loading store..." />;

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#6d2842] font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm underline">
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633] py-12">
      <div className="container-custom space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-[#5d5955] dark:text-[#c4bfb9] hover:text-[#6d2842] dark:hover:text-[#e8a0b4] transition-colors mb-4">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-[#6d2842] text-white flex items-center justify-center shadow-lg shadow-[#6d2842]/20">
                <Store size={32} />
              </div>
              <div>
                <h1 className="text-5xl font-display font-bold text-[#1a1816] dark:text-[#f0ece8]">
                  {store.name}
                </h1>
                <p className="text-sm text-[#8a8580] dark:text-[#7a756f] mt-2">
                  {store.isVerified ? "Verified store" : "Unverified store"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="glass dark:glass-dark rounded-3xl p-5">
              <p className="text-xs uppercase tracking-widest text-[#8a8580] dark:text-[#7a756f]">
                Owner ID
              </p>
              <p className="mt-2 font-semibold text-[#1a1816] dark:text-[#f0ece8]">
                {store.ownerId?.join(", ")}
              </p>
            </div>
            <div className="glass dark:glass-dark rounded-3xl p-5">
              <p className="text-xs uppercase tracking-widest text-[#8a8580] dark:text-[#7a756f]">
                Total Products
              </p>
              <p className="mt-2 font-semibold text-[#1a1816] dark:text-[#f0ece8]">
                {products.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,_1fr)] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 text-[#5d5955] dark:text-[#c4bfb9]">
              <MapPin size={18} />
              <span>{store.address ?? "Address not available"}</span>
            </div>
            <div className="flex items-center gap-3 text-[#5d5955] dark:text-[#c4bfb9]">
              <Mail size={18} />
              <span>{store.email ?? "Email not available"}</span>
            </div>
            <div className="flex items-center gap-3 text-[#5d5955] dark:text-[#c4bfb9]">
              <Users size={18} />
              <span>{store.associatsIds?.length ?? 0} associates</span>
            </div>
            {store.socialMedias?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-[#8a8580] dark:text-[#7a756f]">
                  Social Media
                </p>
                {store.socialMedias.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6d2842] underline hover:text-[#8b3654]">
                    {link}
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#8a8580] dark:text-[#c4bfb9] uppercase tracking-widest">
                  Listings
                </p>
                <h2 className="text-3xl font-bold text-[#1a1816] dark:text-[#f0ece8]">
                  Products from this store
                </h2>
              </div>
              <div className="rounded-full bg-[#e8e7e5] dark:bg-[#2d2a27] px-4 py-2 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
                {loadingProducts ? "Loading..." : `${products.length} items`}
              </div>
            </div>

            {loadingProducts ? (
              <Loading text="Loading products..." />
            ) : products.length === 0 ? (
              <div className="glass dark:glass-dark rounded-3xl p-8 text-center text-[#5d5955] dark:text-[#c4bfb9]">
                No products available from this store.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfos;
