import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useKeycloak } from "../../providers/KeycloakProvider";
import { roleRequestService } from "../../services/roleRequestService";

const ManageRoleRequests = () => {
  const { authenticated, isAdmin } = useKeycloak();
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [filterStatus, setFilterStatus] = useState("PENDING");

  const loadRequests = async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes] = await Promise.all([
        roleRequestService.all().catch(() => ({ data: [] })),
        roleRequestService.pending().catch(() => ({ data: [] })),
      ]);
      setRequests(Array.isArray(allRes?.data) ? allRes.data : []);
      setPendingRequests(
        Array.isArray(pendingRes?.data) ? pendingRes.data : []
      );
    } catch (err) {
      setMessage(err?.response?.data || "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && isAdmin) {
      loadRequests();
    } else {
      setLoading(false);
    }
  }, [authenticated, isAdmin]);

  const handleReview = async (id, status) => {
    setSubmitting(true);
    setMessage("");

    try {
      await roleRequestService.review(id, status, reviewComment.trim());
      setMessage(`Request ${status.toLowerCase()} successfully.`);
      setReviewComment("");
      setExpandedId(null);
      await loadRequests();
    } catch (err) {
      setMessage(
        err?.response?.data ||
          err?.message ||
          `Unable to ${status.toLowerCase()} request.`
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
            Access Denied
          </h2>
          <p className="mt-3 text-[#5d5955] dark:text-[#c4bfb9]">
            Please sign in to access this page.
          </p>
        </div>
      </motion.div>
    );
  }

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6">
        <div className="rounded-3xl border border-[#e8e7e5] bg-white p-8 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
          <h2 className="text-2xl font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
            Access Denied
          </h2>
          <p className="mt-3 text-[#5d5955] dark:text-[#c4bfb9]">
            Only admins can access this page.
          </p>
        </div>
      </motion.div>
    );
  }

  const displayedRequests =
    filterStatus === "PENDING" ? pendingRequests : requests;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6">
      <div className="rounded-3xl border border-[#e8e7e5] bg-white p-8 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
              Manage Role Requests
            </h2>
            <p className="mt-2 text-[#5d5955] dark:text-[#c4bfb9]">
              Review and approve/reject user requests to become Store Owners or
              Craftsmen.
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#6d2842] dark:text-[#d4a343]">
              {pendingRequests.length}
            </p>
            <p className="text-sm text-[#8a8580]">Pending requests</p>
          </div>
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-[#e8e7e5] bg-[#f5f5f3] px-4 py-3 text-sm text-[#2d2a27] dark:border-[#4a4642] dark:bg-[#2d2a27] dark:text-[#fafaf9]">
          {message}
        </div>
      ) : null}

      <div className="rounded-3xl border border-[#e8e7e5] bg-white p-6 shadow-lg dark:border-[#4a4642] dark:bg-[#2d2a27]">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilterStatus("PENDING")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filterStatus === "PENDING"
                ? "bg-[#6d2842] text-white"
                : "border border-[#e8e7e5] bg-[#fafaf9] text-[#2d2a27] hover:bg-[#f0f0f0] dark:border-[#4a4642] dark:bg-[#1a1816] dark:text-[#fafaf9]"
            }`}>
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filterStatus === "ALL"
                ? "bg-[#6d2842] text-white"
                : "border border-[#e8e7e5] bg-[#fafaf9] text-[#2d2a27] hover:bg-[#f0f0f0] dark:border-[#4a4642] dark:bg-[#1a1816] dark:text-[#fafaf9]"
            }`}>
            All ({requests.length})
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-[#8a8580]">Loading requests...</p>
        ) : displayedRequests.length === 0 ? (
          <p className="text-center text-sm text-[#8a8580]">
            {filterStatus === "PENDING"
              ? "No pending requests"
              : "No requests found"}
          </p>
        ) : (
          <div className="space-y-3">
            {displayedRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-[#e8e7e5] bg-[#fafaf9] dark:border-[#4a4642] dark:bg-[#1a1816]">
                <div
                  onClick={() =>
                    setExpandedId(expandedId === request.id ? null : request.id)
                  }
                  className="cursor-pointer p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-[#2d2a27] dark:text-[#fafaf9]">
                          {request.username}
                        </h4>
                        <span className="rounded-full bg-[#e8e7e5] px-3 py-1 text-xs font-medium text-[#2d2a27] dark:bg-[#4a4642] dark:text-[#fafaf9]">
                          {request.type === "STORE_OWNER"
                            ? "Store Owner"
                            : "Craftsman"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : request.status === "APPROVED"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#8a8580]">
                        Submitted:{" "}
                        {new Date(request.createdAt).toLocaleDateString()} at{" "}
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <svg
                      className={`h-5 w-5 transform text-[#8a8580] transition ${
                        expandedId === request.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>

                {expandedId === request.id && (
                  <div className="border-t border-[#e8e7e5] bg-white p-4 dark:border-[#4a4642] dark:bg-[#2d2a27]">
                    <div className="space-y-3">
                      {request.description && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-[#8a8580]">
                            Reason
                          </p>
                          <p className="mt-1 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
                            {request.description}
                          </p>
                        </div>
                      )}

                      {request.reviewComment && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-[#8a8580]">
                            Admin Comment
                          </p>
                          <p className="mt-1 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
                            {request.reviewComment}
                          </p>
                        </div>
                      )}

                      {request.status === "PENDING" && (
                        <div className="pt-3">
                          <label className="block text-xs font-semibold uppercase text-[#8a8580] mb-2">
                            Admin Comment (Optional)
                          </label>
                          <textarea
                            value={
                              expandedId === request.id ? reviewComment : ""
                            }
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows="2"
                            placeholder="Add a comment for the user (approval reason or rejection reason)..."
                            className="w-full rounded-xl border border-[#e8e7e5] bg-[#fafaf9] px-3 py-2 text-sm dark:border-[#4a4642] dark:bg-[#1a1816]"
                          />

                          <div className="mt-3 flex gap-3">
                            <button
                              onClick={() =>
                                handleReview(request.id, "APPROVED")
                              }
                              disabled={submitting}
                              className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70">
                              {submitting ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() =>
                                handleReview(request.id, "REJECTED")
                              }
                              disabled={submitting}
                              className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">
                              {submitting ? "Processing..." : "Reject"}
                            </button>
                          </div>
                        </div>
                      )}

                      {request.status !== "PENDING" && (
                        <div className="border-t border-[#e8e7e5] pt-3 dark:border-[#4a4642]">
                          <p className="text-xs font-semibold uppercase text-[#8a8580]">
                            Reviewed by: {request.reviewedBy || "Unknown"}
                          </p>
                          <p className="mt-1 text-xs text-[#8a8580]">
                            On:{" "}
                            {new Date(request.updatedAt).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(request.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageRoleRequests;
