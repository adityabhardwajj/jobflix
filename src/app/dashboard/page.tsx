"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Upload,
  LogOut,
  Search,
  Filter,
  TrendingUp,
  Target,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Plus,
  Share2,
  MoreHorizontal,
  MessageSquare,
  Building
} from 'lucide-react';
import Layout from '../components/Layout';
import ApplicationTracker from '../components/ApplicationTracker';
import UserProfile from '../components/UserProfile';
import DashboardStats from '../components/DashboardStats';
import { useToastHelpers } from '../components/Toast';
import { Progress } from '../components/ProgressBar';
import NotificationsPanel from '../components/NotificationsPanel';
import ResumeManager from '../components/ResumeManager';
import InterviewScheduler from '../components/InterviewScheduler';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'applied' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  lastUpdate: string;
  nextStep?: string;
  daysSinceApplied: number;
  logo: string;
  accentColor: string;
}

// Mock data for applications
const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    appliedDate: "2024-01-15",
    status: "reviewing",
    lastUpdate: "2024-01-18",
    nextStep: "Technical interview scheduled",
    daysSinceApplied: 3,
    logo: "https://logo.clearbit.com/google.com",
    accentColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  },
  {
    id: "2",
    jobTitle: "Backend Engineer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$90k - $110k",
    appliedDate: "2024-01-12",
    status: "interview",
    lastUpdate: "2024-01-17",
    nextStep: "Final round interview",
    daysSinceApplied: 6,
    logo: "https://logo.clearbit.com/microsoft.com",
    accentColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  {
    id: "3",
    jobTitle: "UI/UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    salary: "$80k - $100k",
    appliedDate: "2024-01-10",
    status: "applied",
    lastUpdate: "2024-01-10",
    nextStep: "Portfolio review",
    daysSinceApplied: 8,
    logo: "https://logo.clearbit.com/airbnb.com",
    accentColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
  {
    id: "4",
    jobTitle: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    salary: "$110k - $130k",
    appliedDate: "2024-01-08",
    status: "offer",
    lastUpdate: "2024-01-16",
    nextStep: "Review offer details",
    daysSinceApplied: 10,
    logo: "https://logo.clearbit.com/amazon.com",
    accentColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  },
  {
    id: "5",
    jobTitle: "Full Stack Developer",
    company: "Innovation Labs",
    location: "Seattle, WA",
    salary: "$100k - $120k",
    appliedDate: "2024-01-05",
    status: "rejected",
    lastUpdate: "2024-01-14",
    nextStep: "Apply to similar positions",
    daysSinceApplied: 13,
    logo: "https://logo.clearbit.com/netflix.com",
    accentColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [isMounted, setIsMounted] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResumeManager, setShowResumeManager] = useState(false);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(80); // Example static value
  const [userProfile, setUserProfile] = useState({
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: '',
      headline: 'Senior Frontend Developer',
      bio: 'Passionate frontend developer with expertise in modern web technologies.',
    },
    experience: {
      yearsOfExperience: '5-8',
      currentRole: 'Senior Frontend Developer',
      currentCompany: 'TechCorp Inc.',
      desiredRole: 'Lead Frontend Developer',
      desiredSalary: '$120,000 - $150,000',
      workPreference: 'hybrid',
    },
    skills: {
      technical: ['React', 'TypeScript', 'Node.js', 'Next.js'],
      soft: ['Leadership', 'Communication', 'Problem Solving'],
      languages: ['JavaScript', 'Python', 'SQL'],
    },
    education: {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Stanford University',
      graduationYear: '2019',
      gpa: '3.8',
    },
    social: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      portfolio: 'https://johndoe.dev',
      twitter: '',
    },
    preferences: {
      jobTypes: ['Full-time', 'Remote'],
      locations: ['San Francisco', 'New York', 'Remote'],
      remotePreference: 'hybrid',
      salaryRange: '$100,000 - $150,000',
      companySize: ['Startup', 'Mid-size'],
      industries: ['Technology', 'Fintech'],
    },
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Jobs', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" /> },
    { id: 'resumes', label: 'Resumes', icon: <FileText className="w-4 h-4" /> },
    { id: 'interviews', label: 'Interviews', icon: <Calendar className="w-4 h-4" /> }
  ];

  const handleRemoveSavedJob = (jobId: number) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleWithdrawApplication = (applicationId: string) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const recentApplications = applications
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 3);

  const upcomingInterviews = applications
    .filter(app => app.status === 'interview')
    .sort((a, b) => new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'interview': return <Calendar className="w-4 h-4" />;
      case 'offer': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
            className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Job Search Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your applications and stay organized in your job search
              </p>
              <div className="mt-2 w-64">
                <Progress value={profileCompletion} />
                <span className="text-xs text-gray-500 dark:text-gray-400">Profile Completion: {profileCompletion}%</span>
              </div>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowProfileModal(true)}
            >
              <User className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Under Review</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.reviewing}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Eye className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.interview}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Offers</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.offer}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="w-5 h-5 mr-2" />
                Apply to New Job
              </button>
              <button 
                className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setShowInterviewScheduler(true)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Interview
              </button>
              <button 
                className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => setShowResumeManager(true)}
              >
                <Upload className="w-5 h-5 mr-2" />
                Manage Resumes
              </button>
              <button 
                className="flex items-center justify-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="w-5 h-5 mr-2" />
                View Notifications
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Applications</h2>
                <div className="space-y-4">
                  {recentApplications.map((app) => {
                    const StatusIcon = getStatusIcon(app.status);
                    return (
                      <div key={app.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{app.jobTitle}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{app.company}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {app.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {app.salary}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.accentColor}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                          {StatusIcon}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Interviews</h2>
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No upcoming interviews</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((app) => (
                      <div key={app.id} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h3 className="font-medium text-gray-900 dark:text-white">{app.jobTitle}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{app.company}</p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                          {app.nextStep}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Application Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <ApplicationTracker />
          </motion.div>

          {showProfileModal && (
            <UserProfile
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
              onSave={(data) => {
                setUserProfile(data);
                setShowProfileModal(false);
                // Optionally update profileCompletion here
              }}
              initialData={userProfile}
            />
          )}

          {showNotifications && (
            <NotificationsPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          )}

          {showResumeManager && (
            <ResumeManager
              isOpen={showResumeManager}
              onClose={() => setShowResumeManager(false)}
            />
          )}

          {showInterviewScheduler && (
            <InterviewScheduler
              isOpen={showInterviewScheduler}
              onClose={() => setShowInterviewScheduler(false)}
            />
          )}
        </div>
      </div>
      </Layout>
    </Suspense>
  );
} 