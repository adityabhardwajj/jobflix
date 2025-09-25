'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Play, Sparkles, Zap } from 'lucide-react';

interface JobFlixLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'play' | 'minimal' | 'icon-only' | 'text-only' | 'stacked';
  showText?: boolean;
  animated?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export default function JobFlixLogo({ 
  className = '', 
  size = 'md', 
  variant = 'default',
  showText = true, 
  animated = true,
  theme = 'auto'
}: JobFlixLogoProps) {
  
  const sizeClasses = {
    xs: {
      container: 'h-6',
      icon: 'w-4 h-4',
      text: 'text-sm',
      playIcon: 'w-2 h-2',
      gap: 'gap-1'
    },
    sm: {
      container: 'h-8',
      icon: 'w-6 h-6',
      text: 'text-lg',
      playIcon: 'w-3 h-3',
      gap: 'gap-2'
    },
    md: {
      container: 'h-10',
      icon: 'w-8 h-8',
      text: 'text-xl',
      playIcon: 'w-4 h-4',
      gap: 'gap-2'
    },
    lg: {
      container: 'h-12',
      icon: 'w-10 h-10',
      text: 'text-2xl',
      playIcon: 'w-5 h-5',
      gap: 'gap-3'
    },
    xl: {
      container: 'h-16',
      icon: 'w-12 h-12',
      text: 'text-3xl',
      playIcon: 'w-6 h-6',
      gap: 'gap-3'
    },
    '2xl': {
      container: 'h-20',
      icon: 'w-16 h-16',
      text: 'text-4xl',
      playIcon: 'w-8 h-8',
      gap: 'gap-4'
    }
  };

  const currentSize = sizeClasses[size];

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.02 }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: animated ? 5 : 0 },
    tap: { scale: 0.95 }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8]
    }
  };

  // Render different variants
  const renderIcon = () => {
    switch (variant) {
      case 'play':
        return (
          <motion.div
            className={`${currentSize.icon} bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
            variants={iconVariants}
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
            {animated && (
              <motion.div
                className={`absolute bottom-0 right-0 ${currentSize.playIcon} bg-success rounded-full flex items-center justify-center shadow-sm`}
                variants={pulseVariants}
                animate="animate"
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-1/2 h-1/2 text-white fill-white ml-0.5" />
              </motion.div>
            )}
          </motion.div>
        );

      case 'minimal':
        return (
          <motion.div
            className={`${currentSize.icon} bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center border border-primary/30`}
            variants={iconVariants}
            transition={{ duration: 0.3 }}
          >
            <Briefcase 
              className="w-1/2 h-1/2 text-primary" 
              strokeWidth={2}
            />
          </motion.div>
        );

      default:
        return (
          <motion.div
            className={`${currentSize.icon} bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg`}
            variants={iconVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Briefcase 
                className="w-1/2 h-1/2 text-white" 
                strokeWidth={2.5}
              />
              {animated && (
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full"
                  variants={pulseVariants}
                  animate="animate"
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        );
    }
  };

  const renderText = () => {
    if (!showText || variant === 'icon-only') return null;

    return (
      <div className={`flex ${variant === 'stacked' ? 'flex-col items-center' : 'items-center'}`}>
        <span className={`font-bold tracking-tight ${currentSize.text} bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent`}>
          Job
        </span>
        <span className={`font-bold tracking-tight ${currentSize.text} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${variant === 'stacked' ? '' : 'ml-0.5'}`}>
          Flix
        </span>
      </div>
    );
  };

  if (variant === 'text-only') {
    return (
      <motion.div
        className={`flex items-center ${className}`}
        variants={containerVariants}
        initial={animated ? "initial" : false}
        animate="animate"
        whileHover={animated ? "hover" : undefined}
        transition={{ duration: 0.2 }}
      >
        {renderText()}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex ${variant === 'stacked' ? 'flex-col' : 'items-center'} ${currentSize.gap} ${currentSize.container} ${className}`}
      variants={containerVariants}
      initial={animated ? "initial" : false}
      animate="animate"
      whileHover={animated ? "hover" : undefined}
      whileTap={animated ? "tap" : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Icon */}
      <div className="relative">
        {renderIcon()}
      </div>

      {/* Logo Text */}
      {renderText()}
    </motion.div>
  );
}

// Specialized logo variants for different use cases
export function JobFlixLogoHeader(props: Omit<JobFlixLogoProps, 'variant'>) {
  return <JobFlixLogo {...props} variant="default" size="md" />;
}

export function JobFlixLogoFooter(props: Omit<JobFlixLogoProps, 'variant'>) {
  return <JobFlixLogo {...props} variant="minimal" size="lg" />;
}

export function JobFlixLogoHero(props: Omit<JobFlixLogoProps, 'variant'>) {
  return <JobFlixLogo {...props} variant="play" size="xl" />;
}

export function JobFlixLogoFavicon(props: Omit<JobFlixLogoProps, 'variant' | 'showText'>) {
  return <JobFlixLogo {...props} variant="icon-only" showText={false} size="sm" />;
}

// Loading logo with animation
export function JobFlixLogoLoading({ size = 'lg' }: { size?: JobFlixLogoProps['size'] }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <JobFlixLogo 
        size={size} 
        variant="play" 
        animated={true}
      />
      <motion.div
        className="flex items-center gap-2 text-default-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Sparkles size={16} />
        <span className="text-sm font-medium">Loading JobFlix...</span>
      </motion.div>
    </motion.div>
  );
}
