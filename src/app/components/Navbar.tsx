"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, ChevronDown, User, Building, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LoginModal from "./LoginModal";
import { JobFlixLogoHeader } from './JobFlixLogo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset navbar state when route changes
  useEffect(() => {
    // Close all menus
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);

    // Reset scroll state to prevent glitches
    setIsScrolled(window.scrollY > 20);

    // Force a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    // Close menus immediately
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);

    // Navigate to the new page
    router.push(path);

    // Ensure navbar state is reset after navigation
    setTimeout(() => {
      setIsScrolled(window.scrollY > 20);
    }, 50);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-xl border-b border-gray-200"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg"
      }`}
    >
      <nav className="container">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <JobFlixLogoHeader size="lg" showText={true} animated={false} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-12 space-x-8">
              <button
                onClick={() => handleNavigation("/")}
                className={`relative font-medium transition-colors duration-200 ${
                  isActive("/")
                    ? "text-jobflix-text-dark"
                    : "text-gray-600 hover:text-jobflix-text-dark"
                }`}
              >
                Home
                {isActive("/") && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jobflix-primary-green rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => handleNavigation("/jobs")}
                className={`relative font-medium transition-colors duration-200 ${
                  isActive("/jobs")
                    ? "text-jobflix-text-dark"
                    : "text-gray-600 hover:text-jobflix-text-dark"
                }`}
              >
                Jobs
                {isActive("/jobs") && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jobflix-primary-green rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => handleNavigation("/tech-news")}
                className={`relative font-medium transition-colors duration-200 ${
                  isActive("/tech-news")
                    ? "text-jobflix-text-dark"
                    : "text-gray-600 hover:text-jobflix-text-dark"
                }`}
              >
                Tech News
                {isActive("/tech-news") && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jobflix-primary-green rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => handleNavigation("/chatbot")}
                className={`relative font-medium transition-colors duration-200 ${
                  isActive("/chatbot")
                    ? "text-jobflix-text-dark"
                    : "text-gray-600 hover:text-jobflix-text-dark"
                }`}
              >
                Assistant
                {isActive("/chatbot") && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jobflix-primary-green rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => handleNavigation("/project-ideas")}
                className={`relative font-medium transition-colors duration-200 ${
                  isActive("/project-ideas")
                    ? "text-jobflix-text-dark"
                    : "text-gray-600 hover:text-jobflix-text-dark"
                }`}
              >
                Project Ideas
                {isActive("/project-ideas") && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jobflix-primary-green rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-gray-600 hover:text-jobflix-text-dark font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Login
              </button>

              {/* Get Started Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-primary text-primary-fg px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-lg bg-card shadow-xl border border-border z-50 overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation("/login/freelancer")}
                        className="flex items-center w-full px-4 py-3 text-sm text-card-fg hover:bg-muted transition-colors duration-200"
                      >
                        <User className="w-4 h-4 mr-3 text-accent" />
                        Login as Freelancer
                      </button>
                      <button
                        onClick={() => handleNavigation("/login/recruiter")}
                        className="flex items-center w-full px-4 py-3 text-sm text-card-fg hover:bg-muted transition-colors duration-200"
                      >
                        <Building className="w-4 h-4 mr-3 text-accent" />
                        Login as Recruiter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 hover:text-jobflix-text-dark" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 hover:text-jobflix-text-dark" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-card border-t border-border shadow-lg"
        >
          <div className="container py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              <button
                onClick={() => handleNavigation("/")}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive("/")
                    ? "text-card-fg bg-muted"
                    : "text-card-fg hover:text-card-fg hover:bg-muted"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("/jobs")}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive("/jobs")
                    ? "text-card-fg bg-muted"
                    : "text-card-fg hover:text-card-fg hover:bg-muted"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => handleNavigation("/tech-news")}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive("/tech-news")
                    ? "text-card-fg bg-muted"
                    : "text-card-fg hover:text-card-fg hover:bg-muted"
                }`}
              >
                Tech News
              </button>
              <button
                onClick={() => handleNavigation("/chatbot")}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive("/chatbot")
                    ? "text-card-fg bg-muted"
                    : "text-card-fg hover:text-card-fg hover:bg-muted"
                }`}
              >
                Assistant
              </button>
              <button
                onClick={() => handleNavigation("/project-ideas")}
                className={`text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive("/project-ideas")
                    ? "text-card-fg bg-muted"
                    : "text-card-fg hover:text-card-fg hover:bg-muted"
                }`}
              >
                Project Ideas
              </button>

              {/* Mobile Auth Buttons */}
              <div className="border-t border-border pt-4 mt-4">
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-card-fg hover:text-card-fg hover:bg-muted transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/login/freelancer")}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-card-fg hover:text-card-fg hover:bg-muted transition-colors duration-200 flex items-center"
                >
                  <User className="w-4 h-4 mr-3 text-accent" />
                  Login as Freelancer
                </button>
                <button
                  onClick={() => handleNavigation("/login/recruiter")}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-card-fg hover:text-card-fg hover:bg-muted transition-colors duration-200 flex items-center"
                >
                  <Building className="w-4 h-4 mr-3 text-accent" />
                  Login as Recruiter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
