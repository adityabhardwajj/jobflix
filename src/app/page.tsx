'use client';

import React, { useEffect } from 'react';
import { SwipeDeck } from '@/components/SwipeDeck';
import { NavBar } from '@/components/NavBar';
import { useSwipeStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const { hydrate } = useSwipeStore();

  useEffect(() => {
    // Initialize the app
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Swipe Your Way to Your Dream Job
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover opportunities that match your skills and preferences. 
            Swipe right to apply, left to skip, up to save, or down for details.
          </p>
        </div>
        
        <SwipeDeck />
      </main>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
          },
        }}
      />
    </div>
  );
} 