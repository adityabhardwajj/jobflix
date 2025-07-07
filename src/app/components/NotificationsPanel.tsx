'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Star,
  Eye,
  FileText,
  Building,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Settings,
  Trash2
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'application_update' | 'interview_reminder' | 'new_job' | 'offer' | 'rejection' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isUrgent: boolean;
  actionUrl?: string;
  metadata?: {
    company?: string;
    jobTitle?: string;
    interviewDate?: string;
    salary?: string;
    location?: string;
  };
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "interview_reminder",
    title: "Interview Reminder",
    message: "You have an interview with Google tomorrow at 2:00 PM",
    timestamp: "2024-01-20T10:30:00Z",
    isRead: false,
    isUrgent: true,
    metadata: {
      company: "Google",
      jobTitle: "Senior Frontend Developer",
      interviewDate: "2024-01-21T14:00:00Z"
    }
  },
  {
    id: "2",
    type: "application_update",
    title: "Application Status Updated",
    message: "Your application at Netflix has moved to the next round",
    timestamp: "2024-01-20T09:15:00Z",
    isRead: false,
    isUrgent: false,
    metadata: {
      company: "Netflix",
      jobTitle: "React Developer"
    }
  },
  {
    id: "3",
    type: "new_job",
    title: "New Job Match",
    message: "A new job matching your profile is available",
    timestamp: "2024-01-20T08:45:00Z",
    isRead: true,
    isUrgent: false,
    metadata: {
      company: "Airbnb",
      jobTitle: "Frontend Engineer",
      salary: "$130k - $180k",
      location: "San Francisco, CA"
    }
  },
  {
    id: "4",
    type: "offer",
    title: "Job Offer Received",
    message: "Congratulations! You've received an offer from CloudTech Solutions",
    timestamp: "2024-01-19T16:20:00Z",
    isRead: false,
    isUrgent: true,
    metadata: {
      company: "CloudTech Solutions",
      jobTitle: "DevOps Engineer",
      salary: "$110k - $130k"
    }
  },
  {
    id: "5",
    type: "rejection",
    title: "Application Update",
    message: "Your application at Innovation Labs was not selected for the next round",
    timestamp: "2024-01-19T14:30:00Z",
    isRead: true,
    isUrgent: false,
    metadata: {
      company: "Innovation Labs",
      jobTitle: "Full Stack Developer"
    }
  },
  {
    id: "6",
    type: "system",
    title: "Profile Completion",
    message: "Complete your profile to get better job matches",
    timestamp: "2024-01-19T12:00:00Z",
    isRead: false,
    isUrgent: false
  }
];

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview_reminder': return Calendar;
      case 'application_update': return Eye;
      case 'new_job': return Star;
      case 'offer': return CheckCircle;
      case 'rejection': return AlertCircle;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'interview_reminder': return 'text-blue-600 dark:text-blue-400';
      case 'application_update': return 'text-yellow-600 dark:text-yellow-400';
      case 'new_job': return 'text-green-600 dark:text-green-400';
      case 'offer': return 'text-green-600 dark:text-green-400';
      case 'rejection': return 'text-red-600 dark:text-red-400';
      case 'system': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'interview_reminder': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'application_update': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'new_job': return 'bg-green-50 dark:bg-green-900/20';
      case 'offer': return 'bg-green-50 dark:bg-green-900/20';
      case 'rejection': return 'bg-red-50 dark:bg-red-900/20';
      case 'system': return 'bg-gray-50 dark:bg-gray-800';
      default: return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'urgent') return notification.isUrgent;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.isUrgent).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    if (onMarkAsRead) onMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    if (onMarkAllAsRead) onMarkAllAsRead();
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (onDeleteNotification) onDeleteNotification(id);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} unread, {urgentCount} urgent
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark all as read
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Mark All
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notification preferences
                  </span>
                  <button className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    Configure
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'unread', label: `Unread (${unreadCount})` },
              { value: 'urgent', label: `Urgent (${urgentCount})` }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getNotificationBg(notification.type)}`}>
                        <IconComponent className={`w-5 h-5 ${getNotificationColor(notification.type)}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-sm font-medium ${
                              !notification.isRead 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            
                            {/* Metadata */}
                            {notification.metadata && (
                              <div className="mt-2 space-y-1">
                                {notification.metadata.company && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Building className="w-3 h-3 mr-1" />
                                    {notification.metadata.company}
                                  </div>
                                )}
                                {notification.metadata.jobTitle && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {notification.metadata.jobTitle}
                                  </div>
                                )}
                                {notification.metadata.salary && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    {notification.metadata.salary}
                                  </div>
                                )}
                                {notification.metadata.location && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {notification.metadata.location}
                                  </div>
                                )}
                                {notification.metadata.interviewDate && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(notification.metadata.interviewDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="Mark as read"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{filteredNotifications.length} notifications</span>
            <button
              onClick={handleMarkAllAsRead}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPanel; 