import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await notificationService.list();
      setItems(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await notificationService.markAllRead();
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#b8862f] to-[#d4a343] rounded-2xl text-white"><Bell /></div>
          <div>
            <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">Notifications</h2>
            <p className="text-sm text-[#8a8580]">Order, message and listing activity</p>
          </div>
        </div>
        <button onClick={markAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6d2842] text-white text-sm"><CheckCheck size={16} /> Mark all read</button>
      </div>

      {loading ? <p>Loading notifications...</p> : items.length === 0 ? (
        <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">No notifications yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className={`p-4 rounded-2xl border ${n.read ? 'bg-[#f5f5f3] dark:bg-[#2d2a27]' : 'bg-white dark:bg-[#3a3633] border-[#6d2842]'}`}>
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#2d2a27] dark:text-white">{n.title}</h3>
                  <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">{n.message}</p>
                </div>
                <span className="text-xs text-[#8a8580]">{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
