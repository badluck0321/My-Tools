import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle, XCircle } from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { useKeycloak } from "../../providers/KeycloakProvider";

const emptyForm = {
  resourceType: "PRODUCT",
  resourceId: "",
  startDate: "",
  endDate: "",
  quantity: 1,
};

const Bookings = () => {
  const { user, isAdmin, isStoreOwner, isCraftMan } = useKeycloak();
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = isAdmin
        ? await bookingService.adminBookings()
        : isStoreOwner || isCraftMan
        ? await bookingService.ownerBookings()
        : await bookingService.myBookings();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isAdmin, isStoreOwner, isCraftMan, user?.id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await bookingService.create({
        ...form,
        quantity: Number(form.quantity || 1),
      });
      setForm(emptyForm);
      setSuccess("Booking created successfully.");
      await load();
    } catch (err) {
      setError(err?.response?.data || "Unable to create booking.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    await bookingService.updateStatus(id, status);
    await load();
  };

  // if (!(isAdmin || isStoreOwner || isCraftMan)) {
  //   return (
  //     <div className="rounded-2xl border border-[#e8e7e5] bg-white p-6 text-center text-[#5d5955] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#c4bfb9]">
  //       <h2 className="text-xl font-semibold text-[#2d2a27] dark:text-white">Access restricted</h2>
  //       <p className="mt-2">Only admins, store owners, and craftsmen can manage bookings.</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-[#508978] to-[#70a596] rounded-2xl text-white">
          <CalendarDays />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#2d2a27] dark:text-white">
            Bookings
          </h2>
          <p className="text-sm text-[#8a8580]">
            {isAdmin
              ? "Monitor all bookings across the platform with full owner and customer details"
              : isStoreOwner || isCraftMan
              ? "See bookings for your owned listings and manage reservation status"
              : "View your bookings and manage your reservations"}
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6 rounded-2xl p-4 bg-[#f5f5f3] dark:bg-[#2d2a27]">
        <select
          value={form.resourceType}
          onChange={(e) =>
            setForm({ ...form, resourceType: e.target.value, resourceId: "" })
          }
          className="rounded-xl border p-3 bg-transparent">
          <option value="PRODUCT">Product</option>
          <option value="MASTERY">Mastery</option>
        </select>
        <input
          required
          value={form.resourceId}
          onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
          placeholder={`${
            form.resourceType === "MASTERY" ? "Mastery" : "Product"
          } ID`}
          className="rounded-xl border p-3 bg-transparent"
        />
        <input
          required
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="rounded-xl border p-3 bg-transparent"
        />
        <input
          required
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="rounded-xl border p-3 bg-transparent"
        />
        <input
          required
          min="1"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="rounded-xl border p-3 bg-transparent"
        />
        <button
          disabled={saving}
          className="rounded-xl bg-[#6d2842] text-white font-semibold disabled:opacity-60">
          {saving ? "Saving..." : "Create"}
        </button>
      </form>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3">
          {String(error)}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl bg-green-50 text-green-700 p-3">
          {success}
        </div>
      )}

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-[#f5f5f3] dark:bg-[#2d2a27] rounded-2xl">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642]">
              <div className="flex justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-[#8a8580]">
                    {b.resourceType || "PRODUCT"}
                  </span>
                  <h3 className="font-bold text-[#2d2a27] dark:text-white">
                    {b.resourceName ||
                      b.productName ||
                      b.resourceId ||
                      b.productId}
                  </h3>
                  <p className="text-sm text-[#8a8580]">
                    {b.startDate} → {b.endDate} · Qty {b.quantity}
                  </p>
                  <p className="text-sm text-[#8a8580] mt-1">
                    Booked by: {b.userName || b.userId || "Unknown"}
                  </p>
                  {(isAdmin ||
                    (user &&
                      (b.ownerId === user.id || b.userId === user.id))) && (
                    <p className="text-sm text-[#8a8580]">
                      Owner: {b.ownerName || b.ownerId || "Unknown"}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1a1816] text-xs font-bold">
                    {b.status}
                  </span>
                  <p className="mt-2 font-bold">
                    {Number(b.totalPrice || 0).toFixed(2)} MAD
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {(isAdmin || (user && b.ownerId === user.id)) && (
                  <button
                    onClick={() => updateStatus(b.id, "CONFIRMED")}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-green-600 text-white text-xs">
                    <CheckCircle size={14} /> Confirm
                  </button>
                )}
                {(isAdmin ||
                  (user && b.ownerId === user.id) ||
                  (user && b.userId === user.id)) && (
                  <button
                    onClick={() => updateStatus(b.id, "CANCELLED")}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-600 text-white text-xs">
                    <XCircle size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
