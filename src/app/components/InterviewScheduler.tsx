'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Building,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Download,
  Share2,
  X
} from 'lucide-react';

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'video' | 'phone' | 'onsite';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  interviewer?: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  preparation?: string[];
  reminders: boolean;
  applicationId: string;
}

interface InterviewSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleInterview?: (interview: Omit<Interview, 'id'>) => void;
  onUpdateInterview?: (id: string, updates: Partial<Interview>) => void;
  onCancelInterview?: (id: string) => void;
}

const mockInterviews: Interview[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "Google",
    date: "2024-01-25",
    time: "14:00",
    duration: 60,
    type: "video",
    status: "scheduled",
    interviewer: "Sarah Johnson",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    notes: "Technical interview focusing on React and system design",
    preparation: [
      "Review React hooks and performance optimization",
      "Practice system design questions",
      "Prepare questions about team culture"
    ],
    reminders: true,
    applicationId: "1"
  },
  {
    id: "2",
    jobTitle: "Backend Engineer",
    company: "Netflix",
    date: "2024-01-28",
    time: "10:00",
    duration: 45,
    type: "phone",
    status: "scheduled",
    interviewer: "Mike Chen",
    notes: "Initial screening call with hiring manager",
    preparation: [
      "Review my background and experience",
      "Prepare STAR method responses",
      "Research Netflix engineering culture"
    ],
    reminders: true,
    applicationId: "2"
  },
  {
    id: "3",
    jobTitle: "UI/UX Designer",
    company: "Airbnb",
    date: "2024-01-22",
    time: "15:30",
    duration: 90,
    type: "onsite",
    status: "completed",
    interviewer: "Lisa Wang",
    location: "Airbnb HQ, San Francisco",
    notes: "Portfolio review and design challenge",
    preparation: [
      "Prepare portfolio presentation",
      "Bring design samples",
      "Research Airbnb design principles"
    ],
    reminders: false,
    applicationId: "3"
  },
  {
    id: "4",
    jobTitle: "DevOps Engineer",
    company: "CloudTech Solutions",
    date: "2024-01-30",
    time: "11:00",
    duration: 75,
    type: "video",
    status: "scheduled",
    interviewer: "David Kim",
    meetingLink: "https://zoom.us/j/123456789",
    notes: "Final round interview with technical team",
    preparation: [
      "Review infrastructure and deployment strategies",
      "Prepare for technical deep-dive questions",
      "Research company's tech stack"
    ],
    reminders: true,
    applicationId: "4"
  }
];

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  isOpen,
  onClose,
  onScheduleInterview,
  onUpdateInterview,
  onCancelInterview
}) => {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 dark:text-blue-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'cancelled': return 'text-red-600 dark:text-red-400';
      case 'rescheduled': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'completed': return 'bg-green-100 dark:bg-green-900/20';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/20';
      case 'rescheduled': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'onsite': return MapPin;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-purple-600 dark:text-purple-400';
      case 'phone': return 'text-blue-600 dark:text-blue-400';
      case 'onsite': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const upcomingInterviews = interviews
    .filter(interview => interview.status === 'scheduled')
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

  const todayInterviews = interviews.filter(interview => 
    interview.date === new Date().toISOString().split('T')[0] && interview.status === 'scheduled'
  );

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleCancelInterview = (id: string) => {
    setInterviews(prev => 
      prev.map(interview => 
        interview.id === id 
          ? { ...interview, status: 'cancelled' as const }
          : interview
      )
    );
    if (onCancelInterview) onCancelInterview(id);
  };

  const handleCompleteInterview = (id: string) => {
    setInterviews(prev => 
      prev.map(interview => 
        interview.id === id 
          ? { ...interview, status: 'completed' as const }
          : interview
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Scheduler</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your upcoming interviews</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {viewMode === 'calendar' ? <Calendar className="w-4 h-4 mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
              {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
            </button>
            <button
              onClick={() => setShowSchedule(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Today's Interviews */}
        {todayInterviews.length > 0 && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today's Interviews ({todayInterviews.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayInterviews.map((interview) => {
                const TypeIcon = getTypeIcon(interview.type);
                return (
                  <div
                    key={interview.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className={`w-5 h-5 ${getTypeColor(interview.type)}`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatTime(interview.time)}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(interview.status)} ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {interview.jobTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {interview.company}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDuration(interview.duration)}
                      </span>
                      {interview.meetingLink && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'calendar' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar View */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calendar</h3>
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    Calendar view coming soon...
                  </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Interviews</h3>
                  <div className="space-y-4">
                    {upcomingInterviews.slice(0, 5).map((interview) => {
                      const TypeIcon = getTypeIcon(interview.type);
                      return (
                        <div
                          key={interview.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedInterview(interview);
                            setShowDetails(true);
                          }}
                        >
                          <div className={`p-2 rounded-lg ${getStatusBg(interview.status)}`}>
                            <TypeIcon className={`w-4 h-4 ${getTypeColor(interview.type)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {interview.jobTitle}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {interview.company} • {new Date(interview.date).toLocaleDateString()} at {formatTime(interview.time)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDuration(interview.duration)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Interview
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {interviews.map((interview) => {
                        const TypeIcon = getTypeIcon(interview.type);
                        return (
                          <tr
                            key={interview.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {interview.jobTitle}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {interview.company}
                                </div>
                                {interview.interviewer && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    with {interview.interviewer}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {new Date(interview.date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatTime(interview.time)} ({formatDuration(interview.duration)})
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <TypeIcon className={`w-4 h-4 mr-2 ${getTypeColor(interview.type)}`} />
                                <span className="text-sm text-gray-900 dark:text-white capitalize">
                                  {interview.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBg(interview.status)} ${getStatusColor(interview.status)}`}>
                                {interview.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedInterview(interview);
                                    setShowDetails(true);
                                  }}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                                {interview.meetingLink && (
                                  <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                  >
                                    <Video className="w-4 h-4" />
                                  </a>
                                )}
                                {interview.status === 'scheduled' && (
                                  <>
                                    <button
                                      onClick={() => handleCompleteInterview(interview.id)}
                                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleCancelInterview(interview.id)}
                                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interview Details Modal */}
        {showDetails && selectedInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Interview Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedInterview.jobTitle}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedInterview.company}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedInterview.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(selectedInterview.time)} ({formatDuration(selectedInterview.duration)})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {selectedInterview.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBg(selectedInterview.status)} ${getStatusColor(selectedInterview.status)}`}>
                        {selectedInterview.status}
                      </span>
                    </div>
                  </div>

                  {selectedInterview.interviewer && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Interviewer</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedInterview.interviewer}</p>
                    </div>
                  )}

                  {selectedInterview.location && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedInterview.location}</p>
                    </div>
                  )}

                  {selectedInterview.meetingLink && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meeting Link</p>
                      <a
                        href={selectedInterview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                      >
                        Join Meeting <ExternalLink className="w-4 h-4 inline ml-1" />
                      </a>
                    </div>
                  )}

                  {selectedInterview.notes && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {selectedInterview.notes}
                      </p>
                    </div>
                  )}

                  {selectedInterview.preparation && selectedInterview.preparation.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preparation</p>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedInterview.preparation.map((item, index) => (
                          <li key={index} className="text-gray-900 dark:text-white">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-3">
                  {selectedInterview.meetingLink && (
                    <a
                      href={selectedInterview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Join Meeting
                    </a>
                  )}
                  {selectedInterview.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => {
                          handleCompleteInterview(selectedInterview.id);
                          setShowDetails(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => {
                          handleCancelInterview(selectedInterview.id);
                          setShowDetails(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Interview
                      </button>
                    </>
                  )}
                </div>
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
      </motion.div>
    </div>
  );
};

export default InterviewScheduler; 