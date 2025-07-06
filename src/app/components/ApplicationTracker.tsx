"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'applied' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  lastUpdate: string;
  nextStep: string;
  notes: string;
  logo: string;
  isUrgent: boolean;
}

const mockApplications: Application[] = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120,000 - $150,000",
    appliedDate: "2024-01-15",
    status: "interview",
    lastUpdate: "2024-01-18",
    nextStep: "Technical interview on Jan 25th",
    notes: "Great company culture, excited about the role. Need to prepare for React/TypeScript technical questions.",
    logo: "https://logo.clearbit.com/google.com",
    isUrgent: true
  },
  {
    id: 2,
    jobTitle: "Backend Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    salary: "$90,000 - $120,000",
    appliedDate: "2024-01-12",
    status: "reviewing",
    lastUpdate: "2024-01-16",
    nextStep: "Awaiting response from hiring manager",
    notes: "Applied through referral. Company seems to be growing rapidly.",
    logo: "https://logo.clearbit.com/microsoft.com",
    isUrgent: false
  },
  {
    id: 3,
    jobTitle: "UI/UX Designer",
    company: "Design Studio",
    location: "Remote",
    salary: "$80,000 - $110,000",
    appliedDate: "2024-01-10",
    status: "applied",
    lastUpdate: "2024-01-10",
    nextStep: "Application under review",
    notes: "Remote position, great for work-life balance. Portfolio was well-received.",
    logo: "https://logo.clearbit.com/airbnb.com",
    isUrgent: false
  },
  {
    id: 4,
    jobTitle: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    salary: "$100,000 - $130,000",
    appliedDate: "2024-01-08",
    status: "offer",
    lastUpdate: "2024-01-17",
    nextStep: "Review offer details and respond by Jan 24th",
    notes: "Excellent offer! Need to negotiate benefits and start date.",
    logo: "https://logo.clearbit.com/amazon.com",
    isUrgent: true
  },
  {
    id: 5,
    jobTitle: "Full Stack Developer",
    company: "Innovation Labs",
    location: "Seattle, WA",
    salary: "$95,000 - $125,000",
    appliedDate: "2024-01-05",
    status: "rejected",
    lastUpdate: "2024-01-14",
    nextStep: "None",
    notes: "Rejected after technical interview. Need to improve system design skills.",
    logo: "https://logo.clearbit.com/netflix.com",
    isUrgent: false
  }
];

const statusConfig = {
  applied: { 
    label: 'Applied', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    icon: FileText 
  },
  reviewing: { 
    label: 'Under Review', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    icon: Clock 
  },
  interview: { 
    label: 'Interview', 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    icon: Calendar 
  },
  offer: { 
    label: 'Offer', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    icon: CheckCircle 
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    icon: XCircle 
  },
  withdrawn: { 
    label: 'Withdrawn', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    icon: AlertCircle 
  }
};

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(mockApplications);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter applications
  React.useEffect(() => {
    let filtered = applications;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, selectedStatus, searchQuery]);

  const handleStatusChange = (applicationId: number, newStatus: Application['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] }
          : app
      )
    );
  };

  const handleDeleteApplication = (applicationId: number) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => status === 'all' ? true : app.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Application Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your job applications and stay organized
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <motion.div
            key={status}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer"
            onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getStatusCount(status)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config.label}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${config.color}`}>
                <config.icon className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => setSelectedStatus('all')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total
              </p>
            </div>
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label} ({getStatusCount(status)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={application.logo}
                      alt={application.company}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=' + application.company.charAt(0);
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {application.jobTitle}
                        </h3>
                        {application.isUrgent && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{application.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{application.salary}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {application.notes}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Applied: {application.appliedDate}</span>
                        <span>Updated: {application.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application.id, e.target.value as Application['status'])}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      {Object.entries(statusConfig).map(([status, config]) => (
                        <option key={status} value={status}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingApplication(application)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteApplication(application.id)}
                      className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[application.status].color}`}>
                      {React.createElement(statusConfig[application.status].icon, { className: "w-3 h-3 mr-1" })}
                      {statusConfig[application.status].label}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Next: {application.nextStep}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* No Results */}
        {filteredApplications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedStatus !== 'all' 
                  ? 'Try adjusting your search criteria'
                  : 'Start by adding your first job application'
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {searchQuery || selectedStatus !== 'all' ? 'Clear Filters' : 'Add Application'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 