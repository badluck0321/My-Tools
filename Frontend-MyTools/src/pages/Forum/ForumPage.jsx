import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Search,
  PlusCircle,
} from "lucide-react";

const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    // TODO: Replace this with your actual API call to get all questions
    // forumService.getAllQuestions().then(setQuestions);

    // MOCK DATA FOR NOW:
    setQuestions([
      {
        id: "1",
        title: "How to fix a leaking pipe under the sink?",
        excerpt: "I noticed water pooling under my kitchen sink...",
        author: "JohnDoe",
        votes: 15,
        answers: 4,
        category: "Plumbing",
        date: "2 hours ago",
      },
      {
        id: "2",
        title: "Best paint for exterior walls in humid climate?",
        excerpt: "I am planning to repaint my house exterior...",
        author: "JaneSmith",
        votes: 8,
        answers: 2,
        category: "Painting",
        date: "5 hours ago",
      },
      {
        id: "3",
        title: "Why do my lights flicker when the AC turns on?",
        excerpt: "Every time the air conditioner kicks in...",
        author: "Sparky99",
        votes: 22,
        answers: 7,
        category: "Electrical",
        date: "1 day ago",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafaf9] via-[#f5f5f3] to-[#e8e7e5] dark:from-[#1a1816] dark:via-[#2d2a27] dark:to-[#3a3633]">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1a1816] dark:text-[#f0ece8]">
              Community Q&A
            </h1>
            <p className="text-[#5d5955] dark:text-[#c4bfb9] mt-1">
              Ask questions, share knowledge, and connect with masters.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#6d2842] via-[#8b3654] to-[#a64d6d] text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#6d2842]/20">
            <PlusCircle size={20} />
            Ask a Question
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8580]"
              size={20}
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e7e5] dark:border-[#3a3633] bg-white dark:bg-[#2d2a27] text-[#1a1816] dark:text-[#f0ece8] focus:ring-2 focus:ring-[#6d2842] outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["recent", "popular", "unanswered"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSortBy(filter)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm capitalize transition-all ${
                  sortBy === filter
                    ? "bg-[#6d2842] text-white"
                    : "bg-white dark:bg-[#2d2a27] text-[#5d5955] dark:text-[#c4bfb9] border border-[#e8e7e5] dark:border-[#3a3633]"
                }`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed */}
        <div className="bg-white dark:bg-[#2d2a27] rounded-2xl shadow-sm border border-[#e8e7e5] dark:border-[#3a3633] overflow-hidden">
          {questions.map((q, index) => (
            <Link
              to={`/forum/${q.id}`}
              key={q.id}
              className={`flex gap-4 p-5 hover:bg-[#f5f5f3] dark:hover:bg-[#3a3633] transition-colors group ${
                index !== questions.length - 1
                  ? "border-b border-[#e8e7e5] dark:border-[#3a3633]"
                  : ""
              }`}>
              {/* Reddit-style Vote Column */}
              <div className="flex flex-col items-center bg-[#f0eeeb] dark:bg-[#1a1816] rounded-lg p-2 min-w-[50px] h-fit">
                <button className="text-[#8a8580] hover:text-green-600 transition-colors">
                  <ChevronUp size={20} />
                </button>
                <span className="text-sm font-bold text-[#2d2a27] dark:text-[#e8e4e0] my-1">
                  {q.votes}
                </span>
                <button className="text-[#8a8580] hover:text-red-600 transition-colors">
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6d2842]/10 text-[#6d2842] dark:bg-[#6d2842]/30 dark:text-[#e8a0b4]">
                    {q.category}
                  </span>
                  <span className="text-xs text-[#8a8580] dark:text-[#7a756f]">
                    Posted by {q.author} • {q.date}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#1a1816] dark:text-[#f0ece8] group-hover:text-[#6d2842] transition-colors mb-2">
                  {q.title}
                </h2>

                <p className="text-[#5d5955] dark:text-[#c4bfb9] line-clamp-2 mb-3">
                  {q.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-[#8a8580] dark:text-[#7a756f]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MessageSquare size={16} /> {q.answers} Answers
                  </span>
                  <button className="hover:text-[#6d2842] transition-colors">
                    Share
                  </button>
                  <button className="hover:text-[#6d2842] transition-colors">
                    Save
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
