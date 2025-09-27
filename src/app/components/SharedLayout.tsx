'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface SharedLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export default function SharedLayout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = ""
}: SharedLayoutProps) {
  return (
    <div className={`min-h-screen bg-bg text-fg flex flex-col ${className}`}>
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}


