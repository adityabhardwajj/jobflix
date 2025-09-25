'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Play } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: 'h-8',
      icon: 'w-6 h-6',
      text: 'text-lg',
    },
    md: {
      container: 'h-10',
      icon: 'w-8 h-8',
      text: 'text-xl',
    },
    lg: {
      container: 'h-12',
      icon: 'w-10 h-10',
      text: 'text-2xl',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div
      className={`flex items-center gap-2 ${currentSize.container} ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Icon */}
      <div className="relative">
        <motion.div
          className={`${currentSize.icon} bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg`}
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <Briefcase 
              className="w-1/2 h-1/2 text-white" 
              strokeWidth={2.5}
            />
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex items-center">
          <span className={`font-bold tracking-tight ${currentSize.text} bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent`}>
            Job
          </span>
          <span className={`font-bold tracking-tight ${currentSize.text} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ml-0.5`}>
            Flix
          </span>
        </div>
      )}
    </motion.div>
  );
}

// Alternative logo with play button icon for the "Flix" theme
export function LogoWithPlay({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: 'h-8',
      icon: 'w-6 h-6',
      text: 'text-lg',
      playIcon: 'w-3 h-3',
    },
    md: {
      container: 'h-10',
      icon: 'w-8 h-8',
      text: 'text-xl',
      playIcon: 'w-4 h-4',
    },
    lg: {
      container: 'h-12',
      icon: 'w-10 h-10',
      text: 'text-2xl',
      playIcon: 'w-5 h-5',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div
      className={`flex items-center gap-2 ${currentSize.container} ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Icon with Play Button */}
      <div className="relative">
        <motion.div
          className={`${currentSize.icon} bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          
          {/* Main Icon */}
          <Briefcase 
            className="w-1/2 h-1/2 text-white relative z-10" 
            strokeWidth={2.5}
          />
          
          {/* Play Button Overlay */}
          <motion.div
            className={`absolute bottom-0 right-0 ${currentSize.playIcon} bg-success rounded-full flex items-center justify-center shadow-sm`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play className="w-1/2 h-1/2 text-white fill-white ml-0.5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex items-center">
          <span className={`font-bold tracking-tight ${currentSize.text} text-foreground`}>
            Job
          </span>
          <span className={`font-bold tracking-tight ${currentSize.text} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ml-0.5`}>
            Flix
          </span>
        </div>
      )}
    </motion.div>
  );
}
