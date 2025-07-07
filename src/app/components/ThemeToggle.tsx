"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme, isDark, isLight, isSystem, mounted } = useThemeContext();

  const toggleTheme = () => {
    if (isSystem) {
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  const getCurrentTheme = () => {
    if (!mounted) return 'light';
    if (isSystem) return systemTheme || 'light';
    return theme || 'light';
  };

  const getThemeIcon = () => {
    const currentTheme = getCurrentTheme();
    
    switch (currentTheme) {
      case 'dark':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'light':
        return <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-700 dark:text-gray-300" />;
    }
  };

  const getThemeLabel = () => {
    const currentTheme = getCurrentTheme();
    
    switch (currentTheme) {
      case 'dark':
        return 'Switch to light mode';
      case 'light':
        return 'Switch to dark mode';
      default:
        return 'Switch theme';
    }
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={getThemeLabel()}
      title={getThemeLabel()}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: getCurrentTheme() === 'dark' ? 180 : 0,
          scale: 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative w-5 h-5"
      >
        {getThemeIcon()}
      </motion.div>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-blue-500/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Theme indicator dot */}
      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
        animate={{
          backgroundColor: getCurrentTheme() === 'dark' ? '#fbbf24' : '#3b82f6'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
} 