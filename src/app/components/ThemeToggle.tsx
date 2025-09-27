'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder to avoid hydration mismatch
    return (
      <div className="flex items-center space-x-1 opacity-50">
        <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  const currentTheme = themeOptions.find(option => option.id === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <div className="relative group">
      <button
        onClick={() => {
          // Simple toggle between light and dark
          setTheme(theme === 'light' ? 'dark' : 'light');
        }}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-card hover:bg-muted border border-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg"
        title={`Current theme: ${currentTheme?.label || 'Light'}`}
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-4 w-4 text-fg" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-card border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {currentTheme?.label || 'Light'} theme
      </div>
    </div>
  );
}

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-32 h-9 bg-muted animate-pulse rounded-lg" />
    );
  }

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  const currentTheme = themeOptions.find(option => option.id === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-card hover:bg-muted border border-border rounded-lg transition-colors duration-200 min-w-[120px]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        <CurrentIcon className="h-4 w-4 text-fg" />
        <span className="text-sm text-fg">{currentTheme?.label || 'Light'}</span>
        <svg className="w-4 h-4 text-muted-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setTheme(option.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors duration-200 ${
                  theme === option.id ? 'bg-muted' : ''
                }`}
                role="option"
                aria-selected={theme === option.id}
              >
                <Icon className="h-4 w-4 text-fg" />
                <span className="text-fg">{option.label}</span>
                {theme === option.id && (
                  <svg className="w-4 h-4 text-primary ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}