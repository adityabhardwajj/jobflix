'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, User, Briefcase, Send, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

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
}

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

interface ApplicationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
  };
  experience: {
    yearsOfExperience: string;
    currentRole: string;
    currentCompany: string;
    skills: string[];
  };
  documents: {
    resume: File | null;
    coverLetter: string;
    portfolio: string;
  };
  questions: {
    whyJoin: string;
    salaryExpectation: string;
    startDate: string;
    remotePreference: string;
  };
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  job
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [applicationData, setApplicationData] = useState<ApplicationData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
    },
    experience: {
      yearsOfExperience: '',
      currentRole: '',
      currentCompany: '',
      skills: [],
    },
    documents: {
      resume: null,
      coverLetter: '',
      portfolio: '',
    },
    questions: {
      whyJoin: '',
      salaryExpectation: '',
      startDate: '',
      remotePreference: '',
    },
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Experience', icon: Briefcase },
    { id: 3, title: 'Documents', icon: FileText },
    { id: 4, title: 'Questions', icon: Send },
  ];

  const handleInputChange = (section: keyof ApplicationData, field: string, value: any) => {
    setApplicationData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('documents', 'resume', file);
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !applicationData.experience.skills.includes(skill.trim())) {
      handleInputChange('experience', 'skills', [...applicationData.experience.skills, skill.trim()]);
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    handleInputChange('experience', 'skills', 
      applicationData.experience.skills.filter(skill => skill !== skillToRemove)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      onClose();
      setCurrentStep(1);
      setIsSubmitted(false);
      setApplicationData({
        personalInfo: { firstName: '', lastName: '', email: '', phone: '', location: '' },
        experience: { yearsOfExperience: '', currentRole: '', currentCompany: '', skills: [] },
        documents: { resume: null, coverLetter: '', portfolio: '' },
        questions: { whyJoin: '', salaryExpectation: '', startDate: '', remotePreference: '' },
      });
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return applicationData.personalInfo.firstName && 
               applicationData.personalInfo.lastName && 
               applicationData.personalInfo.email;
      case 2:
        return applicationData.experience.yearsOfExperience && 
               applicationData.experience.currentRole;
      case 3:
        return applicationData.documents.resume;
      case 4:
        return applicationData.questions.whyJoin && 
               applicationData.questions.salaryExpectation;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={applicationData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={applicationData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={applicationData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={applicationData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={applicationData.personalInfo.location}
                  onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your location"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Professional Experience</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience *
                </label>
                <select
                  value={applicationData.experience.yearsOfExperience}
                  onChange={(e) => handleInputChange('experience', 'yearsOfExperience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-8">5-8 years</option>
                  <option value="8+">8+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Role *
                </label>
                <input
                  type="text"
                  value={applicationData.experience.currentRole}
                  onChange={(e) => handleInputChange('experience', 'currentRole', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Company
                </label>
                <input
                  type="text"
                  value={applicationData.experience.currentCompany}
                  onChange={(e) => handleInputChange('experience', 'currentCompany', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Skills
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill (e.g., React, Python)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleSkillAdd(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {applicationData.experience.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Documents & Portfolio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume/CV *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {applicationData.documents.resume ? (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selected: {applicationData.documents.resume.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PDF, DOC, or DOCX (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={applicationData.documents.coverLetter}
                  onChange={(e) => handleInputChange('documents', 'coverLetter', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={applicationData.documents.portfolio}
                  onChange={(e) => handleInputChange('documents', 'portfolio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Questions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why do you want to join {job?.company}? *
                </label>
                <textarea
                  value={applicationData.questions.whyJoin}
                  onChange={(e) => handleInputChange('questions', 'whyJoin', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Share your motivation for joining our team..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Expectation *
                </label>
                <input
                  type="text"
                  value={applicationData.questions.salaryExpectation}
                  onChange={(e) => handleInputChange('questions', 'salaryExpectation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g., $80,000 - $100,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Start Date
                </label>
                <input
                  type="date"
                  value={applicationData.questions.startDate}
                  onChange={(e) => handleInputChange('questions', 'startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remote Work Preference
                </label>
                <select
                  value={applicationData.questions.remotePreference}
                  onChange={(e) => handleInputChange('questions', 'remotePreference', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select preference</option>
                  <option value="remote">Fully Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Apply for {job.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Application Submitted!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for applying to {job.title} at {job.company}. We'll review your application and get back to you soon.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Application ID: #{(Math.random() * 1000000).toFixed(0)}
                  </p>
                </div>
              </motion.div>
            ) : (
              renderStep()
            )}
          </div>

          {/* Footer */}
          {!isSubmitted && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <div className="flex gap-3">
                {currentStep < steps.length ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobApplicationModal; 