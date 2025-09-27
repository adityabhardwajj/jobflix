'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, MapPin, DollarSign, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { Job } from '@/lib/schemas';
import { NavBar } from '@/components/NavBar';
import { CompatibilityBadge } from '@/components/CompatibilityBadge';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        // In a real app, you'd fetch saved jobs from the API
        // For demo, we'll use sample data
        const response = await apiClient.getJobs();
        if (response.success && response.data) {
          // Filter to show only "saved" jobs (demo purposes)
          setSavedJobs(response.data.slice(0, 5)); // Show first 5 as "saved"
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        toast.error('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemoveSaved = async (jobId: string) => {
    try {
      // In a real app, you'd call an API to remove from saved
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      toast.success('Removed from saved jobs');
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error('Failed to remove job');
    }
  };

  const handleApply = async (job: Job) => {
    try {
      const response = await apiClient.applyToJob({
        jobId: job.id,
        profileId: 'user-1' // In a real app, get from auth
      });
      
      if (response.success) {
        toast.success('Application submitted successfully! 🎉');
      } else {
        toast.error(response.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying:', error);
      toast.error('Failed to apply to job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Saved Jobs Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start swiping to save jobs you're interested in!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Swiping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Saved Jobs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {job.company}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <CompatibilityBadge score={job.compatibility} size="sm" />
                </div>

                {/* Salary */}
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-4">
                  <DollarSign size={16} />
                  <span className="font-semibold">
                    ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                  </span>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        +{job.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => handleApply(job)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={16} />
                    <span>Apply</span>
                  </motion.button>

                  <Link
                    href={`/details/${job.id}`}
                    className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>View</span>
                  </Link>

                  <motion.button
                    onClick={() => handleRemoveSaved(job.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
