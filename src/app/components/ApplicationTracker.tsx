"use client";
import React, { useState, useMemo } from 'react';
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
  Search,
  TrendingUp,
  SortAsc,
  SortDesc,
  MessageSquare,
  MoreHorizontal,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'applied' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  lastUpdate: string;
  nextStep?: string;
  notes: string;
  logo: string;
  isUrgent: boolean;
  daysSinceApplied: number;
  accentColor: string;
  priority?: 'low' | 'medium' | 'high';
  recruiterContact?: string;
  interviewDate?: string;
}

interface ApplicationTrackerProps {
  applications?: Application[];
  onUpdateApplication?: (id: string, updates: Partial<Application>) => void;
  onWithdrawApplication?: (id: string) => void;
}

const mockApplications: Application[] = [
  {
    id: "1",
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
    isUrgent: true,
    daysSinceApplied: 3,
    accentColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    priority: "high"
  },
  {
    id: "2",
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
    isUrgent: false,
    daysSinceApplied: 4,
    accentColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    priority: "medium"
  },
  {
    id: "3",
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
    isUrgent: false,
    daysSinceApplied: 6,
    accentColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    priority: "low"
  },
  {
    id: "4",
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
    isUrgent: true,
    daysSinceApplied: 2,
    accentColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    priority: "high"
  },
  {
    id: "5",
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
    isUrgent: false,
    daysSinceApplied: 7,
    accentColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    priority: "medium"
  }
];

const statusConfig = {
  applied: { 
    label: 'Applied', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    icon: Clock 
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

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications = mockApplications,
  onUpdateApplication,
  onWithdrawApplication
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'reviewing', label: 'Under Review' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Application Date' },
    { value: 'company', label: 'Company' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' }
  ];

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = 
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = (priorityOrder[a.priority || 'low'] || 0) - (priorityOrder[b.priority || 'low'] || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'reviewing': return <Eye className="w-4 h-4" />;
      case 'interview': return <MessageSquare className="w-4 h-4" />;
      case 'offer': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleStatusUpdate = (applicationId: string, newStatus: Application['status']) => {
    if (onUpdateApplication) {
      onUpdateApplication(applicationId, { status: newStatus });
    }
  };

  const handleWithdraw = (applicationId: string) => {
    if (onWithdrawApplication) {
      onWithdrawApplication(applicationId);
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your job applications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {key === 'total' ? 'Total' : key}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job title, company, location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedApplications.map((application) => (
                <motion.tr
                  key={application.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.jobTitle}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {application.location} • {application.salary}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.company}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.accentColor}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>{new Date(application.appliedDate).toLocaleDateString()}</div>
                    <div className="text-xs">{application.daysSinceApplied} days ago</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center ${getPriorityColor(application.priority)}`}>
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm capitalize">{application.priority || 'low'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleWithdraw(application.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Application Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {selectedApplication.jobTitle}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Salary</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Applied Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.slice(1).map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusUpdate(selectedApplication.id, option.value as Application['status'])}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedApplication.status === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedApplication.notes && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {selectedApplication.notes}
                    </p>
                  </div>
                )}

                {/* Next Step */}
                {selectedApplication.nextStep && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Step</p>
                    <p className="text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      {selectedApplication.nextStep}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                {selectedApplication.recruiterContact && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recruiter Contact</p>
                    <p className="text-gray-900 dark:text-white">{selectedApplication.recruiterContact}</p>
                  </div>
                )}

                {/* Interview Date */}
                {selectedApplication.interviewDate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Interview Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedApplication.interviewDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleWithdraw(selectedApplication.id)}
                className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Withdraw Application
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker; 