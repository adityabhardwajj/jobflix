import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axiosClient";
import { Link } from "react-router-dom";

export default function IdeaDetailModal({ ideaId, onClose }) {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ideaId) return;

    const fetchIdea = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get(`/api/ideas/${ideaId}`);
        setIdea(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load idea");
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (ideaId) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [ideaId, onClose]);

  if (!ideaId) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-purple-900/30">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-theme text-2xl"
              aria-label="Close"
            >
              ×
            </button>

            {loading ? (
              <div className="space-y-4">
                <div className="h-8 bg-neutral-800 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-neutral-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-neutral-800 rounded w-5/6 animate-pulse" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-400 dark:text-red-500">{error}</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-brand-500 dark:bg-neon-500 text-white rounded-lg hover:bg-brand-600 dark:hover:bg-neon-600 transition-theme"
                >
                  Close
                </button>
              </div>
            ) : idea ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 pr-8">
                  {idea.title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-6">
                  {idea.description}
                </p>

                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {idea.tags.map((tag, i) => (
                      <span key={i} className="neon-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-neutral-200/50 dark:border-purple-900/30 flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      Author:
                    </span>{" "}
                    {idea.author?.name || idea.createdBy?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500">
                    {new Date(idea.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <Link
                    to={`/ideas/${idea._id}`}
                    className="px-6 py-3 bg-brand-500 dark:bg-neon-500 text-white rounded-lg hover:bg-brand-600 dark:hover:bg-neon-600 transition-theme neon-glow font-medium"
                  >
                    Open Full Page
                  </Link>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg border border-neutral-300 dark:border-purple-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-purple-900/20 transition-theme font-medium"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

