'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Bookmark, MapPin, DollarSign, Calendar, Users } from 'lucide-react';
import { Job } from '@/lib/schemas';
import { VideoPreview } from '@/components/VideoPreview';
import { CompatibilityBadge } from '@/components/CompatibilityBadge';
import { NavBar } from '@/components/NavBar';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.getJob(jobId);
        if (response.success && response.data) {
          setJob(response.data);
        } else {
          toast.error('Job not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, router]);

  const handleApply = async () => {
    if (!job) return;
    
    setApplying(true);
    try {
      const response = await apiClient.applyToJob({
        jobId: job.id,
        profileId: 'user-1' // In a real app, get from auth
      });
      
      if (response.success) {
        toast.success('Application submitted successfully! 🎉');
        router.push('/');
      } else {
        toast.error(response.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying:', error);
      toast.error('Failed to apply to job');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!job) return;
    
    try {
      const response = await apiClient.saveJob({
        jobId: job.id,
        profileId: 'user-1' // In a real app, get from auth
      });
      
      if (response.success) {
        toast.success('Job saved! 💾');
      } else {
        toast.error(response.error || 'Failed to save job');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Job not found
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6"
            >
              {/* Job header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    {job.company}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <CompatibilityBadge score={job.compatibility} size="lg" />
              </div>

              {/* Video preview */}
              {job.videoUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Recruiter Preview
                  </h3>
                  <VideoPreview 
                    videoUrl={job.videoUrl} 
                    className="rounded-lg"
                  />
                </div>
              )}

              {/* Job description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Job Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Skills/Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-24"
            >
              {/* Salary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Salary Range
                </h3>
                <div className="flex items-center space-x-2 text-2xl font-bold text-green-600 dark:text-green-400">
                  <DollarSign size={24} />
                  <span>
                    ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {job.salaryRange.currency} per year
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={20} />
                  <span>{applying ? 'Applying...' : 'Apply Now'}</span>
                </motion.button>

                <motion.button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Bookmark size={20} />
                  <span>Save Job</span>
                </motion.button>
              </div>

              {/* Company info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  About {job.company}
                </h3>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Users size={16} />
                  <span>Company size: 50-200 employees</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
