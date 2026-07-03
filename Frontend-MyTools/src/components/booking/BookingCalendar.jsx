import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useKeycloak } from '../../providers/KeycloakProvider';

const today = () => new Date().toISOString().slice(0, 10);

const BookingCalendar = ({ resourceType = 'PRODUCT', resourceId, title = 'Booking calendar', quantityEnabled = true }) => {
  const { authenticated, login } = useKeycloak();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unavailable, setUnavailable] = useState([]);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!resourceId) return;
    bookingService.unavailableDates(resourceType, resourceId)
      .then((res) => setUnavailable(Array.isArray(res.data?.dates) ? res.data.dates : []))
      .catch(() => setUnavailable([]));
  }, [resourceType, resourceId]);

  useEffect(() => {
    if (!startDate || !endDate || !resourceId) { setAvailable(null); return; }
    setChecking(true);
    const id = setTimeout(() => {
      bookingService.checkAvailability({ resourceType, resourceId, startDate, endDate })
        .then((res) => setAvailable(Boolean(res.data?.available)))
        .catch(() => setAvailable(false))
        .finally(() => setChecking(false));
    }, 250);
    return () => clearTimeout(id);
  }, [resourceType, resourceId, startDate, endDate]);

  const unavailablePreview = useMemo(() => unavailable.slice(0, 8), [unavailable]);

  const createBooking = async () => {
    setMessage('');
    if (!authenticated) { login(); return; }
    if (!startDate || !endDate) { setMessage('Please select start and end dates.'); return; }
    if (available === false) { setMessage('These dates are unavailable. Choose another period.'); return; }
    setSaving(true);
    try {
      await bookingService.create({ resourceType, resourceId, startDate, endDate, quantity: Number(quantity || 1) });
      setMessage('Booking request created successfully.');
      const res = await bookingService.unavailableDates(resourceType, resourceId);
      setUnavailable(Array.isArray(res.data?.dates) ? res.data.dates : []);
    } catch (err) {
      setMessage(err?.response?.data || 'Unable to create booking.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass dark:glass-dark rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays size={18} className="text-[#6d2842]" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">Start date
          <input min={today()} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] px-3 py-2" />
        </label>
        <label className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">End date
          <input min={startDate || today()} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 w-full rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] px-3 py-2" />
        </label>
        {quantityEnabled && <label className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">Quantity
          <input min="1" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))} className="mt-1 w-full rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-white dark:bg-[#2d2a27] px-3 py-2" />
        </label>}
      </div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm">
          {checking ? <span className="text-[#8a8580]">Checking availability...</span> : available === true ? <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle size={15} /> Dates available</span> : available === false ? <span className="inline-flex items-center gap-1 text-red-600"><XCircle size={15} /> Dates unavailable</span> : <span className="text-[#8a8580]">Select dates to check availability.</span>}
        </div>
        <button onClick={createBooking} disabled={saving || checking || !resourceId} className="px-4 py-2 rounded-xl bg-[#6d2842] text-white font-semibold disabled:opacity-60">
          {saving ? 'Saving...' : 'Book'}
        </button>
      </div>
      {unavailablePreview.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8580] mb-2">Unavailable dates</p>
          <div className="flex flex-wrap gap-2">
            {unavailablePreview.map((date) => <span key={date} className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs">{date}</span>)}
            {unavailable.length > unavailablePreview.length && <span className="text-xs text-[#8a8580]">+{unavailable.length - unavailablePreview.length} more</span>}
          </div>
        </div>
      )}
      {message && <p className="text-sm text-[#6d2842] dark:text-[#e8a0b4]">{String(message)}</p>}
    </div>
  );
};

export default BookingCalendar;
