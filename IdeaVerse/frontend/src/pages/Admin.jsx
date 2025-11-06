import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api/axiosClient";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AnimatedCard from "../components/AnimatedCard";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          API.get("/api/admin/stats"),
          API.get("/api/admin/users"),
        ]);
        setDashboardData(statsRes.data);
        setUsers(usersRes.data.users || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  const { stats, recent } = dashboardData || {};

  return (
    <div className="page-transition">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 md:mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Welcome, {user.name}! Manage your IdeaVerse platform
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200/50 dark:border-purple-900/30">
        {["overview", "users", "recent"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-theme capitalize ${
              activeTab === tab
                ? "text-brand-500 dark:text-neon-400 border-b-2 border-brand-500 dark:border-neon-400"
                : "text-neutral-600 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-neon-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-brand-500 dark:border-neon-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <>
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 md:gap-8 mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl p-6 md:p-8"
                >
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {stats?.totalUsers || 0}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Total Users</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6 md:p-8"
                >
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {stats?.totalIdeas || 0}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Total Ideas</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6 md:p-8"
                >
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {stats?.totalJobs || 0}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Total Jobs</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-2xl p-6 md:p-8"
                >
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {stats?.usersByRole
                      ? Object.values(stats.usersByRole).reduce((a, b) => a + b, 0)
                      : 0}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">Active Roles</p>
                </motion.div>
              </div>

              {/* Users by Role */}
              {stats?.usersByRole && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card rounded-2xl p-6 md:p-8 mb-10"
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Users by Role
                  </h2>
                  <div className="grid md:grid-cols-4 gap-4">
                    {Object.entries(stats.usersByRole).map(([role, count]) => (
                      <div
                        key={role}
                        className="p-4 rounded-lg bg-neutral-100 dark:bg-purple-900/20"
                      >
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
                          {role}
                        </p>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                          {count}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}

          {activeTab === "users" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                All Users ({users.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200/50 dark:border-purple-900/30">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-neutral-200/50 dark:border-purple-900/30 hover:bg-neutral-100/50 dark:hover:bg-purple-900/10"
                      >
                        <td className="py-3 px-4 text-neutral-900 dark:text-white">
                          {u.name}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          {u.email}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              u.role === "admin"
                                ? "bg-purple-500/20 text-purple-400"
                                : u.role === "recruiter"
                                ? "bg-blue-500/20 text-blue-400"
                                : u.role === "freelancer"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-neutral-500/20 text-neutral-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {u._id !== user._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-red-400 hover:text-red-500 text-sm font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "recent" && (
            <div className="space-y-8">
              {/* Recent Users */}
              {recent?.users && recent.users.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Recent Users
                  </h2>
                  <div className="space-y-3">
                    {recent.users.map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-100 dark:bg-purple-900/20"
                      >
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {u.name}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {u.email} • {u.role}
                          </p>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recent Ideas */}
              {recent?.ideas && recent.ideas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Recent Ideas
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recent.ideas.map((idea) => (
                      <AnimatedCard
                        key={idea._id}
                        title={idea.title}
                        description={idea.description?.slice(0, 100)}
                        subtitle={`By ${idea.createdBy?.name || "Unknown"}`}
                        tags={idea.tags}
                        to={`/ideas/${idea._id}`}
                        meta={new Date(idea.createdAt).toLocaleDateString()}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recent Jobs */}
              {recent?.jobs && recent.jobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    Recent Jobs
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recent.jobs.map((job) => (
                      <AnimatedCard
                        key={job._id}
                        title={job.title}
                        description={job.description?.slice(0, 100)}
                        subtitle={`Posted by ${job.postedBy?.name || "Unknown"}`}
                        tags={job.skills}
                        to={`/jobs/${job._id}`}
                        meta={job.budgetRange || "No budget specified"}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

