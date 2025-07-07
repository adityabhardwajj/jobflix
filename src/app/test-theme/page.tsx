"use client";

import { useThemeContext } from '../contexts/ThemeContext';
import Link from 'next/link';

export default function TestThemePage() {
  const { theme, systemTheme, isDark, isLight, isSystem, mounted } = useThemeContext();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Theme Persistence Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Current Theme State
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div><strong>Theme:</strong> {theme}</div>
              <div><strong>System Theme:</strong> {systemTheme}</div>
              <div><strong>Is Dark:</strong> {isDark ? 'Yes' : 'No'}</div>
              <div><strong>Is Light:</strong> {isLight ? 'Yes' : 'No'}</div>
              <div><strong>Is System:</strong> {isSystem ? 'Yes' : 'No'}</div>
              <div><strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Storage & DOM
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div><strong>LocalStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('jobflix-theme') || 'Not set' : 'N/A'}</div>
              <div><strong>Document Class:</strong> {typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') ? 'dark' : 'light' : 'N/A'}</div>
              <div><strong>Body Class:</strong> {typeof document !== 'undefined' ? document.body.className.includes('dark') ? 'dark' : 'light' : 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Instructions
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <strong>1. Toggle Theme:</strong> Use the theme toggle in the header to switch between light and dark modes.
            </div>
            <div>
              <strong>2. Navigate Away:</strong> Click the links below to navigate to other pages.
            </div>
            <div>
              <strong>3. Return:</strong> Come back to this page and verify the theme is still the same.
            </div>
            <div>
              <strong>4. Refresh:</strong> Refresh the browser and check if the theme persists.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link 
            href="/" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
          <Link 
            href="/jobs" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Jobs
          </Link>
          <Link 
            href="/dashboard" 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/tech-news" 
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Tech News
          </Link>
        </div>
      </div>
    </div>
  );
} 