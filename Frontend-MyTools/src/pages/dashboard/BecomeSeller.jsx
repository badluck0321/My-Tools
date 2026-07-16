import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useKeycloak } from '../../providers/KeycloakProvider';
import { roleRequestService } from '../../services/roleRequestService';
import { useTranslation } from 'react-i18next';

const BecomeSeller = () => {
  const { t } = useTranslation();
  const { authenticated, login, isAdmin, isStoreOwner, isCraftMan } =
    useKeycloak();
  const [type, setType] = useState('STORE_OWNER');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const [mineRes, historyRes] = await Promise.all([
        roleRequestService.mine().catch(() => ({ data: null })),
        roleRequestService.history().catch(() => ({ data: [] })),
      ]);
      setRequest(mineRes?.data || null);
      setHistory(Array.isArray(historyRes?.data) ? historyRes.data : []);
    } catch (err) {
      setMessage(err?.response?.data || t('becomeSeller.unableToLoadRequests'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadRequests();
    } else {
      setLoading(false);
    }
  }, [authenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authenticated) {
      login();
      return;
    }

    if (isAdmin || isStoreOwner || isCraftMan) {
      setMessage(t('becomeSeller.alreadyHasRole'));
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const res = await roleRequestService.submit(type, description.trim());
      setRequest(res?.data || null);
      setDescription('');
      setMessage(
        t('becomeSeller.requestSubmitted', {
          role: type === 'STORE_OWNER' ? t('becomeSeller.storeOwner') : t('becomeSeller.craftsman'),
        })
      );
      await loadRequests();
    } catch (err) {
      setMessage(
        err?.response?.data || err?.message || t('becomeSeller.unableToSubmit')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!request?.id) return;

    if (!window.confirm(t('becomeSeller.confirmDelete'))) {
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await roleRequestService.delete(request.id);
      setRequest(null);
      setMessage(t('becomeSeller.requestDeleted'));
      await loadRequests();
    } catch (err) {
      setMessage(
        err?.response?.data || err?.message || t('becomeSeller.unableToDelete')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!authenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6">
        <div className="rounded-3xl border border-[#e8e7e5] bg-white p-8 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
          <h2 className="text-2xl font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
            {t('becomeSeller.title')}
          </h2>
          <p className="mt-3 text-[#5d5955] dark:text-[#c4bfb9]">
            {t('becomeSeller.signInRequired')}
          </p>
          <button
            onClick={() => login()}
            className="mt-5 rounded-xl bg-[#6d2842] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a1f35]">
            {t('becomeSeller.signIn')}
          </button>
        </div>
      </motion.div>
    );
  }

  if (isAdmin || isStoreOwner || isCraftMan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6">
        <div className="rounded-3xl border border-[#e8e7e5] bg-white p-8 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
          <h2 className="text-2xl font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
            {t("yourAccessIsAlreadyActive")}
          </h2>
          <p className="mt-3 text-[#5d5955] dark:text-[#c4bfb9]">
            {t("You already have an authorized role, so there is no need to submit a new request.")}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6">
      <div className="rounded-3xl border border-[#e8e7e5] bg-white p-8 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
        <h2 className="text-2xl font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
         {t("becomeSeller.title")}
        </h2>
        <p className="mt-3 text-[#5d5955] dark:text-[#c4bfb9]">
          {t("becomeSeller.description")}
        </p>
      </div>

      {message ? (
        <div className="rounded-2xl border border-[#e8e7e5] bg-[#f5f5f3] px-4 py-3 text-sm text-[#2d2a27] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#fafaf9]">
          {message}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-[#e8e7e5] bg-white p-6 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#2d2a27] dark:text-[#fafaf9]">
            {t("Request type")}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e8e7e5] bg-[#fafaf9] px-3 py-2 text-sm dark:border-[#4a4642] dark:bg-[#1a1816]">
              <option value="STORE_OWNER">Store Owner (Seller)</option>
              <option value="CRAFTSMAN">Craftsman</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-[#2d2a27] dark:text-[#fafaf9]">
            {t("Why do you want this role?")}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Tell the admin about your experience and what you plan to offer."
              className="mt-2 w-full rounded-xl border border-[#e8e7e5] bg-[#fafaf9] px-3 py-2 text-sm dark:border-[#4a4642] dark:bg-[#1a1816]"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 rounded-xl bg-[#6d2842] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a1f35] disabled:cursor-not-allowed disabled:opacity-70">
            {submitting
    ? t("becomeSeller.submitting")
    : t("becomeSeller.submit")}
        </button>
      </form>

      <div className="rounded-3xl border border-[#e8e7e5] bg-white p-6 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
        <h3 className="text-lg font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
          {t("Your request status")}
        </h3>
        {loading ? (
          <p className="mt-3 text-sm text-[#8a8580]">
            {t("Loading your previous requests...")}
          </p>
        ) : request ? (
          <div className="mt-4 space-y-3 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
            <p>
              <span className="font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
                {t("Requested role")}
              </span>{" "}
              {request.type === "STORE_OWNER" ? "Store Owner" : "Craftsman"}
            </p>
            <p>
              <span className="font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
                {t("Status:")}
              </span>{" "}
              {request.status}
            </p>
            {request.description ? (
              <p>
                <span className="font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
                  {t("Reason:")}
                </span>{" "}
                {request.description}
              </p>
            ) : null}
            {request.reviewComment && request.status !== "PENDING" ? (
              <p>
                <span className="font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
                  {t("Admin comment:")}
                </span>{" "}
                {request.reviewComment}
              </p>
            ) : null}

            {request.status === "PENDING" && (
              <div className="mt-4 pt-3 border-t border-[#e8e7e5] dark:border-[#4a4642]">
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">
                  {submitting ? "Deleting..." : "Delete Request"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#8a8580]">
            {t(" No request submitted yet.")}
          </p>
        )}

        {history.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-[#8a8580]">
              {t("History")}
            </h4>
            <ul className="mt-3 space-y-2">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-[#e8e7e5] bg-[#fafaf9] px-3 py-2 text-sm dark:border-[#4a4642] dark:bg-[#1a1816]">
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      {item.type === "STORE_OWNER"
                        ? "Store Owner"
                        : "Craftsman"}
                    </span>
                    <span className="font-medium text-[#6d2842] dark:text-[#d4a343]">
                      {item.status}
                    </span>
                  </div>
                  {item.description ? (
                    <p className="mt-1 text-[#8a8580]">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default BecomeSeller;
