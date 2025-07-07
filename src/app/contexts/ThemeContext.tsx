"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ThemeContextType {
  theme: string;
  systemTheme: string;
  setTheme: (theme: string) => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Ensure theme is applied to document
    const root = document.documentElement;
    const currentTheme = theme || localStorage.getItem('jobflix-theme') || 'system';
    const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mounted, theme, systemTheme]);

  const value: ThemeContextType = {
    theme: mounted ? theme || 'system' : 'system',
    systemTheme: mounted ? systemTheme || 'light' : 'light',
    setTheme,
    isDark: mounted ? (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) : false,
    isLight: mounted ? (theme === 'light' || (theme === 'system' && systemTheme === 'light')) : false,
    isSystem: mounted ? theme === 'system' : false,
    mounted
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
} 