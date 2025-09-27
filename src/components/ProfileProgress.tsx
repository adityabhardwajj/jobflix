'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/schemas';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileProgressProps {
  profile: UserProfile | null;
}

export function ProfileProgress({ profile }: ProfileProgressProps) {
  if (!profile) return null;

  const completion = profile.completion;
  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (completion >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getCompletionMessage = (completion: number) => {
    if (completion >= 90) return 'Excellent! Your profile is complete.';
    if (completion >= 80) return 'Great! Your profile is almost complete.';
    if (completion >= 60) return 'Good progress! A few more details will help.';
    if (completion >= 40) return 'Getting there! Complete more fields for better matches.';
    return 'Complete your profile to get better job matches.';
  };

  const missingFields = [];
  if (!profile.name) missingFields.push('Name');
  if (!profile.title) missingFields.push('Job Title');
  if (!profile.location) missingFields.push('Location');
  if (!profile.skills || profile.skills.length === 0) missingFields.push('Skills');
  if (!profile.years) missingFields.push('Years of Experience');
  if (!profile.desiredSalary) missingFields.push('Desired Salary');
  if (!profile.availability) missingFields.push('Availability');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Profile Completion
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCompletionColor(completion)}`}>
          {completion}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              completion >= 80 ? 'bg-green-500' : 
              completion >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Completion Message */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {getCompletionMessage(completion)}
      </p>

      {/* Missing Fields */}
      {missingFields.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-start space-x-2">
            <AlertCircle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Missing Information:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {missingFields.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Completed Fields */}
      {missingFields.length === 0 && (
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">All required fields completed!</span>
        </div>
      )}
    </motion.div>
  );
}
