'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CompatibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export function CompatibilityBadge({ 
  score, 
  size = 'md', 
  showPercentage = true 
}: CompatibilityBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-500 bg-red-100 dark:bg-red-900/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Perfect Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    if (score >= 40) return 'Possible Match';
    return 'Low Match';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${sizeClasses[size]}
        ${getScoreColor(score)}
        border border-current/20
      `}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
    >
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-current" />
        <span className="font-semibold">
          {showPercentage ? `${score}%` : score}
        </span>
      </div>
      <span className="text-xs opacity-75">
        {getScoreLabel(score)}
      </span>
    </motion.div>
  );
}
