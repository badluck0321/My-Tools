import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Award } from "lucide-react";
import { Loading } from "../../components/common";
import { masteryService } from "../../services/MasteryService";
import MasteryCard from "../../components/common/MasteryCard";

const MasteryHistory = () => {
  const { masterId } = useParams();
  const navigate = useNavigate();
  const [masterys, setMasterys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!masterId) return;
    setLoading(true);
    masteryService
      .getMasterys(masterId)
      .then(setMasterys)
      .catch((err) => {
        console.error(err);
        setError("Failed to load mastery history.");
      })
      .finally(() => setLoading(false));
  }, [masterId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633] py-12">
      <div className="container-custom">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-[#5d5955] dark:text-[#c4bfb9] hover:text-[#6d2842] dark:hover:text-[#e8a0b4] transition-colors">
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-5xl font-display font-bold text-[#1a1816] dark:text-[#f0ece8] mt-4">
              Master History
            </h1>
            <p className="text-[#5d5955] dark:text-[#c4bfb9] mt-2">
              Review all services from this master.
            </p>
          </div>
          <div className="glass dark:glass-dark rounded-3xl p-5 flex items-center gap-3 text-[#5d5955] dark:text-[#c4bfb9]">
            <Award size={22} />
            <span>Master ID: {masterId}</span>
          </div>
        </div>

        {loading ? (
          <Loading text="Loading history..." />
        ) : error ? (
          <div className="text-center py-20 text-[#6d2842]">{error}</div>
        ) : masterys.length === 0 ? (
          <div className="glass dark:glass-dark rounded-3xl p-10 text-center text-[#5d5955] dark:text-[#c4bfb9]">
            No services found for this master yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterys.map((mastery) => (
              <MasteryCard key={mastery.id} mastery={mastery} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MasteryHistory;
