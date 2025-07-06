"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Bookmark,
  Eye,
  Share2,
  SortAsc,
  Grid,
  List
} from 'lucide-react';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import AdvancedSearch from '../components/AdvancedSearch';
import { JobCardSkeleton } from '../components/LoadingSkeleton';
import { useToastHelpers } from '../components/Toast';

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
  description: string;
  requirements: string[];
  postedDate: string;
  experience: string;
  skills: string[];
  isRemote: boolean;
  isUrgent: boolean;
}

// Mock job data
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    salary: "$120,000 - $150,000",
    location: "San Francisco, CA",
    type: "Full-time",
    logo: "https://logo.clearbit.com/google.com",
    accentColor: "border-blue-500",
    role: "frontend",
    roleColor: "#3B82F6",
    description: "We're looking for a Senior Frontend Developer to join our growing team...",
    requirements: ["React", "TypeScript", "5+ years experience", "Team leadership"],
    postedDate: "2 days ago",
    experience: "Senior",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    isRemote: true,
    isUrgent: true
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "StartupXYZ",
    salary: "$90,000 - $120,000",
    location: "New York, NY",
    type: "Full-time",
    logo: "https://logo.clearbit.com/microsoft.com",
    accentColor: "border-green-500",
    role: "backend",
    roleColor: "#10B981",
    description: "Join our backend team to build scalable microservices...",
    requirements: ["Node.js", "Python", "AWS", "3+ years experience"],
    postedDate: "1 week ago",
    experience: "Mid-level",
    skills: ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
    isRemote: false,
    isUrgent: false
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    salary: "$80,000 - $110,000",
    location: "Remote",
    type: "Full-time",
    logo: "https://logo.clearbit.com/airbnb.com",
    accentColor: "border-purple-500",
    role: "design",
    roleColor: "#8B5CF6",
    description: "Create beautiful and intuitive user experiences...",
    requirements: ["Figma", "Adobe Creative Suite", "Portfolio", "2+ years experience"],
    postedDate: "3 days ago",
    experience: "Mid-level",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    isRemote: true,
    isUrgent: false
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    salary: "$100,000 - $130,000",
    location: "Austin, TX",
    type: "Full-time",
    logo: "https://logo.clearbit.com/amazon.com",
    accentColor: "border-orange-500",
    role: "devops",
    roleColor: "#F59E0B",
    description: "Build and maintain our cloud infrastructure...",
    requirements: ["AWS", "Kubernetes", "Terraform", "4+ years experience"],
    postedDate: "5 days ago",
    experience: "Senior",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
    isRemote: false,
    isUrgent: true
  },
  {
    id: 5,
    title: "Full Stack Developer",
    company: "Innovation Labs",
    salary: "$95,000 - $125,000",
    location: "Seattle, WA",
    type: "Full-time",
    logo: "https://logo.clearbit.com/netflix.com",
    accentColor: "border-red-500",
    role: "fullstack",
    roleColor: "#EF4444",
    description: "Build end-to-end solutions for our platform...",
    requirements: ["React", "Node.js", "MongoDB", "3+ years experience"],
    postedDate: "1 day ago",
    experience: "Mid-level",
    skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
    isRemote: true,
    isUrgent: false
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Analytics Pro",
    salary: "$110,000 - $140,000",
    location: "Boston, MA",
    type: "Full-time",
    logo: "https://logo.clearbit.com/spotify.com",
    accentColor: "border-indigo-500",
    role: "data",
    roleColor: "#6366F1",
    description: "Transform data into actionable insights...",
    requirements: ["Python", "Machine Learning", "SQL", "PhD preferred"],
    postedDate: "4 days ago",
    experience: "Senior",
    skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
    isRemote: false,
    isUrgent: false
  }
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const { success, error } = useToastHelpers();

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSearch = (filters: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = jobs;

      // Apply filters
      if (filters.query) {
        results = results.filter(job => 
          job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(filters.query.toLowerCase()))
        );
      }

      if (filters.location) {
        results = results.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.jobType && filters.jobType.length > 0) {
        results = results.filter(job => 
          filters.jobType.includes(job.type.toLowerCase().replace(' ', '-'))
        );
      }

      if (filters.experience && filters.experience.length > 0) {
        results = results.filter(job => 
          filters.experience.includes(job.experience.toLowerCase().replace(' ', '-'))
        );
      }

      if (filters.skills && filters.skills.length > 0) {
        results = results.filter(job => 
          job.skills.some(skill => filters.skills.includes(skill))
        );
      }

      setFilteredJobs(results);
      setLoading(false);
      success('Search completed', `Found ${results.length} jobs matching your criteria`);
    }, 500);
  };

  const handleClear = () => {
    setFilteredJobs(jobs);
    success('Filters cleared', 'Showing all available jobs');
  };

  const handleSaveJob = (jobId: number) => {
    setSavedJobs(prev => {
      const newSaved = prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      
      const isSaved = newSaved.includes(jobId);
      success(
        isSaved ? 'Job saved' : 'Job removed',
        isSaved ? 'Job added to your saved list' : 'Job removed from saved list'
      );
      
      return newSaved;
    });
  };

  const handleApplyJob = (jobId: number) => {
    success('Application submitted', 'Your application has been sent successfully!');
    // Here you would typically redirect to application form or show modal
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    let sorted = [...filteredJobs];
    
    switch (sortType) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'salary-high':
        sorted.sort((a, b) => {
          const aSalary = parseInt(a.salary.match(/\$(\d+)/)?.[1] || '0');
          const bSalary = parseInt(b.salary.match(/\$(\d+)/)?.[1] || '0');
          return bSalary - aSalary;
        });
        break;
      case 'salary-low':
        sorted.sort((a, b) => {
          const aSalary = parseInt(a.salary.match(/\$(\d+)/)?.[1] || '0');
          const bSalary = parseInt(b.salary.match(/\$(\d+)/)?.[1] || '0');
          return aSalary - bSalary;
        });
        break;
      case 'company':
        sorted.sort((a, b) => a.company.localeCompare(b.company));
        break;
    }
    
    setFilteredJobs(sorted);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover thousands of opportunities with all the information you need
            </p>
          </motion.div>

          {/* Advanced Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <AdvancedSearch onSearch={handleSearch} onClear={handleClear} />
          </motion.div>

          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
          >
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {loading ? 'Searching...' : `${filteredJobs.length} Jobs Found`}
              </h2>
              {filteredJobs.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {filteredJobs.length} results
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="recent">Most Recent</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                  <option value="company">Company Name</option>
                </select>
                <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Job Listings */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="jobs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <JobCard 
                      job={job} 
                      onSave={handleSaveJob}
                      onApply={handleApplyJob}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Results */}
          {!loading && filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or browse all available jobs
                </p>
                <button
                  onClick={handleClear}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  View All Jobs
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
} 