"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { JobFlixLogoHeader } from './JobFlixLogo';
import { ThemeToggle } from "./ThemeToggle";

export default function PersistentHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Memoized scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const shouldBeScrolled = scrollY > 20;

    // Only update state if it actually changed to prevent unnecessary re-renders
    setIsScrolled((prev) =>
      prev !== shouldBeScrolled ? shouldBeScrolled : prev
    );
  }, []);

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLoginDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change and reset scroll state
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLoginDropdownOpen(false);

    // Reset scroll state to prevent glitches during route changes
    const resetScrollState = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Immediate reset
    resetScrollState();

    // Delayed reset to ensure smooth transition
    const timer = setTimeout(resetScrollState, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLoginClick = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handlePhoneLogin = () => {
    window.location.href = "/auth/phone-login";
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg shadow-xl border-b border-gray-200 dark:border-gray-700"
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <JobFlixLogoHeader size="lg" showText={true} animated={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { href: "/jobs", label: "Jobs" },
              { href: "/tech-news", label: "Tech News" },
              { href: "/project-ideas", label: "Project Ideas" },
              { href: "/assistant", label: "Assistant" },
              { href: "/dashboard", label: "Dashboard" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link group relative dark:text-gray-300 dark:hover:text-white transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                    isActiveRoute(item.href)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />

            {/* Login Dropdown */}
            <div className="relative" ref={loginDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLoginClick}
                className="btn btn-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Login
              </motion.button>

              {/* Enhanced Dropdown Menu */}
              <AnimatePresence>
                {isLoginDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50"
                  >
                    <div className="p-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-all duration-150 flex items-center space-x-3"
                      >
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            G
                          </span>
                        </div>
                        <span>Login with Google</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePhoneLogin}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-all duration-150 flex items-center space-x-3"
                      >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">📱</span>
                        </div>
                        <span>Login with Phone</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className="btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Sign up
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-2">
                {[
                  { href: "/jobs", label: "Jobs", icon: "💼" },
                  { href: "/tech-news", label: "Tech News", icon: "📰" },
                  {
                    href: "/project-ideas",
                    label: "Project Ideas",
                    icon: "💡",
                  },
                  { href: "/assistant", label: "Assistant", icon: "🤖" },
                  { href: "/dashboard", label: "Dashboard", icon: "📊" },
                ].map((item) => (
                  <motion.div
                    key={item.href}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActiveRoute(item.href)
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <ThemeToggle />
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleGoogleLogin();
                    }}
                    className="w-full btn btn-secondary text-left dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span>Login with Google</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handlePhoneLogin();
                    }}
                    className="w-full btn btn-secondary text-left dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📱</span>
                    </div>
                    <span>Login with Phone</span>
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 text-center"
                    >
                      Sign up
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
