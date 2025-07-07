// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: 'jobseeker' | 'recruiter' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  jobTypes: string[];
  locations: string[];
  remotePreference: 'remote' | 'hybrid' | 'onsite';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  companySize: string[];
  industries: string[];
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  interviewReminders: boolean;
  newMessages: boolean;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  remoteType: 'remote' | 'hybrid' | 'onsite';
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  skills: string[];
  benefits: string[];
  applicationDeadline?: Date;
  status: 'active' | 'paused' | 'closed' | 'draft';
  views: number;
  applications: number;
  recruiterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  founded: number;
  location: string;
  remotePolicy: string;
  benefits: string[];
  culture: string;
  recruiterId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Application Types
export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  priority: 'low' | 'medium' | 'high';
  coverLetter?: string;
  resumeId: string;
  additionalDocuments: string[];
  answers: ApplicationAnswer[];
  notes?: string;
  appliedAt: Date;
  lastUpdated: Date;
  nextStep?: string;
  recruiterNotes?: string;
}

export interface ApplicationAnswer {
  questionId: string;
  question: string;
  answer: string;
}

// Resume Types
export interface Resume {
  id: string;
  userId: string;
  name: string;
  type: 'resume' | 'cover_letter';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  isDefault: boolean;
  isPublic: boolean;
  tags: string[];
  description?: string;
  version: string;
  downloadCount: number;
  uploadDate: Date;
  lastModified: Date;
}

// Interview Types
export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  userId: string;
  recruiterId: string;
  type: 'phone' | 'video' | 'onsite';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  date: Date;
  time: string;
  duration: number; // in minutes
  timezone: string;
  location?: string;
  meetingLink?: string;
  interviewer?: string;
  notes?: string;
  preparation?: string[];
  feedback?: InterviewFeedback;
  reminders: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewFeedback {
  rating: number;
  comments: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: 'hire' | 'maybe' | 'no_hire';
  submittedBy: string;
  submittedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'application_update' | 'interview_reminder' | 'new_job' | 'offer' | 'rejection' | 'system' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  isUrgent: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Saved Job Types
export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'applied' | 'archived';
  savedAt: Date;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'jobseeker' | 'recruiter';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Search and Filter Types
export interface JobSearchFilters {
  query?: string;
  location?: string;
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  jobType?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  companySize?: string[];
  industries?: string[];
  datePosted?: 'today' | 'week' | 'month' | 'year';
}

export interface ApplicationFilters {
  status?: string[];
  priority?: string[];
  dateApplied?: {
    from: Date;
    to: Date;
  };
  company?: string;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  key: string;
  size: number;
  type: string;
}

// Analytics Types
export interface UserAnalytics {
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
  interviewSuccessRate: number;
  averageTimeToHire: number;
  topSkills: Array<{ skill: string; count: number }>;
  applicationsByMonth: Array<{ month: string; count: number }>;
}

export interface JobAnalytics {
  views: number;
  applications: number;
  applicationRate: number;
  viewsByDay: Array<{ date: string; views: number }>;
  applicationsByDay: Array<{ date: string; applications: number }>;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Request Types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Database Types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Email Types
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  template: string;
  data: Record<string, any>;
} 