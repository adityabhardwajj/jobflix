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
      whileHover={{ y: -2 }}
      className="job-card group"
    >
      {/* Save Button */}
      <button
        onClick={handleSave}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        <Bookmark 
          className={`w-4 h-4 transition-colors duration-200 ${
            isSaved 
              ? 'fill-blue-600 text-blue-600' 
              : 'text-gray-400 hover:text-blue-600'
          }`} 
        />
      </button>

      <div className="job-card-header">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <img
              src={job.logo}
              alt={job.company}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=' + (job.company?.charAt(0) || 'C');
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="heading-4 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {job.title}
            </h3>
            <div className="flex items-center space-x-2 text-muted">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-4">
          <span className={`badge ${getRoleColor(job.role || 'frontend')}`}>
            {formatRole(job.role)}
          </span>
        </div>
      </div>

      <div className="job-card-body">
        {/* Job Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-muted">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-700">{job.salary}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted">
            <Clock className="w-4 h-4" />
            <span>{job.type}</span>
          </div>
        </div>

        {/* Company Stats */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-6">
          <div className="flex items-center space-x-4 text-xs text-muted">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>500+ employees</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>4.8</span>
            </div>
          </div>
          <div className="text-xs text-muted">
            Posted 2 days ago
          </div>
        </div>
      </div>

      <div className="job-card-footer">
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleApply}
            className="btn btn-primary flex-1"
          >
            Apply Now
          </button>
          
          <button className="btn btn-ghost p-3">
            <Share2 className="w-4 h-4" />
          </button>
          
          <button className="btn btn-ghost p-3">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 