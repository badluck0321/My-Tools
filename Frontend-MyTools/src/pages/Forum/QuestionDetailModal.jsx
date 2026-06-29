/* ─── Question Detail Modal ───────────────────────── */
const QuestionDetailModal = ({ questionId, onClose, onUpdateQuestion }) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [posting, setPosting] = useState(false);
  const { authenticated, login } = useKeycloak();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Ensure these methods exist in your forumService.js
        const [qRes, aRes] = await Promise.all([
          forumService.getQuestion(questionId),
          forumService.getAnswers(questionId),
        ]);
        setQuestion(qRes.data);
        setAnswers(aRes.data);
      } catch (err) {
        console.error("Failed to load question details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [questionId]);

  const handleUpvote = async () => {
    if (!authenticated) {
      login();
      return;
    }
    try {
      const res = await forumService.voteQuestion(questionId, "up");
      setQuestion(res.data);
      onUpdateQuestion(res.data); // Update the background list instantly
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
      // Assuming your service handles multipart or JSON based on your backend
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <span className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

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
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#2d2a27]/95 backdrop-blur-md flex items-center justify-between p-6 border-b border-[#e8e7e5] dark:border-[#4a4642]">
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpvote}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors group">
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
            className="p-2 rounded-xl hover:bg-[#f0eeeb] dark:hover:bg-[#3a3633] transition-colors">
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
