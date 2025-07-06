"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handlePhoneLogin = () => {
    window.location.href = '/auth/phone-login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Animated Header */}
      <motion.div
        initial={{ backgroundColor: "rgba(255,255,255,0)", boxShadow: "0 0 #0000", backdropFilter: "blur(0px)" }}
        animate={isScrolled ? {
          backgroundColor: "rgba(255,255,255,0.7)",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
          transition: { duration: 0.3, ease: "easeInOut" }
        } : {
          backgroundColor: "rgba(255,255,255,0)",
          boxShadow: "0 0 #0000",
          backdropFilter: "blur(0px)",
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300 dark:bg-gray-900/50 dark:backdrop-blur-md"
        style={{ WebkitBackdropFilter: isScrolled ? "blur(8px)" : "blur(0px)" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Jobflix</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/jobs" className="nav-link dark:text-gray-300 dark:hover:text-white">Jobs</Link>
              <Link href="/tech-news" className="nav-link dark:text-gray-300 dark:hover:text-white">Tech News</Link>
              <Link href="/project-ideas" className="nav-link dark:text-gray-300 dark:hover:text-white">Project Ideas</Link>
              <Link href="/assistant" className="nav-link dark:text-gray-300 dark:hover:text-white">Assistant</Link>
              <Link href="/dashboard" className="nav-link dark:text-gray-300 dark:hover:text-white">Dashboard</Link>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <div className="relative" ref={loginDropdownRef}>
                <button
                  onClick={handleLoginClick}
                  className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Login
                </button>

                {/* Dropdown Menu */}
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50 transform opacity-100 scale-100 transition-all duration-200 ease-out">
                    <div className="py-1">
                      <button
                        onClick={handleGoogleLogin}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors duration-150"
                      >
                        Login with Google
                      </button>
                      <button
                        onClick={handlePhoneLogin}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors duration-150"
                      >
                        Login with Phone Number
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/signup" className="btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700">Sign up</Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-2 dark:text-gray-300 dark:hover:text-white">Jobs</Link>
                  <Link href="/tech-news" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-2 dark:text-gray-300 dark:hover:text-white">Tech News</Link>
                  <Link href="/project-ideas" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-2 dark:text-gray-300 dark:hover:text-white">Project Ideas</Link>
                  <Link href="/assistant" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-2 dark:text-gray-300 dark:hover:text-white">Assistant</Link>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="nav-link py-2 dark:text-gray-300 dark:hover:text-white">Dashboard</Link>
                </nav>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                  <div className="flex flex-col space-y-4 flex-1 ml-4">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleGoogleLogin();
                      }}
                      className="btn btn-secondary w-full text-left dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      Login with Google
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handlePhoneLogin();
                      }}
                      className="btn btn-secondary w-full text-left dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      Login with Phone Number
                    </button>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary w-full dark:bg-blue-600 dark:hover:bg-blue-700">Sign up</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Main Content */}
      <main className="flex-grow pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Jobflix</h3>
              <p className="text-sm">Your all-in-one platform for tech jobs, news, and project ideas.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
                <li><Link href="/tech-news" className="hover:text-white transition-colors">Tech News</Link></li>
                <li><Link href="/project-ideas" className="hover:text-white transition-colors">Project Ideas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/career-guides" className="hover:text-white transition-colors">Career Guides</Link></li>
                <li><Link href="/interview-tips" className="hover:text-white transition-colors">Interview Tips</Link></li>
                <li><Link href="/resume-templates" className="hover:text-white transition-colors">Resume Templates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@jobflix.com" className="hover:text-white transition-colors">aadityabhardwaj5cs@gmail.com</a></li>
                <li><a href="tel:+1234567890" className="hover:text-white transition-colors">+91 6006410085</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm">{new Date().getFullYear()} </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/cookies" className="text-sm hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
