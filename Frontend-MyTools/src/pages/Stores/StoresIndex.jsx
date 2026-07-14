import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { storeService } from '../../services/storeService';
import { Loading } from '../../components/common';

const StoresIndex = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    storeService
      .getStores()
      .then((data) => setStores(Array.isArray(data) ? data : []))
      .catch(() => setError(t('stores.unableToLoad')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <Loading text={t('stores.loading')} />;

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816] py-12">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-[#6d2842] text-white"><Store /></div>
          <div>
            <h1 className="text-4xl font-bold text-[#2d2a27] dark:text-white">{t('stores.title')}</h1>
            <p className="text-[#8a8580]">{t('stores.subtitle')}</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-50 text-red-700 p-4">{error}</div>
        ) : stores.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642]">
            {t('stores.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const owner = Array.isArray(store.ownerId) ? store.ownerId[0] : store.ownerId;
              const target = owner ? `/stores/owner/${owner}` : `/stores/${store.id}`;
              return (
                <Link key={store.id} to={target} className="rounded-3xl bg-white dark:bg-[#2d2a27] p-6 border border-[#e8e7e5] dark:border-[#4a4642] hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#6d2842] text-white flex items-center justify-center overflow-hidden">
                      {store.logo ? <img src={store.logo} alt={store.name} className="w-full h-full object-cover" /> : <Store />}
                    </div>
                    {store.isVerified && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold"><ShieldCheck size={14} /> {t('stores.verified')}</span>}
                  </div>
                  <h2 className="text-xl font-bold text-[#2d2a27] dark:text-white">{store.name || t('stores.unnamed')}</h2>
                  <div className="mt-4 space-y-2 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
                    <p className="flex items-center gap-2"><Mail size={15} /> {store.email || t('stores.noEmail')}</p>
                    <p className="flex items-center gap-2"><MapPin size={15} /> {store.address || t('stores.noAddress')}</p>
                  </div>
                  <div className="mt-4 text-xs text-[#8a8580]">
                    {store.isActive === false ? t('stores.inactive') : t('stores.active')} · {store.isDeliveryAvailable ? t('stores.deliveryAvailable') : t('stores.noDeliveryInfo')}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresIndex;
