'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  Clock,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Building,
  Star,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';

interface DashboardStatsProps {
  applications: any[];
  savedJobs: any[];
  profileCompletion: number;
  recentActivity: any[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  applications,
  savedJobs,
  profileCompletion,
  recentActivity
}) => {
  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-blue-600 dark:text-blue-400';
      case 'reviewing': return 'text-yellow-600 dark:text-yellow-400';
      case 'interview': return 'text-purple-600 dark:text-purple-400';
      case 'offer': return 'text-green-600 dark:text-green-400';
      case 'rejected': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return Clock;
      case 'reviewing': return Eye;
      case 'interview': return MessageSquare;
      case 'offer': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const calculateSuccessRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.offer / stats.total) * 100);
  };

  const getAverageResponseTime = () => {
    // Mock calculation - in real app, calculate from actual data
    return 3.2;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +{Math.floor(Math.random() * 5) + 1} this week
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{calculateSuccessRate()}%</p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                +5% vs last month
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{getAverageResponseTime()}d</p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                Industry avg: 4.1d
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Profile Completion</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{profileCompletion}%</p>
              <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                {profileCompletion < 100 ? 'Complete your profile' : 'Profile complete!'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Application Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats).slice(1).map(([status, count], index) => {
            const StatusIcon = getStatusIcon(status);
            return (
              <div key={status} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${
                  status === 'applied' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  status === 'reviewing' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  status === 'interview' ? 'bg-purple-100 dark:bg-purple-900/20' :
                  status === 'offer' ? 'bg-green-100 dark:bg-green-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <StatusIcon className={`w-6 h-6 ${getStatusColor(status)}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`p-2 rounded-lg ${
                activity.type === 'application' ? 'bg-blue-100 dark:bg-blue-900/20' :
                activity.type === 'interview' ? 'bg-purple-100 dark:bg-purple-900/20' :
                activity.type === 'offer' ? 'bg-green-100 dark:bg-green-900/20' :
                'bg-gray-100 dark:bg-gray-600'
              }`}>
                {activity.type === 'application' && <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                {activity.type === 'interview' && <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                {activity.type === 'offer' && <Award className="w-4 h-4 text-green-600 dark:text-green-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Industries</h3>
          <div className="space-y-3">
            {['Technology', 'Healthcare', 'Finance', 'Education'].map((industry, index) => (
              <div key={industry} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{industry}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${80 - index * 15}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{80 - index * 15}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Salary Range</h3>
          <div className="space-y-3">
            {['$50k - $75k', '$75k - $100k', '$100k - $125k', '$125k+'].map((range, index) => (
              <div key={range} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{range}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${70 - index * 10}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{70 - index * 10}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats; 