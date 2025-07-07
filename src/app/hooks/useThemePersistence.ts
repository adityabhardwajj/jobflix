"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

export function useThemePersistence() {
  const { theme, setTheme, systemTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    if (!mounted) return;
    
    const storedTheme = localStorage.getItem('jobflix-theme');
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [mounted, theme, setTheme]);

  // Persist theme changes to localStorage
  useEffect(() => {
    if (!mounted || !theme) return;
    
    localStorage.setItem('jobflix-theme', theme);
    
    // Also update the document class immediately
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, systemTheme, mounted]);

  // Handle route changes - ensure theme persists
  useEffect(() => {
    if (!mounted) return;
    
    const storedTheme = localStorage.getItem('jobflix-theme');
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [pathname, mounted, theme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme, mounted]);

  // Force theme application on mount
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const currentTheme = theme || localStorage.getItem('jobflix-theme') || 'system';
    const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mounted, theme, systemTheme]);

  return {
    theme: mounted ? theme : 'light',
    systemTheme: mounted ? systemTheme : 'light',
    setTheme,
    isDark: mounted ? (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) : false,
    isLight: mounted ? (theme === 'light' || (theme === 'system' && systemTheme === 'light')) : false,
    isSystem: mounted ? theme === 'system' : false,
    mounted
  };
} 