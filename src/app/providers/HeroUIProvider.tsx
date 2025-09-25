'use client';

import { HeroUIProvider as NextUIProvider } from '@heroui/react';
import { useEffect, useState } from 'react';

const THEMES = ['jobflix-light', 'jobflix-dark'] as const;
type ThemeClass = (typeof THEMES)[number];

const applyThemeClass = (themeClass: ThemeClass) => {
  const root = document.documentElement;
  THEMES.forEach((theme) => root.classList.remove(theme));
  root.classList.add(themeClass);
};

export function HeroUIProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeClass>('jobflix-light');

  useEffect(() => {
    // Get initial theme
    const getTheme = (): ThemeClass => {
      try {
        const stored = localStorage.getItem('jobflix-theme') || 'system';
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        if (stored === 'dark' || (stored === 'system' && systemTheme === 'dark')) {
          return 'jobflix-dark';
        }
        return 'jobflix-light';
      } catch {
        return 'jobflix-light';
      }
    };

    const initialTheme = getTheme();
    setTheme(initialTheme);
    applyThemeClass(initialTheme);

    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = getTheme();
      setTheme(newTheme);
      applyThemeClass(newTheme);
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);

    // Listen for storage changes (theme toggle from other tabs)
    window.addEventListener('storage', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  return (
    <NextUIProvider key={theme}>
      {children}
    </NextUIProvider>
  );
}
