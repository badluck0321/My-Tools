/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { BarChart3, Download, Package, ShoppingBag, Star, Wallet } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] p-5 border border-[#e8e7e5] dark:border-[#4a4642]">
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-xl bg-[#6d2842]/10 text-[#6d2842] dark:text-[#e8a0b4]"><Icon size={20} /></div>
      <div>
        <p className="text-sm text-[#8a8580]">{label}</p>
        <p className="text-2xl font-bold text-[#2d2a27] dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
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
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-2xl text-white"><BarChart3 /></div>
          <div>
            <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Analytics</h2>
            <p className="text-sm text-[#8a8580]">Revenue, orders, products and review activity</p>
          </div>
        </div>
        <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6d2842] text-white text-sm"><Download size={16} /> Export CSV</button>
      </div>

      {loading ? <p>Loading analytics...</p> : error ? (
        <div className="rounded-2xl bg-red-50 text-red-700 p-4">{error}</div>
      ) : !data ? (
        <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No analytics data yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={ShoppingBag} label="Orders" value={data.orders ?? 0} />
          <StatCard icon={Wallet} label="Revenue" value={`${Number(data.revenue || 0).toFixed(2)} MAD`} />
          <StatCard icon={Package} label="Products" value={data.products ?? 0} />
          <StatCard icon={Star} label="Reviews" value={data.reviews ?? 0} />
        </div>
      )}
    </div>
  );
};

export default Analytics;
