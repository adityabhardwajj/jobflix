'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, FileText, User, Briefcase, Send, CheckCircle, 
  ArrowLeft, ArrowRight, Loader2, Plus, Trash2 
} from 'lucide-react';
import {
  jobApplicationPersonalInfoSchema,
  jobApplicationExperienceSchema,
  jobApplicationDocumentsSchema,
  jobApplicationQuestionsSchema,
  type JobApplicationFormData
} from '@/lib/validations';

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

type ApplicationStep = 'personal' | 'experience' | 'documents' | 'questions';

export default function JobApplicationModal({ isOpen, onClose, job }: JobApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal Info Form
  const personalForm = useForm({
    resolver: zodResolver(jobApplicationPersonalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
    },
  });

  // Experience Form
  const experienceForm = useForm({
    resolver: zodResolver(jobApplicationExperienceSchema),
    defaultValues: {
      yearsOfExperience: '',
      currentRole: '',
      currentCompany: '',
      skills: [],
    },
  });

  // Documents Form
  const documentsForm = useForm({
    resolver: zodResolver(jobApplicationDocumentsSchema),
    defaultValues: {
      resume: undefined,
      coverLetter: '',
      portfolio: '',
    },
  });

  // Questions Form
  const questionsForm = useForm({
    resolver: zodResolver(jobApplicationQuestionsSchema),
    defaultValues: {
      whyJoin: '',
      salaryExpectation: '',
      startDate: '',
      remotePreference: '',
    },
  });

  if (!isOpen || !job) return null;

  const steps = [
    { id: 'personal', title: 'Personal Info', icon: User, form: personalForm },
    { id: 'experience', title: 'Experience', icon: Briefcase, form: experienceForm },
    { id: 'documents', title: 'Documents', icon: FileText, form: documentsForm },
    { id: 'questions', title: 'Questions', icon: Send, form: questionsForm },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[currentStepIndex];

  const handleNext = async () => {
    const isValid = await currentStepData.form.trigger();
    if (isValid) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStep(steps[currentStepIndex + 1].id as ApplicationStep);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id as ApplicationStep);
    }
  };

  const handleSubmit = async () => {
    // Validate all forms
    const [personalValid, experienceValid, documentsValid, questionsValid] = await Promise.all([
      personalForm.trigger(),
      experienceForm.trigger(),
      documentsForm.trigger(),
      questionsForm.trigger(),
    ]);

    if (!personalValid || !experienceValid || !documentsValid || !questionsValid) {
      // Go to first invalid step
      if (!personalValid) setCurrentStep('personal');
      else if (!experienceValid) setCurrentStep('experience');
      else if (!documentsValid) setCurrentStep('documents');
      else if (!questionsValid) setCurrentStep('questions');
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine all form data
      const applicationData: JobApplicationFormData = {
        personalInfo: personalForm.getValues(),
        experience: experienceForm.getValues(),
        documents: documentsForm.getValues(),
        questions: questionsForm.getValues(),
      };

      console.log('Submitting application:', applicationData);
      
      // TODO: Submit to API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Application submission failed:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
      onClose();
    setCurrentStep('personal');
      setIsSubmitted(false);
    setSkillInput('');
    personalForm.reset();
    experienceForm.reset();
    documentsForm.reset();
    questionsForm.reset();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      documentsForm.setValue('resume', file);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = experienceForm.getValues('skills');
      if (!currentSkills.includes(skillInput.trim())) {
        experienceForm.setValue('skills', [...currentSkills, skillInput.trim()]);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = experienceForm.getValues('skills');
    experienceForm.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Application Submitted!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your application for {job.title} at {job.company} has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            You'll receive a confirmation email shortly.
          </p>
        </motion.div>
      </div>
    );
  }

        return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
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
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400'
                      : isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {currentStep === 'personal' && (
              <motion.div
                key="personal"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                      {...personalForm.register('firstName')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        personalForm.formState.errors.firstName
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                      placeholder="John"
                    />
                    {personalForm.formState.errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {personalForm.formState.errors.firstName.message}
                      </p>
                    )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                      {...personalForm.register('lastName')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        personalForm.formState.errors.lastName
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                      placeholder="Doe"
                    />
                    {personalForm.formState.errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {personalForm.formState.errors.lastName.message}
                      </p>
                    )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                </label>
                <input
                      {...personalForm.register('email')}
                  type="email"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        personalForm.formState.errors.email
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                      placeholder="john@example.com"
                    />
                    {personalForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {personalForm.formState.errors.email.message}
                      </p>
                    )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                </label>
                <input
                      {...personalForm.register('phone')}
                  type="tel"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        personalForm.formState.errors.phone
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                      placeholder="+1234567890"
                    />
                    {personalForm.formState.errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {personalForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
              </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                </label>
                <input
                    {...personalForm.register('location')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      personalForm.formState.errors.location
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    placeholder="San Francisco, CA"
                  />
                  {personalForm.formState.errors.location && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {personalForm.formState.errors.location.message}
                    </p>
                  )}
            </div>
          </motion.div>
            )}

            {currentStep === 'experience' && (
          <motion.div
                key="experience"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Professional Experience
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience *
                </label>
                <select
                      {...experienceForm.register('yearsOfExperience')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        experienceForm.formState.errors.yearsOfExperience
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                    >
                      <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                </select>
                    {experienceForm.formState.errors.yearsOfExperience && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {experienceForm.formState.errors.yearsOfExperience.message}
                      </p>
                    )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Role *
                </label>
                <input
                      {...experienceForm.register('currentRole')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        experienceForm.formState.errors.currentRole
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                      placeholder="Senior Software Engineer"
                    />
                    {experienceForm.formState.errors.currentRole && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {experienceForm.formState.errors.currentRole.message}
                      </p>
                    )}
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Company *
                </label>
                <input
                    {...experienceForm.register('currentCompany')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      experienceForm.formState.errors.currentCompany
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    placeholder="Tech Corp Inc."
                  />
                  {experienceForm.formState.errors.currentCompany && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {experienceForm.formState.errors.currentCompany.message}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills *
                </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {experienceForm.watch('skills').map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {experienceForm.formState.errors.skills && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {experienceForm.formState.errors.skills.message}
                    </p>
                  )}
            </div>
          </motion.div>
            )}

            {currentStep === 'documents' && (
          <motion.div
                key="documents"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Documents & Portfolio
                </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume * (PDF or Word, max 5MB)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      documentsForm.formState.errors.resume
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {documentsForm.watch('resume')?.name || 'Click to upload your resume'}
                    </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                  {documentsForm.formState.errors.resume && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {documentsForm.formState.errors.resume.message}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter (Optional)
                </label>
                <textarea
                    {...documentsForm.register('coverLetter')}
                  rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      documentsForm.formState.errors.coverLetter
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                  placeholder="Tell us why you're interested in this position..."
                />
                  {documentsForm.formState.errors.coverLetter && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {documentsForm.formState.errors.coverLetter.message}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio URL (Optional)
                </label>
                <input
                    {...documentsForm.register('portfolio')}
                  type="url"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      documentsForm.formState.errors.portfolio
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    placeholder="https://yourportfolio.com"
                  />
                  {documentsForm.formState.errors.portfolio && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {documentsForm.formState.errors.portfolio.message}
                    </p>
                  )}
            </div>
          </motion.div>
            )}

            {currentStep === 'questions' && (
          <motion.div
                key="questions"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Additional Questions
                </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Why do you want to join {job.company}? *
                </label>
                <textarea
                    {...questionsForm.register('whyJoin')}
                  rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      questionsForm.formState.errors.whyJoin
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                    placeholder="Tell us what excites you about this opportunity..."
                  />
                  {questionsForm.formState.errors.whyJoin && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {questionsForm.formState.errors.whyJoin.message}
                    </p>
                  )}
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Expectation *
                </label>
                <input
                      {...questionsForm.register('salaryExpectation')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        questionsForm.formState.errors.salaryExpectation
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                      placeholder="$120,000 - $150,000"
                    />
                    {questionsForm.formState.errors.salaryExpectation && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {questionsForm.formState.errors.salaryExpectation.message}
                      </p>
                    )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Start Date *
                </label>
                <input
                      {...questionsForm.register('startDate')}
                  type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        questionsForm.formState.errors.startDate
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white`}
                    />
                    {questionsForm.formState.errors.startDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {questionsForm.formState.errors.startDate.message}
                      </p>
                    )}
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Remote Work Preference *
                </label>
                <select
                    {...questionsForm.register('remotePreference')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      questionsForm.formState.errors.remotePreference
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white`}
                >
                  <option value="">Select preference</option>
                  <option value="remote">Fully Remote</option>
                    <option value="hybrid">Hybrid (2-3 days in office)</option>
                  <option value="onsite">On-site</option>
                    <option value="flexible">Flexible</option>
                </select>
                  {questionsForm.formState.errors.remotePreference && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {questionsForm.formState.errors.remotePreference.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
          <div className="flex items-center space-x-2">
            {currentStepIndex < steps.length - 1 ? (
                  <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                    <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
      </motion.div>
    </div>
  );
}