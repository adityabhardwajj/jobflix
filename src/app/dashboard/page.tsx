"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Bookmark, 
  FileText, 
  Settings, 
  Bell, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Download,
  Upload
} from 'lucide-react';
import Layout from '../components/Layout';
import ApplicationTracker from '../components/ApplicationTracker';

// Mock data for demonstration
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  location: 'San Francisco, CA',
  title: 'Senior Frontend Developer',
  experience: '5+ years',
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Next.js'],
  bio: 'Passionate frontend developer with expertise in modern web technologies. Love building user-friendly applications and solving complex problems.',
  savedJobs: 12,
  applications: 8,
  interviews: 3
};

const mockSavedJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    location: 'Mountain View, CA',
    salary: '$150k - $200k',
    type: 'Full-time',
    savedDate: '2024-01-15',
    status: 'active'
  },
  {
    id: 2,
    title: 'React Developer',
    company: 'Netflix',
    logo: 'https://logo.clearbit.com/netflix.com',
    location: 'Los Gatos, CA',
    salary: '$120k - $160k',
    type: 'Full-time',
    savedDate: '2024-01-10',
    status: 'active'
  },
  {
    id: 3,
    title: 'Frontend Engineer',
    company: 'Airbnb',
    logo: 'https://logo.clearbit.com/airbnb.com',
    location: 'San Francisco, CA',
    salary: '$130k - $180k',
    type: 'Full-time',
    savedDate: '2024-01-08',
    status: 'active'
  }
];

const mockApplications = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    appliedDate: '2024-01-20',
    status: 'applied',
    lastUpdate: '2024-01-22',
    nextStep: 'Technical Interview'
  },
  {
    id: 2,
    title: 'React Developer',
    company: 'Spotify',
    logo: 'https://logo.clearbit.com/spotify.com',
    appliedDate: '2024-01-18',
    status: 'interview',
    lastUpdate: '2024-01-21',
    nextStep: 'Final Round'
  },
  {
    id: 3,
    title: 'Frontend Engineer',
    company: 'Uber',
    logo: 'https://logo.clearbit.com/uber.com',
    appliedDate: '2024-01-15',
    status: 'rejected',
    lastUpdate: '2024-01-19',
    nextStep: 'Application Closed'
  },
  {
    id: 4,
    title: 'UI/UX Developer',
    company: 'Slack',
    logo: 'https://logo.clearbit.com/slack.com',
    appliedDate: '2024-01-12',
    status: 'offer',
    lastUpdate: '2024-01-20',
    nextStep: 'Review Offer'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'applied': return 'bg-blue-100 text-blue-800';
    case 'interview': return 'bg-yellow-100 text-yellow-800';
    case 'offer': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'applied': return <Clock className="w-4 h-4" />;
    case 'interview': return <Calendar className="w-4 h-4" />;
    case 'offer': return <CheckCircle className="w-4 h-4" />;
    case 'rejected': return <XCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [user, setUser] = useState(mockUser);
  const [savedJobs, setSavedJobs] = useState(mockSavedJobs);
  const [applications, setApplications] = useState(mockApplications);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Jobs', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" /> }
  ];

  const handleRemoveSavedJob = (jobId: number) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleWithdrawApplication = (applicationId: number) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your profile, saved jobs, and applications</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              { label: 'Saved Jobs', value: savedJobs.length, icon: <Bookmark className="w-6 h-6" />, color: 'bg-blue-500' },
              { label: 'Applications', value: applications.length, icon: <FileText className="w-6 h-6" />, color: 'bg-green-500' },
              { label: 'Interviews', value: applications.filter(app => app.status === 'interview').length, icon: <Calendar className="w-6 h-6" />, color: 'bg-yellow-500' },
              { label: 'Offers', value: applications.filter(app => app.status === 'offer').length, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-purple-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-300"
          >
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Profile Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{user.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.location}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Recent Applications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Applications</h3>
                    <div className="space-y-3">
                      {applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-300">
                          <div className="flex items-center space-x-3">
                            <img src={app.logo} alt={app.company} className="w-8 h-8 rounded" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{app.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{app.company}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{isEditingProfile ? 'Save' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={user.location}
                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={user.title}
                        onChange={(e) => setUser({ ...user, title: e.target.value })}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
                      <input
                        type="text"
                        value={user.experience}
                        onChange={(e) => setUser({ ...user, experience: e.target.value })}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={user.bio}
                      onChange={(e) => setUser({ ...user, bio: e.target.value })}
                      disabled={!isEditingProfile}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download Resume</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload New Resume</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'saved' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Jobs ({savedJobs.length})</h3>
                  {savedJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <img src={job.logo} alt={job.company} className="w-12 h-12 rounded" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {job.salary}
                            </span>
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Apply Now
                        </button>
                        <button
                          onClick={() => handleRemoveSavedJob(job.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'applications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <ApplicationTracker />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      </Layout>
    </Suspense>
  );
} 