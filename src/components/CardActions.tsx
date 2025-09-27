'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Info,
  CheckCircle,
  Bookmark
} from 'lucide-react';

interface CardActionsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  disabled?: boolean;
  className?: string;
}

export function CardActions({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disabled = false,
  className = ''
}: CardActionsProps) {
  const actions = [
    {
      id: 'skip',
      icon: X,
      label: 'Skip',
      color: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
      bgColor: 'bg-red-500',
      action: onSwipeLeft,
      keyboard: '←'
    },
    {
      id: 'save',
      icon: Bookmark,
      label: 'Save',
      color: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      bgColor: 'bg-blue-500',
      action: onSwipeUp,
      keyboard: '↑'
    },
    {
      id: 'apply',
      icon: Heart,
      label: 'Apply',
      color: 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20',
      bgColor: 'bg-green-500',
      action: onSwipeRight,
      keyboard: '→'
    },
    {
      id: 'details',
      icon: Info,
      label: 'Details',
      color: 'text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20',
      bgColor: 'bg-purple-500',
      action: onSwipeDown,
      keyboard: '↓'
    }
  ];

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <motion.button
            key={action.id}
            onClick={action.action}
            disabled={disabled}
            className={`
              relative p-4 rounded-full transition-all duration-200
              ${action.color}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              hover:scale-110 active:scale-95
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Background circle */}
            <div className={`
              absolute inset-0 rounded-full opacity-20
              ${action.bgColor}
            `} />
            
            {/* Icon */}
            <Icon size={24} className="relative z-10" />
            
            {/* Keyboard hint */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <span className="text-xs font-mono bg-gray-800 text-white px-2 py-1 rounded">
                {action.keyboard}
              </span>
            </div>
            
            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {action.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// Compact version for mobile
export function CardActionsCompact({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disabled = false,
  className = ''
}: CardActionsProps) {
  return (
    <div className={`flex items-center justify-between w-full px-4 ${className}`}>
      {/* Skip */}
      <motion.button
        onClick={onSwipeLeft}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          text-red-500 bg-red-50 dark:bg-red-900/20
          hover:bg-red-100 dark:hover:bg-red-900/30
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X size={16} />
        <span className="text-sm font-medium">Skip</span>
      </motion.button>

      {/* Save */}
      <motion.button
        onClick={onSwipeUp}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          text-blue-500 bg-blue-50 dark:bg-blue-900/20
          hover:bg-blue-100 dark:hover:bg-blue-900/30
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bookmark size={16} />
        <span className="text-sm font-medium">Save</span>
      </motion.button>

      {/* Apply */}
      <motion.button
        onClick={onSwipeRight}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          text-green-500 bg-green-50 dark:bg-green-900/20
          hover:bg-green-100 dark:hover:bg-green-900/30
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart size={16} />
        <span className="text-sm font-medium">Apply</span>
      </motion.button>

      {/* Details */}
      <motion.button
        onClick={onSwipeDown}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          text-purple-500 bg-purple-50 dark:bg-purple-900/20
          hover:bg-purple-100 dark:hover:bg-purple-900/30
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Info size={16} />
        <span className="text-sm font-medium">Details</span>
      </motion.button>
    </div>
  );
}
