'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Building, DollarSign, Clock, Filter, Search, X, Bookmark, BookmarkCheck } from 'lucide-react';

interface SavedJob {
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
  savedAt: Date;
  notes?: string;
  tags?: string[];
}

interface SavedJobsManagerProps {
  className?: string;
}

export default function SavedJobsManager({ className = '' }: SavedJobsManagerProps) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'salary' | 'company'>('newest');
  const [showNotes, setShowNotes] = useState<number | null>(null);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  // Mock data - in real app, this would come from localStorage or API
  useEffect(() => {
    const mockSavedJobs: SavedJob[] = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Google",
        salary: "₹25 - 35 LPA",
        location: "Bangalore, India",
        type: "Full-time",
        logo: "https://logo.clearbit.com/google.com",
        accentColor: "border-blue-500",
        role: "frontend",
        roleColor: "#3B82F6",
        savedAt: new Date('2024-01-15'),
        notes: "Great company culture, excellent benefits",
        tags: ["React", "TypeScript", "Remote"]
      },
      {
        id: 2,
        title: "Backend Engineer",
        company: "Microsoft",
        salary: "₹20 - 30 LPA",
        location: "Hyderabad, India",
        type: "Full-time",
        logo: "https://logo.clearbit.com/microsoft.com",
        accentColor: "border-green-500",
        role: "backend",
        roleColor: "#10B981",
        savedAt: new Date('2024-01-10'),
        tags: ["Node.js", "Python", "AWS"]
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company: "Airbnb",
        salary: "₹18 - 28 LPA",
        location: "Remote",
        type: "Full-time",
        logo: "https://logo.clearbit.com/airbnb.com",
        accentColor: "border-purple-500",
        role: "design",
        roleColor: "#EC4899",
        savedAt: new Date('2024-01-08'),
        notes: "Creative team, flexible hours",
        tags: ["Figma", "Sketch", "Design Systems"]
      }
    ];
    setSavedJobs(mockSavedJobs);
    setFilteredJobs(mockSavedJobs);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = savedJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || job.role === selectedRole;
      const matchesLocation = selectedLocation === 'all' || 
                             job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesRole && matchesLocation;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.savedAt.getTime() - a.savedAt.getTime();
        case 'oldest':
          return a.savedAt.getTime() - b.savedAt.getTime();
        case 'salary':
          const aSalary = parseInt(a.salary.match(/₹(\d+)/)?.[1] || '0');
          const bSalary = parseInt(b.salary.match(/₹(\d+)/)?.[1] || '0');
          return bSalary - aSalary;
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [savedJobs, searchTerm, selectedRole, selectedLocation, sortBy]);

  const handleRemoveJob = (jobId: number) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleUpdateNotes = (jobId: number, newNotes: string) => {
    setNotes(prev => ({ ...prev, [jobId]: newNotes }));
    setSavedJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, notes: newNotes } : job
    ));
  };

  const getRoleOptions = () => {
    const roles = [...new Set(savedJobs.map(job => job.role))];
    return roles.map(role => ({
      value: role,
      label: role.charAt(0).toUpperCase() + role.slice(1)
    }));
  };

  const getLocationOptions = () => {
    const locations = [...new Set(savedJobs.map(job => job.location.split(',')[0]))];
    return locations.map(location => ({
      value: location.toLowerCase(),
      label: location
    }));
  };

  if (savedJobs.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center ${className}`}>
        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Jobs Yet</h3>
        <p className="text-gray-600 mb-6">
          Start saving jobs you're interested in to keep track of opportunities.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BookmarkCheck className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Saved Jobs</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {savedJobs.length}
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              {getRoleOptions().map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Locations</option>
              {getLocationOptions().map(location => (
                <option key={location.value} value={location.value}>{location.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary">Highest Salary</option>
              <option value="company">Company A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="divide-y divide-gray-200">
        {filteredJobs.map((job) => (
          <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg border-2 ${job.accentColor} flex items-center justify-center bg-white`}>
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full text-white"
                        style={{ backgroundColor: job.roleColor }}
                      >
                        {job.role}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    <div className="mt-3">
                      {showNotes === job.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={notes[job.id] || job.notes || ''}
                            onChange={(e) => handleUpdateNotes(job.id, e.target.value)}
                            placeholder="Add notes about this job..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowNotes(null)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setShowNotes(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowNotes(job.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {job.notes ? 'Edit Notes' : 'Add Notes'}
                          </button>
                          {job.notes && (
                            <p className="text-sm text-gray-600 italic">"{job.notes}"</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mt-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                        Apply Now
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleRemoveJob(job.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="Remove from saved"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
