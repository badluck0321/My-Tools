import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";

const posts = [
  {
    id: 1,
    slug: "how-to-rent-tools-on-mytools",
    title: "How to Rent Professional Tools on My-Tools in 3 Steps",
    excerpt:
      "Renting instead of buying saves money and storage space. Here is the fastest way to find and book the tool you need for your next project.",
    category: "Guide",
    readTime: "4 min read",
    date: "June 10, 2026",
    cover: null,
  },
  {
    id: 2,
    slug: "top-5-mastery-categories",
    title: "Top 5 Most In-Demand Craft Skills on the Platform This Year",
    excerpt:
      "Plumbing leads the pack, followed by electrical work and tiling. We break down what homeowners are looking for most and what that means for craftsmen.",
    category: "Insights",
    readTime: "6 min read",
    date: "May 28, 2026",
    cover: null,
  },
  {
    id: 3,
    slug: "community-qa-launch",
    title: "Introducing Community Q&A — Stack Overflow for Handymen",
    excerpt:
      "The new Community forum lets professionals ask questions, attach photos of the problem, and get answers upvoted by real craftsmen.",
    category: "News",
    readTime: "3 min read",
    date: "May 14, 2026",
    cover: null,
  },
  {
    id: 4,
    slug: "kafka-notifications",
    title: "Behind the Scenes: How We Built Real-Time Notifications with Kafka",
    excerpt:
      "A technical deep-dive into the event-driven architecture powering instant order updates, answer notifications, and activity tracking.",
    category: "Tech",
    readTime: "9 min read",
    date: "April 30, 2026",
    cover: null,
  },
  {
    id: 5,
    slug: "seller-success-tips",
    title: "7 Tips to Get Your First Sale Faster on My-Tools",
    excerpt:
      "From writing a better product description to pricing your tool rental correctly — practical advice from sellers who cracked it in the first month.",
    category: "Guide",
    readTime: "5 min read",
    date: "April 15, 2026",
    cover: null,
  },
];

const categoryColor = {
  Guide:
    "bg-[#6d2842]/10 text-[#6d2842] dark:bg-[#6d2842]/30 dark:text-[#e8a0b4]",
  Insights:
    "bg-[#508978]/10 text-[#508978] dark:bg-[#508978]/30 dark:text-[#90c5b8]",
  News: "bg-[#b8862f]/10 text-[#b8862f] dark:bg-[#b8862f]/30 dark:text-[#d4a343]",
  Tech: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const Blog = () => (
  <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">
    {/* Hero */}
    <section className="bg-gradient-to-br from-[#6d2842] to-[#a64d6d] py-20 text-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
          <BookOpen size={26} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
          My-Tools Blog
        </h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Guides, news, and insights for professionals in the trades.
        </p>
      </motion.div>
    </section>

    <div className="container-custom py-16">
      {/* Featured post */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 bg-gradient-to-br from-[#6d2842]/5 to-[#a64d6d]/5 dark:from-[#6d2842]/15 dark:to-[#a64d6d]/10 rounded-3xl border border-[#6d2842]/20 p-8 md:p-10">
        <span
          className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-3 ${
            categoryColor[posts[0].category]
          }`}>
          {posts[0].category}
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-[#1a1816] dark:text-[#f0ece8] mb-3">
          {posts[0].title}
        </h2>
        <p className="text-[#5d5955] dark:text-[#c4bfb9] mb-5 max-w-2xl">
          {posts[0].excerpt}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs text-[#8a8580]">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {posts[0].readTime}
            </span>
            <span>{posts[0].date}</span>
          </div>
          <Link
            to={`/blog/${posts[0].slug}`}
            className="flex items-center gap-2 text-sm font-semibold text-[#6d2842] dark:text-[#e8a0b4] hover:underline underline-offset-4">
            Read article <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}>
            <Link
              to={`/blog/${post.slug}`}
              className="block bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] overflow-hidden hover:shadow-lg hover:border-[#6d2842]/30 transition-all group h-full">
              {/* placeholder cover */}
              <div className="h-36 bg-gradient-to-br from-[#f0eeeb] to-[#e8e7e5] dark:from-[#3a3633] dark:to-[#2d2a27] flex items-center justify-center">
                <Tag size={28} className="text-[#c4bfb9] dark:text-[#5d5955]" />
              </div>
              <div className="p-5 space-y-3">
                <span
                  className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    categoryColor[post.category]
                  }`}>
                  {post.category}
                </span>
                <h3 className="font-bold text-[#1a1816] dark:text-[#f0ece8] group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9] line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#8a8580] pt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
