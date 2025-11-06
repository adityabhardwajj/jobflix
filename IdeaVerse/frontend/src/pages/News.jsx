import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosClient";
import AnimatedCard from "../components/AnimatedCard";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/api/news?q=technology&pageSize=12");
        // Handle both NewsAPI response format and direct array
        if (data.articles) {
          setNews(data.articles);
        } else if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }
      } catch (e) {
        console.error("News fetch error:", e);
        const errorMessage = e.response?.data?.message || e.message || "Failed to load news. Please try again later.";
        setError(errorMessage);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="page-transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 md:mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
          Live Tech News
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Stay updated with the latest technology news and trends
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-brand-500 dark:border-neon-500 border-t-transparent rounded-full"
          />
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 glass-card rounded-2xl p-8"
        >
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Unable to Load News
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">{error}</p>
          {error.includes("NEWSAPI_KEY") && (
            <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-sm text-left max-w-2xl mx-auto">
              <p className="font-semibold mb-2">Setup Required:</p>
              <ol className="list-decimal list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                <li>Get a free API key from <a href="https://newsapi.org/register" target="_blank" rel="noreferrer" className="text-brand-500 dark:text-neon-400 underline">newsapi.org</a></li>
                <li>Add <code className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">NEWSAPI_KEY=your_key_here</code> to <code className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">backend/.env</code></li>
                <li>Restart your backend server</li>
              </ol>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-500 dark:bg-neon-500 text-white rounded-lg hover:bg-brand-600 dark:hover:bg-neon-600 transition-theme"
          >
            Try Again
          </button>
        </motion.div>
      ) : news.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            No news available
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Check back later for the latest tech news!
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {news.map((n, idx) => (
            <motion.div
              key={n.url || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <AnimatedCard
                title={n.title || "No title"}
                subtitle={n.source?.name || n.source || "Tech News"}
                description={n.description || n.content?.substring(0, 150) || "No description available"}
                meta={n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ""}
              >
                {n.url && (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-brand-500 dark:text-neon-400 hover:text-brand-600 dark:hover:text-neon-300 font-medium mt-3 inline-block transition-theme"
                  >
                    Read more →
                  </a>
                )}
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

