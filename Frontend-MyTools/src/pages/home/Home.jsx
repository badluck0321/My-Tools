import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Users,
  TrendingUp,
  Wrench,
  ArrowRight,
  Star,
  MessageSquare,
  HelpCircle,
  Hammer,
  Package,
  ChevronRight,
  Clock,
  ThumbsUp,
  Eye,
  CheckCircle,
  Zap,
  ShieldCheck,
  Award,
} from "lucide-react";
import interceptor from "../../interceptors/auth.interceptor"; // adjust path

/* ─── tiny helpers ───────────────────────────────── */
const getImageUrl = (url) => url; // replace with your real helper

const StarRow = ({ rating = 0, count = 0, size = 13 }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "fill-[#b8862f] text-[#b8862f]"
              : "text-[#d4cfc9] dark:text-[#4a4642]"
          }
        />
      ))}
    </div>
    {count > 0 && (
      <span className="text-xs text-[#8a8580] dark:text-[#7a756f]">
        ({count})
      </span>
    )}
  </div>
);

/* ─── Section Header ─────────────────────────────── */
const SectionHeader = ({ eyebrow, title, subtitle, cta, ctaHref }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
    <div>
      {eyebrow && (
        <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-[#6d2842] dark:text-[#e8a0b4] mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2d2a27] dark:text-[#fafaf9]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[#5d5955] dark:text-[#c4bfb9] max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
    {cta && ctaHref && (
      <Link
        to={ctaHref}
        className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#6d2842] dark:text-[#e8a0b4] hover:underline underline-offset-4 transition-all">
        {cta} <ArrowRight size={15} />
      </Link>
    )}
  </div>
);

/* ─── Product Card (compact) ─────────────────────── */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white dark:bg-[#2d2a27] rounded-2xl overflow-hidden border border-[#e8e7e5] dark:border-[#4a4642] cursor-pointer group shadow-sm hover:shadow-lg transition-all">
      <div className="aspect-[4/3] bg-[#f0eeeb] dark:bg-[#3a3633] overflow-hidden flex items-center justify-center">
        {product.photoUrls?.[0] ? (
          <img
            src={getImageUrl(product.photoUrls[0])}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Package size={32} className="text-[#c4bfb9]" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="font-semibold text-[#1a1816] dark:text-[#f0ece8] truncate text-sm group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors">
          {product.name}
        </p>
        <StarRow
          rating={product.avgRating ?? 0}
          count={product.reviewCount ?? 0}
        />
        <p className="text-base font-bold bg-gradient-to-r from-[#6d2842] to-[#a64d6d] bg-clip-text text-transparent">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Mastery Card (compact) ─────────────────────── */
const MasteryCard = ({ mastery }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/masterys/${mastery.id}`)}
      className="bg-white dark:bg-[#2d2a27] rounded-2xl overflow-hidden border border-[#e8e7e5] dark:border-[#4a4642] cursor-pointer group shadow-sm hover:shadow-lg transition-all">
      <div className="aspect-[4/3] bg-[#f0eeeb] dark:bg-[#3a3633] overflow-hidden flex items-center justify-center">
        {mastery.photoUrls ? (
          <img
            src={mastery.photoUrls[0]}
            alt={mastery.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Hammer size={32} className="text-[#c4bfb9]" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="font-semibold text-[#1a1816] dark:text-[#f0ece8] truncate text-sm group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors">
          {mastery.title}
        </p>
        <StarRow
          rating={mastery.avgRating ?? 0}
          count={mastery.reviewCount ?? 0}
        />
        <p className="text-base font-bold bg-gradient-to-r from-[#6d2842] to-[#a64d6d] bg-clip-text text-transparent">
          ${Number(mastery.price).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Q&A Card ───────────────────────────────────── */
const QACard = ({ question }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => navigate(`/forum/questions/${question.id}`)}
      className="bg-white dark:bg-[#2d2a27] rounded-2xl p-5 border border-[#e8e7e5] dark:border-[#4a4642] cursor-pointer group hover:border-[#6d2842]/40 dark:hover:border-[#6d2842]/60 transition-all shadow-sm">
      <div className="flex items-start gap-4">
        {/* vote / answer counts */}
        <div className="flex-shrink-0 flex flex-col gap-3 text-center min-w-[52px]">
          <div
            className={`rounded-xl px-2 py-1.5 text-xs font-bold ${
              question.solved
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-[#f0eeeb] dark:bg-[#3a3633] text-[#5d5955] dark:text-[#c4bfb9]"
            }`}>
            {question.solved && (
              <CheckCircle size={10} className="inline mr-0.5" />
            )}
            {question.answerCount ?? 0}
            <div className="text-[10px] font-normal">ans</div>
          </div>
          <div className="text-xs text-[#8a8580] dark:text-[#7a756f]">
            <ThumbsUp size={12} className="inline mr-0.5" />
            {question.upvotes ?? 0}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1a1816] dark:text-[#f0ece8] line-clamp-2 text-sm group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors">
            {question.title}
          </p>
          <p className="mt-1 text-xs text-[#8a8580] dark:text-[#7a756f] line-clamp-1">
            {question.body}
          </p>
          {/* tags */}
          {question.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {question.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6d2842]/8 dark:bg-[#6d2842]/20 text-[#6d2842] dark:text-[#e8a0b4]">
                  #{t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center gap-2 text-[10px] text-[#b0aba5]">
            <Eye size={10} /> {question.viewCount ?? 0} views
            <span>·</span>
            <Clock size={10} />
            {question.createdAt
              ? new Date(question.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })
              : "—"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Horizontal scroll row ──────────────────────── */
const ScrollRow = ({ children }) => (
  <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
    {children}
  </div>
);

/* ─── STAT BANNER ────────────────────────────────── */
const stats = [
  { value: "10K+", label: "Artisans & craftsmen", icon: Users },
  { value: "50K+", label: "Tools & products", icon: Package },
  { value: "5K+", label: "Mastery listings", icon: Award },
  { value: "2K+", label: "Q&A answered", icon: MessageSquare },
];

/* ═══════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();

  const [newProducts, setNewProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topMasteries, setTopMasteries] = useState([]);
  const [newMasteries, setNewMasteries] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);

  useEffect(() => {
    // ── Products: newest ──────────────────────────
    interceptor
      .get("/products?sort=newest&size=6")
      .then((r) =>
        setNewProducts(Array.isArray(r.data) ? r.data.slice(0, 6) : [])
      )
      .catch(() => {});

    // ── Products: most reviewed / recommended ─────
    interceptor
      .get("/products?sort=top&size=6")
      .then((r) =>
        setTopProducts(Array.isArray(r.data) ? r.data.slice(0, 6) : [])
      )
      .catch(() => {});

    // ── Masteries: newest ─────────────────────────
    interceptor
      .get("/masterys/specials?sort=newest&size=6")
      .then((r) =>
        setNewMasteries(Array.isArray(r.data) ? r.data.slice(0, 6) : [])
      )
      .catch(() => {});

    // ── Masteries: top rated ──────────────────────
    interceptor
      .get("/masterys/specials?sort=top&size=6")
      .then((r) =>
        setTopMasteries(Array.isArray(r.data) ? r.data.slice(0, 6) : [])
      )
      .catch(() => {});

    // ── Forum: recent questions ───────────────────
    interceptor
      .get("/forum/questions?sort=newest&size=4")
      .then((r) => setRecentQuestions(r.data?.content ?? r.data ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">
      {/* ══ HERO ════════════════════════════════════ */}
      <section
        className="relative min-h-[88vh] flex items-center overflow-hidden
        bg-gradient-to-br from-[#fafaf9] via-[#f5f0f2] to-[#ece7e5]
        dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633]">
        {/* floating blobs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#6d2842]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#b8862f]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-[#508978]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}>
              {/* badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#2d2a27]/80 backdrop-blur-sm rounded-full mb-8 shadow border border-[#e8e7e5] dark:border-[#4a4642]">
                <Hammer
                  size={14}
                  className="text-[#6d2842] dark:text-[#d4a343]"
                />
                <span className="text-sm font-medium text-[#5d5955] dark:text-[#c4bfb9]">
                  The marketplace built for real craftsmen
                </span>
              </motion.span>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-6 leading-[1.05]">
                <span className="block text-[#2d2a27] dark:text-[#fafaf9]">
                  Everything you need
                </span>
                <span className="block bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent mt-2">
                  for your next project
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#5d5955] dark:text-[#c4bfb9] mb-10 max-w-2xl mx-auto leading-relaxed">
                Buy, sell, or loan tools. Hire skilled craftsmen. Get answers
                from the community. My-Tools is the single platform for
                professionals in the trades.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/Masteries">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white font-semibold rounded-xl shadow-lg shadow-[#6d2842]/25 hover:opacity-90 transition-all min-w-[200px]">
                    <Sparkles size={17} /> Find Craftsmen
                  </motion.button>
                </Link>
                <Link to="/Products">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-[#2d2a27] border-2 border-[#6d2842] dark:border-[#d4a343] text-[#6d2842] dark:text-[#d4a343] font-semibold rounded-xl hover:bg-[#6d2842] dark:hover:bg-[#d4a343] hover:text-white dark:hover:text-[#2d2a27] transition-all min-w-[200px]">
                    <Wrench size={17} /> Browse Tools
                  </motion.button>
                </Link>
                <Link to="/forum">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-[#2d2a27] border-2 border-[#508978] text-[#508978] font-semibold rounded-xl hover:bg-[#508978] hover:text-white transition-all min-w-[200px]">
                    <HelpCircle size={17} /> Ask the Community
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#fafaf9] dark:from-[#1a1816] to-transparent pointer-events-none" />
      </section>

      {/* ══ STATS STRIP ═════════════════════════════ */}
      <section className="bg-[#6d2842] dark:bg-[#6d2842]/90 py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/70">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEW PRODUCTS ════════════════════════════ */}
      <section className="py-16 bg-[#fafaf9] dark:bg-[#1a1816]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Just listed"
            title="New Tools & Equipment"
            subtitle="Fresh listings from craftsmen in the community."
            cta="View all products"
            ctaHref="/Products"
          />
          {newProducts.length > 0 ? (
            <ScrollRow>
              {newProducts.map((p) => (
                <div
                  key={p.id}
                  className="snap-start flex-shrink-0 w-52 sm:w-60">
                  <ProductCard product={p} />
                </div>
              ))}
            </ScrollRow>
          ) : (
            <EmptySlate
              label="No products yet."
              cta="Browse all"
              href="/Products"
            />
          )}
        </div>
      </section>

      {/* ══ TOP RATED PRODUCTS ══════════════════════ */}
      <section className="py-16 bg-white dark:bg-[#2d2a27]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Community picks"
            title="Most Recommended Tools"
            subtitle="Highest-rated by professionals who've used them."
            cta="View all"
            ctaHref="/Products?sort=top"
          />
          {topProducts.length > 0 ? (
            <ScrollRow>
              {topProducts.map((p) => (
                <div
                  key={p.id}
                  className="snap-start flex-shrink-0 w-52 sm:w-60">
                  <ProductCard product={p} />
                </div>
              ))}
            </ScrollRow>
          ) : (
            <EmptySlate
              label="No top-rated products yet."
              cta="Browse all"
              href="/Products"
            />
          )}
        </div>
      </section>

      {/* ══ NEW MASTERIES ═══════════════════════════ */}
      <section className="py-16 bg-[#fafaf9] dark:bg-[#1a1816]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="New on the platform"
            title="Fresh Mastery Listings"
            subtitle="Skilled craftsmen just joined — find their expertise."
            cta="View all masteries"
            ctaHref="/Masterys"
          />
          {newMasteries.length > 0 ? (
            <ScrollRow>
              {newMasteries.map((m) => (
                <div
                  key={m.id}
                  className="snap-start flex-shrink-0 w-52 sm:w-60">
                  <MasteryCard mastery={m} />
                </div>
              ))}
            </ScrollRow>
          ) : (
            <EmptySlate
              label="No masteries yet."
              cta="Browse all"
              href="/Masterys"
            />
          )}
        </div>
      </section>

      {/* ══ TOP RATED MASTERIES ═════════════════════ */}
      <section className="py-16 bg-white dark:bg-[#2d2a27]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Proven expertise"
            title="Highest-Rated Craftsmen"
            subtitle="These professionals earned their reputation through results."
            cta="View all"
            ctaHref="/Masteries?sort=top"
          />
          {topMasteries.length > 0 ? (
            <ScrollRow>
              {topMasteries.map((m) => (
                <div
                  key={m.id}
                  className="snap-start flex-shrink-0 w-52 sm:w-60">
                  <MasteryCard mastery={m} />
                </div>
              ))}
            </ScrollRow>
          ) : (
            <EmptySlate
              label="No top masteries yet."
              cta="Browse all"
              href="/Masterys"
            />
          )}
        </div>
      </section>

      {/* ══ Q&A COMMUNITY PANEL ═════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-[#f5f0f2] to-[#ece7e5] dark:from-[#2d2a27] dark:to-[#1a1816]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* left — pitch */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6d2842] dark:text-[#e8a0b4]">
                  Handyman Q&A
                </span>
                <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-[#2d2a27] dark:text-[#fafaf9]">
                  The community knows.
                  <br />
                  Just ask.
                </h2>
                <p className="mt-3 text-[#5d5955] dark:text-[#c4bfb9]">
                  Which drill bit for ceramic tile? How do you fix a leaking
                  copper joint? What's the best waterproof sealant under €20?
                  Post your question with photos and get answers from real
                  professionals.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: MessageSquare,
                    text: "Attach photos to describe the problem",
                  },
                  {
                    icon: CheckCircle,
                    text: "Mark the best answer as accepted",
                  },
                  { icon: ThumbsUp, text: "Vote on helpful answers" },
                  { icon: Zap, text: "Get notified when someone replies" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#6d2842]/10 dark:bg-[#6d2842]/30 flex items-center justify-center flex-shrink-0">
                      <Icon
                        size={15}
                        className="text-[#6d2842] dark:text-[#e8a0b4]"
                      />
                    </div>
                    <span className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link to="/forum">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#6d2842]/20 hover:opacity-90 transition-all">
                    <HelpCircle size={15} /> Browse Questions
                  </motion.button>
                </Link>
                <Link to="/forum/ask">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#6d2842] text-[#6d2842] dark:text-[#e8a0b4] text-sm font-semibold rounded-xl hover:bg-[#6d2842] hover:text-white transition-all">
                    Ask a Question
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* right — live questions */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-[#2d2a27] dark:text-[#f0ece8]">
                  Recent Questions
                </p>
                <Link
                  to="/forum"
                  className="text-xs text-[#6d2842] dark:text-[#e8a0b4] font-semibold hover:underline flex items-center gap-1">
                  See all <ChevronRight size={13} />
                </Link>
              </div>

              {recentQuestions.length > 0
                ? recentQuestions.map((q) => <QACard key={q.id} question={q} />)
                : /* empty placeholder cards */
                  [
                    {
                      title:
                        "What drill bit do I use to go through ceramic tile without cracking it?",
                      tags: ["drill", "tile", "ceramic"],
                      upvotes: 12,
                      answerCount: 5,
                      viewCount: 89,
                      solved: true,
                    },
                    {
                      title:
                        "Best way to fix a leaking copper pipe joint without soldering?",
                      tags: ["plumbing", "copper", "leak"],
                      upvotes: 8,
                      answerCount: 3,
                      viewCount: 54,
                      solved: false,
                    },
                    {
                      title:
                        "Which angle grinder disc for cutting through rebar?",
                      tags: ["grinder", "rebar", "cutting"],
                      upvotes: 6,
                      answerCount: 7,
                      viewCount: 112,
                      solved: true,
                    },
                    {
                      title:
                        "How do I waterproof a concrete floor before tiling?",
                      tags: ["concrete", "waterproof", "tiling"],
                      upvotes: 4,
                      answerCount: 2,
                      viewCount: 38,
                      solved: false,
                    },
                  ].map((q, i) => (
                    <QACard
                      key={i}
                      question={{
                        ...q,
                        id: i,
                        createdAt: new Date().toISOString(),
                        body: "",
                      }}
                    />
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY MY-TOOLS ════════════════════════════ */}
      <section className="py-16 bg-[#fafaf9] dark:bg-[#1a1816]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-[#6d2842] dark:text-[#e8a0b4]">
              Why My-Tools
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-[#2d2a27] dark:text-[#fafaf9]">
              Built for the trades. Not for everyone.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Secure Transactions",
                desc: "Every sale and rental is protected. Payments held until delivery confirmed.",
                color: "from-[#6d2842] to-[#a64d6d]",
              },
              {
                icon: Award,
                title: "Verified Craftsmen",
                desc: "StoreOwner badges are earned, not bought. Real reviews from real jobs.",
                color: "from-[#508978] to-[#70a596]",
              },
              {
                icon: Zap,
                title: "Event-Driven Updates",
                desc: "Cart changes, new answers, order updates — get notified as they happen.",
                color: "from-[#b8862f] to-[#d4a343]",
              },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-[#2d2a27] rounded-2xl p-7 border border-[#e8e7e5] dark:border-[#4a4642] hover:shadow-lg transition-all group">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-[#1a1816] dark:text-[#f0ece8] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9] leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════ */}
      <section className="relative py-20 bg-gradient-to-br from-[#6d2842] via-[#8b3654] to-[#a64d6d] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-8 left-8 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-8 right-8 w-96 h-96 bg-[#d4a343] rounded-full blur-3xl" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Ready to get to work?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
              Join thousands of professionals buying, selling, and helping each
              other on My-Tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 bg-white text-[#6d2842] hover:bg-[#fafaf9] font-semibold rounded-xl shadow-xl transition-all min-w-[180px]">
                  Get Started Free
                </motion.button>
              </Link>
              <Link to="/forum">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 border-2 border-white text-white hover:bg-white hover:text-[#6d2842] font-semibold rounded-xl transition-all min-w-[180px]">
                  Browse the Forum
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

/* ─── tiny empty state ───────────────────────────── */
const EmptySlate = ({ label, cta, href }) => (
  <div className="text-center py-12 space-y-3">
    <p className="text-sm text-[#8a8580] dark:text-[#7a756f]">{label}</p>
    <Link
      to={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6d2842] dark:text-[#e8a0b4] hover:underline">
      {cta} <ArrowRight size={14} />
    </Link>
  </div>
);

export default Home;

// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   Sparkles,
//   Users,
//   TrendingUp,
//   Palette,
//   ArrowRight,
//   Star,
// } from "lucide-react";
// import { Button } from "../../components/common";

// const Home = () => {
//   const features = [
//     {
//       icon: Palette,
//       title: "Discover Unique Art",
//       description:
//         "Explore a curated collection of artworks from talented artists worldwide.",
//     },
//     {
//       icon: Users,
//       title: "Connect with Craftmans",
//       description:
//         "Follow your favorite artists and stay updated with their latest creations.",
//     },
//     {
//       icon: TrendingUp,
//       title: "Grow Your Collection",
//       description:
//         "Build your personal art collection and support emerging artists.",
//     },
//     {
//       icon: Sparkles,
//       title: "Seamless Experience",
//       description:
//         "Easy-to-use platform with secure transactions and fast delivery.",
//     },
//   ];

//   const featuredArtists = [
//     { id: 1, name: "Sarah Chen", specialty: "Digital Art", followers: "12.5K" },
//     {
//       id: 2,
//       name: "Marcus Rivera",
//       specialty: "Oil Painting",
//       followers: "8.2K",
//     },
//     {
//       id: 3,
//       name: "Amara Johnson",
//       specialty: "Sculpture",
//       followers: "15.1K",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633]">
//       {/* Hero Section */}
//       <section className="relative min-h-[90vh] flex items-center overflow-hidden">
//         <div className="container-custom relative z-10 py-10">
//           <div className="max-w-5xl mx-auto text-center">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}>
//               {/* Badge */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#2d2a27]/80 backdrop-blur-sm rounded-full mb-8 shadow-lg border border-[#e8e7e5] dark:border-[#4a4642]">
//                 <Sparkles className="w-4 h-4 text-[#6d2842] dark:text-[#d4a343]" />
//                 <span className="text-sm font-medium text-[#5d5955] dark:text-[#c4bfb9]">
//                   Join 10,000+ Artisans & crafters sharing their work
//                 </span>
//               </motion.div>

//               <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-tight">
//                 <span className="block text-[#2d2a27] dark:text-[#fafaf9]">
//                   All you need
//                 </span>
//                 <span className="block bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent mt-2">
//                   {" "}
//                   For Your Project
//                 </span>
//               </h1>

//               <p className="text-xl md:text-2xl lg:text-3xl text-[#5d5955] dark:text-[#c4bfb9] mb-12 max-w-3xl mx-auto font-light leading-relaxed">
//                 Loan ,Sell, Buy, Discover, collect, and help the one in Need of
//                 Advice
//               </p>

//               <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//                 <Link to="/Masteries">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] hover:from-[#5a2338] hover:via-[#6d2842] hover:to-[#8b3654] text-white font-semibold rounded-xl shadow-lg shadow-[#6d2842]/30 hover:shadow-xl hover:shadow-[#6d2842]/40 transition-all min-w-[240px]">
//                     <Sparkles className="w-5 h-5" />
//                     <span>Craftmans</span>
//                   </motion.button>
//                 </Link>
//                 <Link to="/Products">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#2d2a27] border-2 border-[#6d2842] dark:border-[#d4a343] text-[#6d2842] dark:text-[#d4a343] hover:bg-[#6d2842] dark:hover:bg-[#d4a343] hover:text-white dark:hover:text-[#2d2a27] font-semibold rounded-xl transition-all min-w-[240px]">
//                     <Palette className="w-5 h-5" />
//                     <span>Tools</span>
//                   </motion.button>
//                 </Link>
//               </div>

//               {/* Trust Indicators */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
//                 <div className="flex items-center gap-2">
//                   <div className="flex -space-x-2">
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6d2842] to-[#a64d6d] border-2 border-white dark:border-[#2d2a27]"></div>
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b8862f] to-[#d4a343] border-2 border-white dark:border-[#2d2a27]"></div>
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#508978] to-[#70a596] border-2 border-white dark:border-[#2d2a27]"></div>
//                   </div>
//                   <span className="font-medium">50K+ Artworks</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Users className="w-5 h-5 text-[#6d2842] dark:text-[#d4a343]" />
//                   <span className="font-medium">150+ Countries</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <TrendingUp className="w-5 h-5 text-[#b8862f] dark:text-[#d4a343]" />
//                   <span className="font-medium">Trending Platform</span>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//         <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#6d2842]/20 dark:bg-[#6d2842]/10 rounded-full blur-3xl animate-float"></div>
//         <div
//           className="absolute top-1/3 right-10 w-72 h-72 bg-[#b8862f]/20 dark:bg-[#b8862f]/10 rounded-full blur-3xl animate-float"
//           style={{ animationDelay: "1s" }}></div>
//         <div
//           className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#508978]/20 dark:bg-[#508978]/10 rounded-full blur-3xl animate-float"
//           style={{ animationDelay: "2s" }}></div>

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fafaf9] dark:to-[#1a1816] pointer-events-none"></div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gradient-to-b from-[#fafaf9] to-white dark:from-[#1a1816] dark:to-[#2d2a27]">
//         <div className="container-custom">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
//               <span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">
//                 Why Choose My-Tools?
//               </span>
//             </h2>
//             <p className="text-lg text-[#5d5955] dark:text-[#c4bfb9] max-w-2xl mx-auto">
//               Experience the perfect blend of creativity and technology in the
//               digital art marketplace
//             </p>
//           </motion.div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white dark:bg-[#2d2a27] border border-[#e8e7e5] dark:border-[#4a4642] rounded-3xl p-8 text-center group hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#6d2842]/10 dark:hover:shadow-[#d4a343]/10 transition-all duration-300">
//                 <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#6d2842] to-[#a64d6d] rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-[#6d2842]/30">
//                   <feature.icon className="w-10 h-10 text-white" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3 text-[#2d2a27] dark:text-[#fafaf9]">
//                   {feature.title}
//                 </h3>
//                 <p className="text-[#5d5955] dark:text-[#c4bfb9]">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Artists */}
//       <section className="py-20 bg-white dark:bg-[#2d2a27]">
//         <div className="container-custom">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
//               <span className="bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent">
//                 Featured Artists
//               </span>
//             </h2>
//             <p className="text-lg text-[#5d5955] dark:text-[#c4bfb9]">
//               Meet some of our talented creators
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {featuredArtists.map((artist, index) => (
//               <motion.div
//                 key={artist.id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}>
//                 <Link to={`/artist/${artist.id}`}>
//                   <div className="bg-white dark:bg-[#1a1816] border border-[#e8e7e5] dark:border-[#4a4642] rounded-2xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-[#6d2842]/10 dark:hover:shadow-[#d4a343]/10 transition-all duration-300">
//                     <div className="aspect-square bg-gradient-to-br from-[#6d2842] to-[#a64d6d] flex items-center justify-center text-white text-6xl font-bold">
//                       {artist.name.charAt(0)}
//                     </div>
//                     <div className="p-6">
//                       <h3 className="text-xl font-bold mb-2 text-[#2d2a27] dark:text-[#fafaf9]">
//                         {artist.name}
//                       </h3>
//                       <p className="text-[#5d5955] dark:text-[#c4bfb9] mb-3">
//                         {artist.specialty}
//                       </p>
//                       <div className="flex items-center gap-2 text-sm text-[#9b9791] dark:text-[#6d6762]">
//                         <Star className="w-4 h-4 fill-[#d4a343] text-[#d4a343]" />
//                         <span>{artist.followers} followers</span>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>

//           <div className="text-center mt-12">
//             <Link to="/artists">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 icon={ArrowRight}
//                 iconPosition="right">
//                 View All Artists
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="relative py-24 bg-gradient-to-br from-[#6d2842] via-[#8b3654] to-[#a64d6d] text-white overflow-hidden">
//         {/* Decorative elements */}
//         <div className="absolute top-0 left-0 w-full h-full opacity-20">
//           <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
//           <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#d4a343] rounded-full blur-3xl"></div>
//         </div>

//         <div className="container-custom text-center relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}>
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
//               Ready to Start Your Art Journey?
//             </h2>
//             <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-95 font-light">
//               Join thousands of art lovers and creators on My-Tools today
//             </p>
//             <div className="flex flex-col sm:flex-row gap-6 justify-center">
//               <Link to="/signup">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-4 bg-white text-[#6d2842] hover:bg-[#fafaf9] hover:shadow-2xl font-semibold rounded-xl transition-all min-w-[200px]">
//                   Get Started Free
//                 </motion.button>
//               </Link>
//               <Link to="/about">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#6d2842] font-semibold rounded-xl transition-all min-w-[200px]">
//                   Learn More
//                 </motion.button>
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // import { motion } from 'framer-motion';
// // import { Link } from 'react-router-dom';
// // import { Sparkles, Users, TrendingUp, Palette, ArrowRight, Star, Hammer, Wrench, Package, CheckCircle } from 'lucide-react';
// // import { Button } from '../../components/common';

// // const Home = () => {
// //   const features = [
// //     {
// //       icon: Hammer,
// //       title: 'Find Real Craft Mastery',
// //       description: 'Access skilled hands for woodworking, painting, sculpture, repair, and more.'
// //     },
// //     {
// //       icon: Wrench,
// //       title: 'Get Projects Done',
// //       description: 'Connect with people who can execute real physical and creative work.'
// //     },
// //     {
// //       icon: CheckCircle,
// //       title: 'Verified Practical Skill',
// //       description: 'Work with people based on proven ability, not theory or credentials.'
// //     },
// //     {
// //       icon: Sparkles,
// //       title: 'End-to-End Execution',
// //       description: 'From idea → craft → finished object, everything in one ecosystem.'
// //     }
// //   ];

// //   const secondaryFeatures = [
// //     {
// //       icon: Palette,
// //       title: 'Sell Craft & Work',
// //       description: 'Monetize handmade work, services, and creative output.'
// //     },
// //     {
// //       icon: Package,
// //       title: 'Loan Tools & Assets',
// //       description: 'Borrow or lend materials, tools, and creative resources.'
// //     },
// //     {
// //       icon: Users,
// //       title: 'Connect With Makers',
// //       description: 'Work directly with artisans, builders, and skilled creators.'
// //     }
// //   ];

// //   const featuredArtists = [
// //     { id: 1, name: 'Sarah Chen', specialty: 'Wood Craft & Design', followers: '12.5K' },
// //     { id: 2, name: 'Marcus Rivera', specialty: 'Handmade Sculpture', followers: '8.2K' },
// //     { id: 3, name: 'Amara Johnson', specialty: 'Traditional Craft Repair', followers: '15.1K' },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633]">

// //       {/* HERO */}
// //       <section className="relative min-h-[90vh] flex items-center overflow-hidden">
// //         <div className="container-custom relative z-10 py-10">
// //           <div className="max-w-5xl mx-auto text-center">

// //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

// //               <motion.div
// //                 initial={{ opacity: 0, scale: 0.9 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ delay: 0.2 }}
// //                 className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#2d2a27]/80 backdrop-blur-sm rounded-full mb-8"
// //               >
// //                 <Hammer className="w-4 h-4 text-[#6d2842]" />
// //                 <span className="text-sm font-medium text-[#5d5955] dark:text-[#c4bfb9]">
// //                   Find the mastery needed to build anything real
// //                 </span>
// //               </motion.div>

// //               <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-tight">
// //                 <span className="block text-[#2d2a27] dark:text-[#fafaf9]">
// //                   Build Anything
// //                 </span>
// //                 <span className="block bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] bg-clip-text text-transparent mt-2">
// //                   With Real Craft Mastery
// //                 </span>
// //               </h1>

// //               <p className="text-xl md:text-2xl lg:text-3xl text-[#5d5955] dark:text-[#c4bfb9] mb-12 max-w-3xl mx-auto font-light leading-relaxed">
// //                 A platform where you find the hands, skills, and craftsmanship needed to execute real-world projects — from handmade objects to repairs and custom creations.
// //               </p>

// //               <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">

// //                 <Link to="/Products">
// //                   <motion.button
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                     className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] text-white font-semibold rounded-xl min-w-[240px]"
// //                   >
// //                     <Hammer className="w-5 h-5" />
// //                     <span>Find Craft Mastery</span>
// //                   </motion.button>
// //                 </Link>

// //                 <Link to="/signup">
// //                   <motion.button
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                     className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#2d2a27] border-2 border-[#6d2842] text-[#6d2842] dark:text-[#d4a343] font-semibold rounded-xl min-w-[240px]"
// //                   >
// //                     <Users className="w-5 h-5" />
// //                     <span>Become a Maker</span>
// //                   </motion.button>
// //                 </Link>

// //               </div>

// //             </motion.div>
// //           </div>
// //         </div>

// //         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fafaf9] dark:to-[#1a1816] pointer-events-none" />
// //       </section>

// //       {/* CORE VALUE */}
// //       <section className="py-20 bg-white dark:bg-[#2d2a27]">
// //         <div className="container-custom text-center">

// //           <h2 className="text-4xl md:text-5xl font-bold mb-4">
// //             What This Platform Actually Does
// //           </h2>

// //           <p className="text-lg text-[#5d5955] dark:text-[#c4bfb9] mb-12 max-w-3xl mx-auto">
// //             It connects real-world problems with real-world hands that can solve them.
// //           </p>

// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
// //             {features.map((item, index) => (
// //               <motion.div
// //                 key={index}
// //                 initial={{ opacity: 0, y: 20 }}
// //                 whileInView={{ opacity: 1, y: 0 }}
// //                 viewport={{ once: true }}
// //                 className="p-8 rounded-2xl border bg-[#fafaf9] dark:bg-[#1a1816]"
// //               >
// //                 <item.icon className="w-10 h-10 mb-4 text-[#6d2842]" />
// //                 <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
// //                 <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9]">{item.description}</p>
// //               </motion.div>
// //             ))}
// //           </div>

// //         </div>
// //       </section>

// //       {/* ECOSYSTEM (SECONDARY) */}
// //       <section className="py-20 bg-[#fafaf9] dark:bg-[#1a1816]">
// //         <div className="container-custom text-center">

// //           <h2 className="text-4xl font-bold mb-4">Supporting Ecosystem</h2>
// //           <p className="mb-12 text-[#5d5955] dark:text-[#c4bfb9]">
// //             Tools, trade, and lending exist to support real execution — not replace it
// //           </p>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             {secondaryFeatures.map((item, index) => (
// //               <div key={index} className="bg-white dark:bg-[#2d2a27] p-8 rounded-2xl border">
// //                 <item.icon className="w-10 h-10 mb-4 text-[#6d2842]" />
// //                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
// //                 <p className="text-[#5d5955] dark:text-[#c4bfb9]">{item.description}</p>
// //               </div>
// //             ))}
// //           </div>

// //         </div>
// //       </section>

// //       {/* CTA */}
// //       <section className="py-24 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white text-center">

// //         <h2 className="text-4xl font-bold mb-4">
// //           Find the Hands You Need
// //         </h2>

// //         <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
// //           Stop planning. Start building. Connect with real craft mastery today.
// //         </p>

// //         <Link to="/signup">
// //           <button className="px-8 py-4 bg-white text-[#6d2842] font-semibold rounded-xl">
// //             Start Now
// //           </button>
// //         </Link>

// //       </section>

// //     </div>
// //   );
// // };

// // export default Home;
