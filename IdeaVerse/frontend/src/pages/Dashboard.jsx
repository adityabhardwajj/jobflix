import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosClient";
import AnimatedCard from "../components/AnimatedCard";
import SkeletonCard from "../components/SkeletonCard";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    headline: "",
    bio: "",
    skills: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/api/users/dashboard");
        setDashboardData(data);
        setProfileForm({
          name: data.user.name || "",
          email: data.user.email || "",
          headline: data.user.headline || "",
          bio: data.user.bio || "",
          skills: (data.user.skills || []).join(", "),
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = profileForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const { data } = await API.put("/api/users/profile", {
        ...profileForm,
        skills: skillsArray,
      });
      setDashboardData((prev) => ({ ...prev, user: data }));
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="page-transition">
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-brand-500 dark:border-neon-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-transition">
        <div className="text-center py-20">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const { user: userData, stats, ideas, jobsPosted, applications } = dashboardData || {};

  return (
    <div className="page-transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 md:mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
          Welcome, {userData?.name || user.name}!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Manage your profile and track your activities
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          <div className="text-4xl mb-4">💡</div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {stats?.ideasCount || 0}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">My Ideas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {stats?.jobsPostedCount || 0}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">Jobs Posted</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {stats?.applicationsCount || 0}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">Applications</p>
        </motion.div>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 md:p-8 mb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-brand-500 dark:bg-neon-500 text-white rounded-lg hover:bg-brand-600 dark:hover:bg-neon-600 transition-theme text-sm font-medium"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-neutral-900/50 dark:bg-neutral-800/50 border border-purple-800/50 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neon-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full p-3 rounded-lg bg-neutral-900/50 dark:bg-neutral-800/50 border border-purple-800/50 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neon-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                placeholder="e.g., Full Stack Developer"
                className="w-full p-3 rounded-lg bg-neutral-900/50 dark:bg-neutral-800/50 border border-purple-800/50 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full p-3 rounded-lg bg-neutral-900/50 dark:bg-neutral-800/50 border border-purple-800/50 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={profileForm.skills}
                onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                className="w-full p-3 rounded-lg bg-neutral-900/50 dark:bg-neutral-800/50 border border-purple-800/50 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neon-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-500 dark:bg-neon-500 text-white rounded-lg hover:bg-brand-600 dark:hover:bg-neon-600 transition-theme font-medium neon-glow"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Name:</span>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {userData?.name || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Email:</span>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {userData?.email || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Role:</span>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white capitalize">
                {userData?.role || "N/A"}
              </p>
            </div>
            {userData?.headline && (
              <div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Headline:</span>
                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                  {userData.headline}
                </p>
              </div>
            )}
            {userData?.bio && (
              <div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Bio:</span>
                <p className="text-lg text-neutral-700 dark:text-neutral-300">{userData.bio}</p>
              </div>
            )}
            {userData?.skills && userData.skills.length > 0 && (
              <div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.skills.map((skill, i) => (
                    <span key={i} className="neon-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* My Ideas */}
      {ideas && ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">My Ideas</h2>
            <Link
              to="/create"
              className="px-4 py-2 bg-brand-500 dark:bg-neon-500 text-white rounded-lg hover:bg-brand-600 dark:hover:bg-neon-600 transition-theme text-sm font-medium"
            >
              Create New Idea
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.slice(0, 6).map((idea) => (
              <AnimatedCard
                key={idea._id}
                title={idea.title}
                description={idea.description?.slice(0, 150)}
                tags={idea.tags}
                to={`/ideas/${idea._id}`}
                meta={new Date(idea.createdAt).toLocaleDateString()}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* My Applications */}
      {applications && applications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            My Applications
          </h2>
          <div className="space-y-4">
            {applications.map((item, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-5 border border-purple-900/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {item.job.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      Posted by {item.job.postedBy?.name || "Unknown"}
                    </p>
                    {item.application.status && (
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          item.application.status === "hired"
                            ? "bg-green-500/20 text-green-400"
                            : item.application.status === "shortlisted"
                            ? "bg-blue-500/20 text-blue-400"
                            : item.application.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {item.application.status}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/jobs/${item.job._id}`}
                    className="text-sm text-brand-500 dark:text-neon-400 hover:underline"
                  >
                    View Job →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

