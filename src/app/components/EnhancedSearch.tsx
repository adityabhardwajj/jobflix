'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  X, 
  ChevronDown,
  Sparkles,
  TrendingUp,
  Star
} from 'lucide-react';

interface SearchFilters {
  query: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  workType: string[];
  experienceLevel: string;
  company: string;
  tags: string[];
}

interface EnhancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  className?: string;
  placeholder?: string;
  showAdvancedFilters?: boolean;
}

export default function EnhancedSearch({ 
  onSearch, 
  onFiltersChange,
  className = '',
  placeholder = "Search for your dream job...",
  showAdvancedFilters = true
}: EnhancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    workType: [],
    experienceLevel: '',
    company: '',
    tags: []
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const workTypes = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
  const experienceLevels = ['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Executive'];

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      workType: prev.workType.includes(type)
        ? prev.workType.filter(t => t !== type)
        : [...prev.workType, type]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
      workType: [],
      experienceLevel: '',
      company: '',
      tags: []
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Main Search Bar */}
      <motion.div
        ref={searchRef}
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass rounded-3xl p-3 shadow-large">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                animate={{ 
                  scale: isFocused ? 1.1 : 1,
                  rotate: isFocused ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <Search className="w-5 h-5 text-gray-400" />
              </motion.div>
              
              <motion.input
                type="text"
                placeholder={placeholder}
                value={filters.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 bg-white/95 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-500 text-lg shadow-soft"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full lg:w-48 pl-12 pr-4 py-4 bg-white/95 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-500 text-lg shadow-soft"
              />
            </div>

            {/* Search Button */}
            <motion.button
              onClick={handleSearch}
              className="btn-primary flex items-center justify-center space-x-2 px-8"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </motion.button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        {showAdvancedFilters && (
          <motion.button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="mt-4 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Filter className="w-4 h-4" />
            <span>Advanced Filters</span>
            <motion.div
              animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isAdvancedOpen && showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            <div className="glass rounded-2xl p-6 shadow-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Salary Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.salaryMin}
                      onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/90 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/90 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

                {/* Work Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Work Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {workTypes.map((type) => (
                      <motion.button
                        key={type}
                        onClick={() => handleWorkTypeToggle(type)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          filters.workType.includes(type)
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 bg-white/90 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                  >
                    <option value="">Any Level</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    <Star className="w-4 h-4 inline mr-2" />
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={filters.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 bg-white/90 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {hasActiveFilters && (
                    <motion.button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      whileHover={{ x: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-4 h-4" />
                      <span>Clear All</span>
                    </motion.button>
                  )}
                </div>
                
                <motion.button
                  onClick={handleSearch}
                  className="btn-primary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Filters</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
