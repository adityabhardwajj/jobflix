'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, ChevronDown, User, Building } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center gap-2 rounded-lg px-3 py-1 transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-100 hover:to-red-100 hover:shadow-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h1 className="text-3xl font-bold tracking-wide">
                  <span className="text-blue-600">Job</span>
                  <span className="text-red-600">flix</span>
                </h1>
              </div>
            </Link>
            
            <div className="hidden md:flex md:ml-10 space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition'
                }`}
              >
                Home
              </Link>
              <Link
                href="/jobs"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/jobs')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition'
                }`}
              >
                Jobs
              </Link>
              <Link
                href="/tech-news"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/tech-news')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition'
                }`}
              >
                Tech News
              </Link>
              <Link
                href="/chatbot"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/chatbot')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition'
                }`}
              >
                Assistant
              </Link>
              <Link
                href="/project-ideas"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/project-ideas')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition'
                }`}
              >
                Project Ideas
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Login
            </button>
            
            {/* Get Started Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-1"
              >
                <span>Get Started</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Link
                      href="/login/freelancer"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login as Freelancer
                    </Link>
                    <Link
                      href="/login/recruiter"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Login as Recruiter
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
} 