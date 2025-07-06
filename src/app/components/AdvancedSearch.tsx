"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  ChevronDown,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

interface SearchFilters {
  query: string;
  location: string;
  jobType: string[];
  experience: string[];
  salary: string[];
  skills: string[];
  remote: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

const jobTypes = [
  { id: 'full-time', label: 'Full Time', icon: '💼' },
  { id: 'part-time', label: 'Part Time', icon: '⏰' },
  { id: 'contract', label: 'Contract', icon: '📋' },
  { id: 'internship', label: 'Internship', icon: '🎓' },
  { id: 'remote', label: 'Remote', icon: '🏠' },
  { id: 'hybrid', label: 'Hybrid', icon: '🏢' }
];

const experienceLevels = [
  { id: 'entry', label: 'Entry Level', icon: '🌱' },
  { id: 'junior', label: 'Junior', icon: '👨‍💻' },
  { id: 'mid', label: 'Mid Level', icon: '🚀' },
  { id: 'senior', label: 'Senior', icon: '👨‍💼' },
  { id: 'lead', label: 'Lead', icon: '🎯' },
  { id: 'executive', label: 'Executive', icon: '👑' }
];

const salaryRanges = [
  { id: '0-50k', label: '$0 - $50k', icon: '💰' },
  { id: '50k-100k', label: '$50k - $100k', icon: '💵' },
  { id: '100k-150k', label: '$100k - $150k', icon: '🏦' },
  { id: '150k-200k', label: '$150k - $200k', icon: '💎' },
  { id: '200k+', label: '$200k+', icon: '👑' }
];

const popularSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 
  'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
  'GraphQL', 'REST API', 'Machine Learning', 'DevOps', 'UI/UX'
];

const popularLocations = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX',
  'Boston, MA', 'Denver, CO', 'Chicago, IL', 'Los Angeles, CA',
  'Remote', 'Hybrid', 'London, UK', 'Berlin, Germany'
];

export default function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    jobType: [],
    experience: [],
    salary: [],
    skills: [],
    remote: false
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key as keyof SearchFilters]?.includes(value)
        ? (prev[key as keyof SearchFilters] as string[]).filter(item => item !== value)
        : [...(prev[key as keyof SearchFilters] as string[] || []), value]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: '',
      location: '',
      jobType: [],
      experience: [],
      salary: [],
      skills: [],
      remote: false
    });
    onClear();
  };

  const getActiveFiltersCount = () => {
    return (
      (filters.jobType.length > 0 ? 1 : 0) +
      (filters.experience.length > 0 ? 1 : 0) +
      (filters.salary.length > 0 ? 1 : 0) +
      (filters.skills.length > 0 ? 1 : 0) +
      (filters.remote ? 1 : 0)
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 text-lg"
            />
            {filters.query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleFilterChange('query', '')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </motion.button>
            )}
          </div>

          {/* Location Input */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full lg:w-64 pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
            />
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </motion.button>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Advanced Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                showFilters ? 'rotate-180' : ''
              }`} 
            />
          </motion.button>

          {getActiveFiltersCount() > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              Clear All
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Job Type */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Job Type
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {jobTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleArrayFilter('jobType', type.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                        filters.jobType.includes(type.id)
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Experience Level
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {experienceLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleArrayFilter('experience', level.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                        filters.experience.includes(level.id)
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{level.icon}</span>
                        <span>{level.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Salary Range
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {salaryRanges.map((range) => (
                    <motion.button
                      key={range.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleArrayFilter('salary', range.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                        filters.salary.includes(range.id)
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{range.icon}</span>
                        <span>{range.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill) => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleArrayFilter('skills', skill)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        filters.skills.includes(skill)
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Popular Locations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Popular Locations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularLocations.map((location) => (
                    <motion.button
                      key={location}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange('location', location)}
                      className="px-3 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      {location}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 