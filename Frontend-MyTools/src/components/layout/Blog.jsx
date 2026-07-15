import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation();

  const posts = [
    {
      id: 1,
      slug: "how-to-rent-tools-on-mytools",
      title: t("blog.post1.title"),
      excerpt: t("blog.post1.excerpt"),
      category: t("blog.categories.guide"),
      readTime: t("blog.post1.readTime"),
      date: t("blog.post1.date"),
      cover: null,
    },
    {
      id: 2,
      slug: "top-5-mastery-categories",
      title: t("blog.post2.title"),
      excerpt: t("blog.post2.excerpt"),
      category: t("blog.categories.insights"),
      readTime: t("blog.post2.readTime"),
      date: t("blog.post2.date"),
      cover: null,
    },
    {
      id: 3,
      slug: "community-qa-launch",
      title: t("blog.post3.title"),
      excerpt: t("blog.post3.excerpt"),
      category: t("blog.categories.news"),
      readTime: t("blog.post3.readTime"),
      date: t("blog.post3.date"),
      cover: null,
    },
    {
      id: 4,
      slug: "kafka-notifications",
      title: t("blog.post4.title"),
      excerpt: t("blog.post4.excerpt"),
      category: t("blog.categories.tech"),
      readTime: t("blog.post4.readTime"),
      date: t("blog.post4.date"),
      cover: null,
    },
    {
      id: 5,
      slug: "seller-success-tips",
      title: t("blog.post5.title"),
      excerpt: t("blog.post5.excerpt"),
      category: t("blog.categories.guide"),
      readTime: t("blog.post5.readTime"),
      date: t("blog.post5.date"),
      cover: null,
    },
  ];

  const categoryColor = {
    [t("blog.categories.guide")]:
      "bg-[#6d2842]/10 text-[#6d2842] dark:bg-[#6d2842]/30 dark:text-[#e8a0b4]",
    [t("blog.categories.insights")]:
      "bg-[#508978]/10 text-[#508978] dark:bg-[#508978]/30 dark:text-[#90c5b8]",
    [t("blog.categories.news")]:
      "bg-[#b8862f]/10 text-[#b8862f] dark:bg-[#b8862f]/30 dark:text-[#d4a343]",
    [t("blog.categories.tech")]:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#1a1816]">
      <section className="bg-gradient-to-br from-[#6d2842] to-[#a64d6d] py-20 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
            <BookOpen size={26} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            {t("blog.title")}
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </motion.div>
      </section>

      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-gradient-to-br from-[#6d2842]/5 to-[#a64d6d]/5 dark:from-[#6d2842]/15 dark:to-[#a64d6d]/10 rounded-3xl border border-[#6d2842]/20 p-8 md:p-10">
          <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-3 ${categoryColor[posts[0].category]}`}>
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
            <Link to={`/blog/${posts[0].slug}`} className="flex items-center gap-2 text-sm font-semibold text-[#6d2842] dark:text-[#e8a0b4] hover:underline underline-offset-4">
              {t("blog.readArticle")} <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={`/blog/${post.slug}`} className="block bg-white dark:bg-[#2d2a27] rounded-2xl border border-[#e8e7e5] dark:border-[#4a4642] overflow-hidden hover:shadow-lg hover:border-[#6d2842]/30 transition-all group h-full">
                <div className="h-36 bg-gradient-to-br from-[#f0eeeb] to-[#e8e7e5] dark:from-[#3a3633] dark:to-[#2d2a27] flex items-center justify-center">
                  <Tag size={28} className="text-[#c4bfb9] dark:text-[#5d5955]" />
                </div>
                <div className="p-5 space-y-3">
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${categoryColor[post.category]}`}>
                    {post.category}
                  </span>
                  <h3 className="font-bold text-[#1a1816] dark:text-[#f0ece8] group-hover:text-[#6d2842] dark:group-hover:text-[#e8a0b4] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#5d5955] dark:text-[#c4bfb9] line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#8a8580] pt-1">
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
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
};

export default Blog;
