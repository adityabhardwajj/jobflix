"use client";

import { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="jobflix-theme"
    >
      {children}
    </NextThemesProvider>
  );
} 