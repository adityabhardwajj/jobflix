'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  Share2, 
  Eye,
  Building2,
  Calendar,
  Users,
  Star
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  logo: string;
  accentColor: string;
  role: string;
  roleColor: string;
}

interface JobCardProps {
  job: Job;
  onSave?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
}

export default function JobCard({ job, onSave, onApply }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = () => {
    onApply?.(job.id);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      frontend: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      backend: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      design: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      fullstack: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      devops: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[role as keyof typeof colors] || colors.frontend;
  };

  const formatRole = (role: string | undefined) => {
    if (!role) return 'Developer';
    return role.charAt(0).toUpperCase() + role.slice(1) + ' Developer';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Gradient Accent Bar */}
      <div className={`h-1 ${job.accentColor} bg-gradient-to-r from-blue-500 to-purple-600`} />
      
      {/* Save Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0.7, scale: isHovered ? 1 : 0.9 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSave}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
      >
        <Bookmark 
          className={`w-4 h-4 transition-colors duration-200 ${
            isSaved 
              ? 'fill-blue-500 text-blue-500' 
              : 'text-gray-400 hover:text-blue-500'
          }`} 
        />
      </motion.button>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <img
              src={job.logo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=' + (job.company?.charAt(0) || 'C');
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {job.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(job.role || 'frontend')}`}>
            {formatRole(job.role)}
          </span>
        </div>

        {/* Job Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{job.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">{job.salary}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{job.type}</span>
          </div>
        </div>

        {/* Company Stats */}
        <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>500+ employees</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>4.8</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Posted 2 days ago
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Apply Now
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 pointer-events-none transition-opacity duration-300"
      />
    </motion.div>
  );
} 