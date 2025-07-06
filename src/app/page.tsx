"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, Search, Filter } from 'lucide-react';

// Component imports
import Layout from "./components/Layout";
import LoginModal from './components/LoginModal';
import RoleSelectionModal from './components/RoleSelectionModal';
import TechNewsSection from './components/TechNewsSection';
import JobCard from './components/JobCard';
import AuthSuccess from './components/AuthSuccess';

// Type definitions
interface Job {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  logo: string;
  accentColor: string;
  role: string;
  roleColor: string;
}

interface JobRole {
  id: string;
  name: string;
  color: string;
}

interface Location {
  id: string;
  name: string;
}

interface SalaryRange {
  id: string;
  range: string;
}

// Array of company logos
const companyLogos = [
  'https://logo.clearbit.com/google.com',
  'https://logo.clearbit.com/microsoft.com',
  'https://logo.clearbit.com/airbnb.com',
  'https://logo.clearbit.com/amazon.com',
  'https://logo.clearbit.com/netflix.com',
  'https://logo.clearbit.com/spotify.com',
];

// Array of accent colors for the top bar
const accentColors = [
  'border-blue-500',
  'border-green-500',
  'border-purple-500',
  'border-red-500',
  'border-yellow-500',
  'border-indigo-500',
];

// Generate 20 mock job listings with consistent data
const mockJobs: Job[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: `Job Title ${i + 1} (e.g., ${i % 3 === 0 ? 'Frontend Developer' : i % 3 === 1 ? 'Backend Developer' : 'UI/UX Designer'})`,
  company: `Company ${i + 1} Ltd.`,
  salary: `₹${(8 + i * 1)} - ${(15 + i * 2)} LPA`,
  location: `${i % 4 === 0 ? 'Remote' : i % 4 === 1 ? 'Mumbai' : i % 4 === 2 ? 'Bangalore' : 'Delhi'}, India`,
  type: `${i % 2 === 0 ? 'Full-time' : 'Remote'}`,
  logo: companyLogos[i % companyLogos.length],
  accentColor: accentColors[i % accentColors.length],
  role: i % 3 === 0 ? 'frontend' : i % 3 === 1 ? 'backend' : 'design',
  roleColor: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#10B981' : '#EC4899'
}));

// Define filter options with icons
const jobRoles: JobRole[] = [
  { id: '1', name: 'Frontend Developer', color: 'blue' },
  { id: '2', name: 'Backend Developer', color: 'green' },
  { id: '3', name: 'Full Stack Developer', color: 'purple' },
  { id: '4', name: 'DevOps Engineer', color: 'orange' },
  { id: '5', name: 'UI/UX Designer', color: 'pink' },
];

const locations: Location[] = [
  { id: '1', name: 'New York' },
  { id: '2', name: 'San Francisco' },
  { id: '3', name: 'London' },
  { id: '4', name: 'Berlin' },
  { id: '5', name: 'Tokyo' },
];

const salaryRanges: SalaryRange[] = [
  { id: '1', range: '$50k - $75k' },
  { id: '2', range: '$75k - $100k' },
  { id: '3', range: '$100k - $125k' },
  { id: '4', range: '$125k - $150k' },
  { id: '5', range: '$150k+' },
];

// Helper to parse salary range string
const parseSalary = (salaryStr: string): [number, number] => {
  if (salaryStr === 'All Salaries') return [0, Infinity];
  if (salaryStr === '₹20+ LPA') return [20, Infinity];
  const match = salaryStr.match(/₹(\d+)-(\d+) LPA/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2])];
  }
  return [0, Infinity];
};

export default function Home() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showAuthSuccess, setShowAuthSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
    
    // Check for authentication success in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth');
    const method = urlParams.get('method');
    
    if (authSuccess === 'success') {
      setShowAuthSuccess(true);
      setAuthMethod(method || '');
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const [minSalary, maxSalary] = parseSalary(selectedSalaries[0] || 'All Salaries');

    const results = mockJobs.filter(job => {
      const roleMatch = selectedRoles.length === 0 || selectedRoles.includes(job.role);
      const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(job.location.split(', ')[0]);
      const jobSalaryNumberMatch = job.salary.match(/₹(\d+)/);
      const jobMinSalary = jobSalaryNumberMatch ? parseInt(jobSalaryNumberMatch[1]) : 0;

      let salaryMatch = false;
      if (selectedSalaries.length === 0) {
        salaryMatch = true;
      } else if (selectedSalaries.includes('₹0-10 LPA')) {
        salaryMatch = jobMinSalary <= 10;
      } else if (selectedSalaries.includes('₹10-20 LPA')) {
        salaryMatch = jobMinSalary >= 10 && jobMinSalary <= 20;
      } else if (selectedSalaries.includes('₹20+ LPA')) {
        salaryMatch = jobMinSalary >= 20;
      }

      return roleMatch && locationMatch && salaryMatch;
    });

    setFilteredJobs(results);
  }, [selectedRoles, selectedLocations, selectedSalaries, isMounted]);

  const handleClearFilters = () => {
    setSelectedRoles([]);
    setSelectedLocations([]);
    setSelectedSalaries([]);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
          
          {/* Animated Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Find Your Dream
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Tech Job
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
          >
            Connect with top tech companies and discover opportunities that match your skills and aspirations
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => setShowRoleModal(true)}
              className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </button>
            <Link
              href="/jobs"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Browse Jobs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Find Your Perfect Match
            </h2>
            
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                  <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedRoles.map(role => (
                <span key={role} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {role}
                </span>
              ))}
              {selectedLocations.map(location => (
                <span key={location} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  {location}
                </span>
              ))}
              {selectedSalaries.map(salary => (
                <span key={salary} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  {salary}
                </span>
              ))}
              {(selectedRoles.length > 0 || selectedLocations.length > 0 || selectedSalaries.length > 0) && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Jobs
              </h2>
              <Link
                href="/jobs"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center space-x-2 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.slice(0, 6).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-8">
              Trusted by leading companies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
              {companyLogos.map((logo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex justify-center"
                >
                  <img
                    src={logo}
                    alt={`Company ${index + 1}`}
                    className="h-8 md:h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech News Section */}
      <TechNewsSection />

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}



    
    </Layout>
  );
}
