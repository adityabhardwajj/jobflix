'use client';

import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jobflix-theme') as Theme;
      if (stored) {
        setTheme(stored);
      }
    } catch {
      setTheme('system');
    }
  }, []);

  const toggleTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('jobflix-theme', newTheme);
    
    // Apply theme immediately
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = newTheme === 'system' ? systemTheme : newTheme;
    const heroUITheme = effectiveTheme === 'dark' ? 'jobflix-dark' : 'jobflix-light';
    
    document.documentElement.className = heroUITheme;
    
    // Dispatch storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'jobflix-theme',
      newValue: newTheme,
    }));
  }, []);

  const resolvedTheme = theme === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return {
    theme,
    resolvedTheme,
    setTheme: toggleTheme,
  };
}
