"use client";

import { useEffect } from 'react';

export function ThemeScript() {
  useEffect(() => {
    // Prevent theme flashing by setting theme immediately
    const theme = localStorage.getItem('jobflix-theme') || 'system';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const root = document.documentElement;
    
    if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  return null;
} 