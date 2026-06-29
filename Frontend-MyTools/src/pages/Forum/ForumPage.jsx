// import { useState, useEffect, useRef, useCallback } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronUp,
//   MessageSquare,
//   Search,
//   PlusCircle,
//   CheckCircle,
//   Eye,
//   Clock,
//   Tag,
//   X,
//   Image as ImageIcon,
//   Send,
//   Flame,
//   Inbox,
// } from "lucide-react";
// import { forumService } from "../../services/forumService"; // adjust path
// import { useKeycloak } from "../../providers/KeycloakProvider"; // adjust path

// /* ─── helpers ─────────────────────────────────────── */
// const timeAgo = (date) => {
//   if (!date) return "—";
//   const s = Math.floor((Date.now() - new Date(date)) / 1000);
//   if (s < 60) return `${s}s ago`;
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return new Date(date).toLocaleDateString("fr-FR", {
//     day: "numeric",
//     month: "short",
//   });
// };

// /* ─── Ask Question Modal ──────────────────────────── */
// const AskModal = ({ onClose, onPosted, authenticated, login }) => {
//   const [form, setForm] = useState({ title: "", body: "", tags: "" });
//   const [photos, setPhotos] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const fileRef = useRef();

//   const handle = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const handleFiles = (files) => {
//     const arr = Array.from(files);
//     setPhotos((prev) => [...prev, ...arr]);
//     arr.forEach((f) =>
//       setPreviews((prev) => [
//         ...prev,
//         { url: URL.createObjectURL(f), name: f.name },
//       ])
//     );
//   };

//   const removePhoto = (i) => {
//     URL.revokeObjectURL(previews[i].url);
//     setPhotos((p) => p.filter((_, idx) => idx !== i));
//     setPreviews((p) => p.filter((_, idx) => idx !== i));
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!authenticated) {
//       login();
//       return;
//     }
//     if (!form.title.trim() || !form.body.trim()) {
//       setError("Title and description are required.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const tags = form.tags
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean);
//       const res = await forumService.askQuestion(
//         { title: form.title, body: form.body, tags },
//         photos
//       );
//       onPosted(res.data);
//       onClose();
//     } catch (err) {
//       setError(err?.response?.data?.message ?? "Failed to post question.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//       onClick={(e) => e.target === e.currentTarget && onClose()}>
//       <motion.div
//         initial={{ scale: 0.95, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.95, y: 20 }}
//         className="bg-white dark:bg-[#2d2a27] rounded-3xl border border-[#e8e7e5] dark:border-[#4a4642] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-[#e8e7e5] dark:border-[#4a4642]">
//           <h2 className="text-xl font-bold text-[#1a1816] dark:text-[#f0ece8]">
//             Ask a Question
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors">
//             <X size={18} className="text-[#5d5955]" />
//           </button>
//         </div>

//         <form onSubmit={submit} className="p-6 space-y-5">
//           {/* title */}
//           <div>
//             <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
//               Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               name="title"
//               value={form.title}
//               onChange={handle}
//               required
//               placeholder="e.g. What drill bit do I use for ceramic tile?"
//               className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-sm text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
//             />
//             <p className="text-xs text-[#8a8580] mt-1">
//               Be specific and concise — imagine you're asking a colleague.
//             </p>
//           </div>

//           {/* body */}
//           <div>
//             <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               name="body"
//               value={form.body}
//               onChange={handle}
//               required
//               rows={5}
//               placeholder="Describe the problem in detail. Include what you've already tried, what materials/tools are involved, and any measurements or specs."
//               className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-sm text-[#1a1816] dark:text-[#f0ece8] resize-none focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
//             />
//           </div>

//           {/* tags */}
//           <div>
//             <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
//               Tags{" "}
//               <span className="text-[#8a8580] font-normal">(optional)</span>
//             </label>
//             <input
//               name="tags"
//               value={form.tags}
//               onChange={handle}
//               placeholder="plumbing, drill, leak (comma separated)"
//               className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-sm text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
//             />
//           </div>

//           {/* photo previews */}
//           {previews.length > 0 && (
//             <div className="flex flex-wrap gap-3">
//               {previews.map((p, i) => (
//                 <div
//                   key={i}
//                   className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e8e7e5] dark:border-[#4a4642]">
//                   <img
//                     src={p.url}
//                     alt={p.name}
//                     className="w-full h-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removePhoto(i)}
//                     className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
//                     <X size={10} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {error && <p className="text-sm text-red-500">{error}</p>}

//           <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
//             <button
//               type="button"
//               onClick={() => fileRef.current?.click()}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] text-sm text-[#5d5955] dark:text-[#c4bfb9] hover:border-[#6d2842]/50 transition-all">
//               <ImageIcon size={15} /> Add photos
//             </button>
//             <input
//               ref={fileRef}
//               type="file"
//               accept="image/*"
//               multiple
//               hidden
//               onChange={(e) => handleFiles(e.target.files)}
//             />

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-5 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] text-sm text-[#5d5955] hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-all">
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
//                 {loading ? (
//                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     <Send size={14} /> Post Question
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// /* ─── Question Row ────────────────────────────────── */
// const QuestionRow = ({ question, isLast }) => {
//   const navigate = useNavigate();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       onClick={() => navigate(`/forum/questions/${question.id}`)}
//       className={`flex gap-4 p-5 cursor-pointer hover:bg-[#f5f5f3] dark:hover:bg-[#3a3633] transition-colors group ${
//         !isLast ? "border-b border-[#e8e7e5] dark:border-[#3a3633]" : ""
//       }`}>
//       {/* stats column */}
//       <div className="flex flex-col gap-2 text-center flex-shrink-0 min-w-[56px]">
//         <div
//           className={`rounded-xl px-2 py-1.5 text-xs font-bold ${
//             question.solved
//               ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700/50"
//               : "bg-[#f0eeeb] dark:bg-[#1a1816] text-[#5d5955] dark:text-[#c4bfb9]"
//           }`}>
//           {question.solved && (
//             <CheckCircle size={10} className="inline mb-0.5 mr-0.5" />
//           )}
//           {question.answerCount ?? 0}
//           <div className="text-[10px] font-normal">ans</div>
//         </div>
//         <div className="text-xs text-[#8a8580] flex flex-col items-center gap-0.5">
//           <ChevronUp size={12} />
//           {question.upvotes ?? 0}
//         </div>
//         <div className="text-xs text-[#b0aba5] flex flex-col items-center gap-0.5">
//           <Eye size={10} />
//           {question.viewCount ?? 0}
//         </div>
//       </div>

//       {/* content */}
//       <div className="flex-1 min-w-0">
//         <h2 className="text-base font-bold text-[#1a1816] dark:text-[#f0ece8] group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors mb-1.5 line-clamp-2">
//           {question.title}
//         </h2>

//         {question.body && (
//           <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9] line-clamp-2 mb-2">
//             {question.body}
//           </p>
//         )}

//         {/* tags */}
//         {question.tags?.length > 0 && (
//           <div className="flex flex-wrap gap-1.5 mb-2">
//             {question.tags.slice(0, 4).map((t) => (
//               <span
//                 key={t}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                 }}
//                 className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6d2842]/8 dark:bg-[#6d2842]/20 text-[#6d2842] dark:text-[#e8a0b4]">
//                 #{t}
//               </span>
//             ))}
//           </div>
//         )}

//         <div className="flex items-center gap-3 text-xs text-[#8a8580]">
//           <span className="font-medium text-[#5d5955] dark:text-[#c4bfb9]">
//             {question.authorName}
//           </span>
//           <span>·</span>
//           <Clock size={11} /> {timeAgo(question.createdAt)}
//           {question.photoIds?.length > 0 && (
//             <>
//               <span>·</span>
//               <ImageIcon size={11} /> {question.photoIds.length} photo
//               {question.photoIds.length > 1 ? "s" : ""}
//             </>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// /* ═══════════════════════════════════════════════════
//    FORUM PAGE
// ══════════════════════════════════════════════════ */
// const ForumPage = () => {
//   const { authenticated, login } = useKeycloak();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState(
//     searchParams.get("search") ?? ""
//   );
//   const [activeTag, setActiveTag] = useState(searchParams.get("tag") ?? "");
//   const [sortBy, setSortBy] = useState("newest");
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [showAsk, setShowAsk] = useState(false);
//   const searchTimer = useRef(null);

//   const popularTags = [
//     "plumbing",
//     "electrical",
//     "tiling",
//     "drilling",
//     "painting",
//     "welding",
//     "woodwork",
//     "concrete",
//   ];

//   /* ── fetch ── */
//   const fetchQuestions = useCallback(
//     async (reset = false) => {
//       setLoading(true);
//       try {
//         const p = reset ? 0 : page;
//         const res = await forumService.getQuestions({
//           tag: activeTag || undefined,
//           search: searchTerm || undefined,
//           sort: sortBy,
//           page: p,
//           size: 10,
//         });
//         const data = res.data;
//         const content = data?.content ?? (Array.isArray(data) ? data : []);
//         if (reset) {
//           setQuestions(content);
//           setPage(1);
//         } else {
//           setQuestions((prev) => [...prev, ...content]);
//           setPage((prev) => prev + 1);
//         }
//         setHasMore(content.length === 10);
//       } catch {
//         setHasMore(false);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [activeTag, searchTerm, sortBy, page]
//   );

//   // reset on filter/sort change
//   useEffect(() => {
//     setPage(0);
//     fetchQuestions(true);
//   }, [activeTag, sortBy]);

//   // debounce search
//   useEffect(() => {
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setPage(0);
//       fetchQuestions(true);
//     }, 400);
//     return () => clearTimeout(searchTimer.current);
//   }, [searchTerm]);

//   const handleTagClick = (tag) => {
//     setActiveTag((prev) => (prev === tag ? "" : tag));
//     setSearchTerm("");
//   };

//   const handlePosted = (newQ) => {
//     setQuestions((prev) => [newQ, ...prev]);
//   };

//   const totalAnswers = questions.reduce((s, q) => s + (q.answerCount ?? 0), 0);

//   return (
//     <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">
//       {/* ── Header ── */}
//       <div className="bg-gradient-to-br from-[#6d2842] to-[#a64d6d] py-12 text-white">
//         <div className="container-custom">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">
//                 Community Q&A
//               </h1>
//               <p className="text-white/75">
//                 {questions.length} questions · {totalAnswers} answers from real
//                 craftsmen
//               </p>
//             </div>
//             <button
//               onClick={() => (authenticated ? setShowAsk(true) : login())}
//               className="flex items-center gap-2 self-start md:self-auto bg-white text-[#6d2842] font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-lg">
//               <PlusCircle size={18} /> Ask a Question
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container-custom py-8">
//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* ── Sidebar ── */}
//           <aside className="lg:col-span-1 space-y-6">
//             {/* stats */}
//             <div className="bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] p-5">
//               <h3 className="text-sm font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-3">
//                 Forum Stats
//               </h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[#8a8580]">Questions</span>
//                   <span className="font-bold text-[#1a1816] dark:text-[#f0ece8]">
//                     {questions.length}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#8a8580]">Answers</span>
//                   <span className="font-bold text-[#1a1816] dark:text-[#f0ece8]">
//                     {totalAnswers}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#8a8580]">Solved</span>
//                   <span className="font-bold text-green-600">
//                     {questions.filter((q) => q.solved).length}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* popular tags */}
//             <div className="bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] p-5">
//               <h3 className="text-sm font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-3 flex items-center gap-1.5">
//                 <Tag size={14} className="text-[#6d2842]" /> Popular Tags
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {popularTags.map((tag) => (
//                   <button
//                     key={tag}
//                     onClick={() => handleTagClick(tag)}
//                     className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
//                       activeTag === tag
//                         ? "bg-[#6d2842] text-white"
//                         : "bg-[#f0eeeb] dark:bg-[#3a3633] text-[#5d5955] dark:text-[#c4bfb9] hover:bg-[#6d2842]/15"
//                     }`}>
//                     #{tag}
//                   </button>
//                 ))}
//               </div>
//               {activeTag && (
//                 <button
//                   onClick={() => setActiveTag("")}
//                   className="mt-3 text-xs text-[#6d2842] dark:text-[#e8a0b4] flex items-center gap-1 hover:underline">
//                   <X size={11} /> Clear filter
//                 </button>
//               )}
//             </div>
//           </aside>

//           {/* ── Main Feed ── */}
//           <main className="lg:col-span-3 space-y-4">
//             {/* Search + Sort */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative flex-1">
//                 <Search
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8580]"
//                   size={17}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search questions..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e7e5] dark:border-[#3a3633] bg-white dark:bg-[#2d2a27] text-[#1a1816] dark:text-[#f0ece8] text-sm focus:ring-2 focus:ring-[#6d2842]/40 outline-none transition"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8580] hover:text-[#6d2842]">
//                     <X size={15} />
//                   </button>
//                 )}
//               </div>
//               <div className="flex gap-2 flex-shrink-0">
//                 {[
//                   { value: "newest", label: "Newest", icon: Clock },
//                   { value: "top", label: "Top", icon: Flame },
//                   { value: "unanswered", label: "Open", icon: Inbox },
//                 ].map(({ value, label, icon: Icon }) => (
//                   <button
//                     key={value}
//                     onClick={() => setSortBy(value)}
//                     className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
//                       sortBy === value
//                         ? "bg-[#6d2842] text-white shadow-md shadow-[#6d2842]/25"
//                         : "bg-white dark:bg-[#2d2a27] text-[#5d5955] dark:text-[#c4bfb9] border border-[#e8e7e5] dark:border-[#3a3633] hover:border-[#6d2842]/40"
//                     }`}>
//                     <Icon size={13} /> {label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* active tag / search label */}
//             {(activeTag || searchTerm) && (
//               <div className="flex items-center gap-2 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
//                 <span>Filtering by:</span>
//                 {activeTag && (
//                   <span className="px-2.5 py-0.5 rounded-full bg-[#6d2842]/10 text-[#6d2842] dark:text-[#e8a0b4] text-xs font-bold">
//                     #{activeTag}
//                   </span>
//                 )}
//                 {searchTerm && (
//                   <span className="px-2.5 py-0.5 rounded-full bg-[#f0eeeb] dark:bg-[#3a3633] text-xs">
//                     "{searchTerm}"
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* questions list */}
//             <div className="bg-white dark:bg-[#2d2a27] rounded-2xl shadow-sm border border-[#e8e7e5] dark:border-[#3a3633] overflow-hidden">
//               {loading && questions.length === 0 ? (
//                 <div className="flex items-center justify-center py-16">
//                   <span className="w-7 h-7 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
//                 </div>
//               ) : questions.length === 0 ? (
//                 <div className="text-center py-16 space-y-3">
//                   <MessageSquare size={32} className="text-[#c4bfb9] mx-auto" />
//                   <p className="text-[#5d5955] dark:text-[#c4bfb9]">
//                     No questions found.
//                   </p>
//                   <button
//                     onClick={() => (authenticated ? setShowAsk(true) : login())}
//                     className="text-sm text-[#6d2842] dark:text-[#e8a0b4] underline underline-offset-4">
//                     Be the first to ask!
//                   </button>
//                 </div>
//               ) : (
//                 <AnimatePresence>
//                   {questions.map((q, i) => (
//                     <QuestionRow
//                       key={q.id}
//                       question={q}
//                       isLast={i === questions.length - 1}
//                     />
//                   ))}
//                 </AnimatePresence>
//               )}
//             </div>

//             {/* load more */}
//             {hasMore && !loading && questions.length > 0 && (
//               <div className="text-center">
//                 <button
//                   onClick={() => fetchQuestions(false)}
//                   className="px-6 py-2.5 rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] text-sm text-[#5d5955] dark:text-[#c4bfb9] hover:border-[#6d2842]/40 hover:text-[#6d2842] transition-all">
//                   Load more questions
//                 </button>
//               </div>
//             )}

//             {loading && questions.length > 0 && (
//               <div className="flex justify-center py-4">
//                 <span className="w-5 h-5 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
//               </div>
//             )}
//           </main>
//         </div>
//       </div>

//       {/* ── Ask Modal ── */}
//       <AnimatePresence>
//         {showAsk && (
//           <AskModal
//             onClose={() => setShowAsk(false)}
//             onPosted={handlePosted}
//             authenticated={authenticated}
//             login={login}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ForumPage;
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  MessageSquare,
  Search,
  PlusCircle,
  CheckCircle,
  Eye,
  Clock,
  Tag,
  X,
  Image as ImageIcon,
  Send,
  Flame,
  Inbox,
} from "lucide-react";
import { forumService } from "../../services/forumService";
import { useKeycloak } from "../../providers/KeycloakProvider";

/* ─── helpers ─────────────────────────────────────── */
const timeAgo = (date) => {
  if (!date) return "—";
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

/* ─── Ask Question Modal ──────────────────────────── */
const AskModal = ({ onClose, onPosted, authenticated, login }) => {
  const [form, setForm] = useState({ title: "", body: "", tags: "" });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFiles = (files) => {
    const arr = Array.from(files);
    setPhotos((prev) => [...prev, ...arr]);
    arr.forEach((f) =>
      setPreviews((prev) => [
        ...prev,
        { url: URL.createObjectURL(f), name: f.name },
      ])
    );
  };

  const removePhoto = (i) => {
    URL.revokeObjectURL(previews[i].url);
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!authenticated) {
      login();
      return;
    }
    if (!form.title.trim() || !form.body.trim()) {
      setError("Title and description are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await forumService.askQuestion(
        { title: form.title, body: form.body, tags },
        photos
      );
      onPosted(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to post question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#2d2a27] rounded-3xl border border-[#e8e7e5] dark:border-[#4a4642] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e8e7e5] dark:border-[#4a4642]">
          <h2 className="text-xl font-bold text-[#1a1816] dark:text-[#f0ece8]">
            Ask a Question
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors">
            <X size={18} className="text-[#5d5955]" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handle}
              required
              placeholder="e.g. What drill bit do I use for ceramic tile?"
              className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-sm text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handle}
              required
              rows={5}
              placeholder="Describe the problem in detail..."
              className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-sm text-[#1a1816] dark:text-[#f0ece8] resize-none focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2d2a27] dark:text-[#c4bfb9] mb-1.5">
              Tags{" "}
              <span className="text-[#8a8580] font-normal">(optional)</span>
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handle}
              placeholder="plumbing, drill, leak (comma separated)"
              className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-sm text-[#1a1816] dark:text-[#f0ece8] focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
          </div>
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {previews.map((p, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e8e7e5] dark:border-[#4a4642]">
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] text-sm text-[#5d5955] dark:text-[#c4bfb9] hover:border-[#6d2842]/50 transition-all">
              <ImageIcon size={15} /> Add photos
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] text-sm text-[#5d5955] hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-all">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} /> Post Question
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─── Question Detail Hovering Modal ──────────────── */
const QuestionDetailModal = ({ questionId, onClose, onUpdateQuestion }) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [posting, setPosting] = useState(false);
  const { authenticated, login } = useKeycloak();

  useEffect(() => {
    let cancelled = false;
    const fetchDetails = async () => {
      try {
        const [qRes, aRes] = await Promise.all([
          forumService.getQuestion(questionId),
          forumService.getAnswers(questionId),
        ]);
        if (!cancelled) {
          setQuestion(qRes.data);
          setAnswers(aRes.data);
        }
      } catch (err) {
        console.error("Failed to load question details", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  const handleUpvote = async () => {
    if (!authenticated) {
      login();
      return;
    }
    try {
      const res = await forumService.voteQuestion(questionId, "up");
      setQuestion(res.data);
      onUpdateQuestion(res.data);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!authenticated) {
      login();
      return;
    }
    if (!answerText.trim()) return;
    setPosting(true);
    try {
      const res = await forumService.postAnswer(
        questionId,
        { body: answerText },
        []
      );
      setAnswers((prev) => [...prev, res.data]);
      setAnswerText("");
    } catch (err) {
      console.error("Failed to post answer", err);
    } finally {
      setPosting(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <span className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );

  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#2d2a27] rounded-3xl border border-[#e8e7e5] dark:border-[#4a4642] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Sticky Header with Upvote */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#2d2a27]/95 backdrop-blur-md flex items-center justify-between p-6 border-b border-[#e8e7e5] dark:border-[#4a4642]">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={handleUpvote}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors group shrink-0">
              <ChevronUp
                size={20}
                className="text-[#8a8580] group-hover:text-[#6d2842]"
              />
              <span className="text-sm font-bold text-[#1a1816] dark:text-[#f0ece8]">
                {question.upvotes ?? 0}
              </span>
            </button>
            <h2 className="text-xl font-bold text-[#1a1816] dark:text-[#f0ece8] line-clamp-2">
              {question.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors shrink-0 ml-4">
            <X size={18} className="text-[#5d5955]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Question Body */}
          <div>
            <p className="text-[#2d2a27] dark:text-[#c4bfb9] whitespace-pre-wrap leading-relaxed">
              {question.body}
            </p>
            <div className="flex items-center gap-3 text-xs text-[#8a8580] mt-4">
              <span className="font-medium text-[#5d5955] dark:text-[#c4bfb9]">
                {question.authorName}
              </span>
              <span>·</span>
              <Clock size={11} /> {timeAgo(question.createdAt)}
            </div>
            {question.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {question.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6d2842]/8 dark:bg-[#6d2842]/20 text-[#6d2842] dark:text-[#e8a0b4]">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <hr className="border-[#e8e7e5] dark:border-[#4a4642]" />

          {/* Answers Section */}
          <div>
            <h3 className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8] mb-4">
              {answers.length} Answer{answers.length !== 1 ? "s" : ""}
            </h3>
            <div className="space-y-4">
              {answers.map((ans) => (
                <div
                  key={ans.id}
                  className="p-4 rounded-xl bg-[#fafaf9] dark:bg-[#1a1816] border border-[#e8e7e5] dark:border-[#4a4642]">
                  <p className="text-sm text-[#2d2a27] dark:text-[#c4bfb9] whitespace-pre-wrap">
                    {ans.body}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#8a8580] mt-2">
                    <span className="font-medium">{ans.authorName}</span>
                    <span>·</span>
                    <Clock size={11} /> {timeAgo(ans.createdAt)}
                  </div>
                </div>
              ))}
              {answers.length === 0 && (
                <p className="text-sm text-[#8a8580] italic">
                  No answers yet. Be the first to help!
                </p>
              )}
            </div>
          </div>

          {/* Post Answer Form */}
          <form
            onSubmit={handlePostAnswer}
            className="pt-4 border-t border-[#e8e7e5] dark:border-[#4a4642]">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Write your answer..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#d4cfc9] dark:border-[#4a4642] bg-[#fafaf9] dark:bg-[#1a1816] text-sm text-[#1a1816] dark:text-[#f0ece8] resize-none focus:outline-none focus:ring-2 focus:ring-[#6d2842]/40 transition"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={posting || !answerText.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#6d2842] to-[#a64d6d] text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
                {posting ? "Posting..." : "Post Answer"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Question Row ────────────────────────────────── */
const QuestionRow = ({ question, isLast, onSelect }) => {
  const { authenticated, login } = useKeycloak();

  const handleUpvote = async (e) => {
    e.stopPropagation(); // Prevents modal from opening
    if (!authenticated) {
      login();
      return;
    }
    try {
      const res = await forumService.voteQuestion(question.id, "up");
      // Update parent list immediately via callback
      onSelect(res.data, true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(question.id)} // Opens modal instead of navigating
      className={`flex gap-4 p-5 cursor-pointer hover:bg-[#f5f5f3] dark:hover:bg-[#3a3633] transition-colors group ${
        !isLast ? "border-b border-[#e8e7e5] dark:border-[#3a3633]" : ""
      }`}>
      {/* Stats Column */}
      <div className="flex flex-col gap-2 text-center flex-shrink-0 min-w-[56px]">
        <div
          className={`rounded-xl px-2 py-1.5 text-xs font-bold ${
            question.solved
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700/50"
              : "bg-[#f0eeeb] dark:bg-[#1a1816] text-[#5d5955] dark:text-[#c4bfb9]"
          }`}>
          {question.solved && (
            <CheckCircle size={10} className="inline mb-0.5 mr-0.5" />
          )}
          {question.answerCount ?? 0}
          <div className="text-[10px] font-normal">ans</div>
        </div>

        {/* Direct Upvote Button */}
        <button
          onClick={handleUpvote}
          className="text-xs text-[#8a8580] hover:text-[#6d2842] flex flex-col items-center gap-0.5 transition-colors">
          <ChevronUp size={14} />
          {question.upvotes ?? 0}
        </button>

        <div className="text-xs text-[#b0aba5] flex flex-col items-center gap-0.5">
          <Eye size={10} />
          {question.viewCount ?? 0}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-[#1a1816] dark:text-[#f0ece8] group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors mb-1.5 line-clamp-2">
          {question.title}
        </h2>
        {question.body && (
          <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9] line-clamp-2 mb-2">
            {question.body}
          </p>
        )}
        {question.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {question.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#6d2842]/8 dark:bg-[#6d2842]/20 text-[#6d2842] dark:text-[#e8a0b4]">
                #{t}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-[#8a8580]">
          <span className="font-medium text-[#5d5955] dark:text-[#c4bfb9]">
            {question.authorName}
          </span>
          <span>·</span>
          <Clock size={11} /> {timeAgo(question.createdAt)}
          {question.photoIds?.length > 0 && (
            <>
              <span>·</span>
              <ImageIcon size={11} /> {question.photoIds.length} photo
              {question.photoIds.length > 1 ? "s" : ""}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════ FORUM PAGE ═══════════════════════════════════════════════════ */
const ForumPage = () => {
  const { authenticated, login } = useKeycloak();
  const [searchParams, setSearchParams] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? ""
  );
  const [activeTag, setActiveTag] = useState(searchParams.get("tag") ?? "");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAsk, setShowAsk] = useState(false);

  // NEW STATE FOR DETAIL MODAL
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const searchTimer = useRef(null);
  const popularTags = [
    "plumbing",
    "electrical",
    "tiling",
    "drilling",
    "painting",
    "welding",
    "woodwork",
    "concrete",
  ];

  /* ── fetch ── */
  const fetchQuestions = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const p = reset ? 0 : page;
        const res = await forumService.getQuestions({
          tag: activeTag || undefined,
          search: searchTerm || undefined,
          sort: sortBy,
          page: p,
          size: 10,
        });
        const data = res.data;
        const content = data?.content ?? (Array.isArray(data) ? data : []);
        if (reset) {
          setQuestions(content);
          setPage(1);
        } else {
          setQuestions((prev) => [...prev, ...content]);
          setPage((prev) => prev + 1);
        }
        setHasMore(content.length === 10);
      } catch {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [activeTag, searchTerm, sortBy, page]
  );

  useEffect(() => {
    setPage(0);
    fetchQuestions(true);
  }, [activeTag, sortBy]);
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(0);
      fetchQuestions(true);
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm]);

  const handleTagClick = (tag) => {
    setActiveTag((prev) => (prev === tag ? "" : tag));
    setSearchTerm("");
  };

  const handlePosted = (newQ) => {
    setQuestions((prev) => [newQ, ...prev]);
  };

  // HANDLES BOTH MODAL OPENING AND DIRECT UPVOTE UPDATES
  const handleSelect = (payload, isUpdate = false) => {
    if (isUpdate && typeof payload === "object") {
      // Direct upvote update from QuestionRow
      setQuestions((prev) =>
        prev.map((q) => (q.id === payload.id ? payload : q))
      );
    } else {
      // Open modal
      setSelectedQuestionId(payload);
    }
  };

  const totalAnswers = questions.reduce((s, q) => s + (q.answerCount ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">
      {/* ── Header ─ */}
      <div className="bg-gradient-to-br from-[#6d2842] to-[#a64d6d] py-12 text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">
                Community Q&A
              </h1>
              <p className="text-white/75">
                {questions.length} questions · {totalAnswers} answers from real
                craftsmen
              </p>
            </div>
            <button
              onClick={() => (authenticated ? setShowAsk(true) : login())}
              className="flex items-center gap-2 self-start md:self-auto bg-white text-[#6d2842] font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-lg">
              <PlusCircle size={18} /> Ask a Question
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] p-5">
              <h3 className="text-sm font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-3">
                Forum Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8a8580]">Questions</span>
                  <span className="font-bold text-[#1a1816] dark:text-[#f0ece8]">
                    {questions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8580]">Answers</span>
                  <span className="font-bold text-[#1a1816] dark:text-[#f0ece8]">
                    {totalAnswers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8580]">Solved</span>
                  <span className="font-bold text-green-600">
                    {questions.filter((q) => q.solved).length}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] p-5">
              <h3 className="text-sm font-bold text-[#2d2a27] dark:text-[#fafaf9] mb-3 flex items-center gap-1.5">
                <Tag size={14} className="text-[#6d2842]" /> Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                      activeTag === tag
                        ? "bg-[#6d2842] text-white"
                        : "bg-[#f0eeeb] dark:bg-[#3a3633] text-[#5d5955] dark:text-[#c4bfb9] hover:bg-[#6d2842]/15"
                    }`}>
                    #{tag}
                  </button>
                ))}
              </div>
              {activeTag && (
                <button
                  onClick={() => setActiveTag("")}
                  className="mt-3 text-xs text-[#6d2842] dark:text-[#e8a0b4] flex items-center gap-1 hover:underline">
                  <X size={11} /> Clear filter
                </button>
              )}
            </div>
          </aside>

          {/* ── Main Feed ── */}
          <main className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8580]"
                  size={17}
                />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e7e5] dark:border-[#3a3633] bg-white dark:bg-[#2d2a27] text-[#1a1816] dark:text-[#f0ece8] text-sm focus:ring-2 focus:ring-[#6d2842]/40 outline-none transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8580] hover:text-[#6d2842]">
                    <X size={15} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {[
                  { value: "newest", label: "Newest", icon: Clock },
                  { value: "top", label: "Top", icon: Flame },
                  { value: "unanswered", label: "Open", icon: Inbox },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSortBy(value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                      sortBy === value
                        ? "bg-[#6d2842] text-white shadow-md shadow-[#6d2842]/25"
                        : "bg-white dark:bg-[#2d2a27] text-[#5d5955] dark:text-[#c4bfb9] border border-[#e8e7e5] dark:border-[#3a3633] hover:border-[#6d2842]/40"
                    }`}>
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {(activeTag || searchTerm) && (
              <div className="flex items-center gap-2 text-sm text-[#5d5955] dark:text-[#c4bfb9]">
                <span>Filtering by:</span>
                {activeTag && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6d2842]/10 text-[#6d2842] dark:text-[#e8a0b4] text-xs font-bold">
                    #{activeTag}
                  </span>
                )}
                {searchTerm && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f0eeeb] dark:bg-[#3a3633] text-xs">
                    "{searchTerm}"
                  </span>
                )}
              </div>
            )}

            <div className="bg-white dark:bg-[#2d2a27] rounded-2xl shadow-sm border border-[#e8e7e5] dark:border-[#3a3633] overflow-hidden">
              {loading && questions.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <span className="w-7 h-7 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <MessageSquare size={32} className="text-[#c4bfb9] mx-auto" />
                  <p className="text-[#5d5955] dark:text-[#c4bfb9]">
                    No questions found.
                  </p>
                  <button
                    onClick={() => (authenticated ? setShowAsk(true) : login())}
                    className="text-sm text-[#6d2842] dark:text-[#e8a0b4] underline underline-offset-4">
                    Be the first to ask!
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {questions.map((q, i) => (
                    <QuestionRow
                      key={q.id}
                      question={q}
                      isLast={i === questions.length - 1}
                      onSelect={handleSelect}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {hasMore && !loading && questions.length > 0 && (
              <div className="text-center">
                <button
                  onClick={() => fetchQuestions(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#e8e7e5] dark:border-[#4a4642] text-sm text-[#5d5955] dark:text-[#c4bfb9] hover:border-[#6d2842]/40 hover:text-[#6d2842] transition-all">
                  Load more questions
                </button>
              </div>
            )}
            {loading && questions.length > 0 && (
              <div className="flex justify-center py-4">
                <span className="w-5 h-5 border-2 border-[#6d2842]/30 border-t-[#6d2842] rounded-full animate-spin" />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAsk && (
          <AskModal
            onClose={() => setShowAsk(false)}
            onPosted={handlePosted}
            authenticated={authenticated}
            login={login}
          />
        )}
        {selectedQuestionId && (
          <QuestionDetailModal
            questionId={selectedQuestionId}
            onClose={() => setSelectedQuestionId(null)}
            onUpdateQuestion={(updatedQ) =>
              setQuestions((prev) =>
                prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
              )
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForumPage;
