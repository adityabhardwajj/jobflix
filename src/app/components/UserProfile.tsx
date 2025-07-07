"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Camera,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Star,
  Award,
  Calendar,
  Building,
  Link as LinkIcon
} from 'lucide-react';

interface UserProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
    headline: string;
    bio: string;
  };
  experience: {
    yearsOfExperience: string;
    currentRole: string;
    currentCompany: string;
    desiredRole: string;
    desiredSalary: string;
    workPreference: string;
  };
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  education: {
    degree: string;
    institution: string;
    graduationYear: string;
    gpa: string;
  };
  social: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
  };
  preferences: {
    jobTypes: string[];
    locations: string[];
    remotePreference: string;
    salaryRange: string;
    companySize: string[];
    industries: string[];
  };
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserProfileData) => void;
  initialData?: UserProfileData;
}

const UserProfile: React.FC<UserProfileProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState<UserProfileData>(
    initialData || {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        avatar: '',
        headline: '',
        bio: '',
      },
      experience: {
        yearsOfExperience: '',
        currentRole: '',
        currentCompany: '',
        desiredRole: '',
        desiredSalary: '',
        workPreference: '',
      },
      skills: {
        technical: [],
        soft: [],
        languages: [],
      },
      education: {
        degree: '',
        institution: '',
        graduationYear: '',
        gpa: '',
      },
      social: {
        linkedin: '',
        github: '',
        portfolio: '',
        twitter: '',
      },
      preferences: {
        jobTypes: [],
        locations: [],
        remotePreference: '',
        salaryRange: '',
        companySize: [],
        industries: [],
      },
    }
  );

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'preferences', label: 'Preferences', icon: Award },
  ];

  const handleInputChange = (section: keyof UserProfileData, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSkillAdd = (category: keyof UserProfileData['skills'], skill: string) => {
    if (skill.trim() && !profileData.skills[category].includes(skill.trim())) {
      handleInputChange('skills', category, [...profileData.skills[category], skill.trim()]);
    }
  };

  const handleSkillRemove = (category: keyof UserProfileData['skills'], skillToRemove: string) => {
    handleInputChange('skills', category, 
      profileData.skills[category].filter(skill => skill !== skillToRemove)
    );
  };

  const handlePreferenceAdd = (category: keyof UserProfileData['preferences'], value: string) => {
    if (value.trim() && !profileData.preferences[category].includes(value.trim())) {
      handleInputChange('preferences', category, [...profileData.preferences[category], value.trim()]);
    }
  };

  const handlePreferenceRemove = (category: keyof UserProfileData['preferences'], valueToRemove: string) => {
    const current = profileData.preferences[category];
    if (Array.isArray(current)) {
      handleInputChange('preferences', category, current.filter((value: string) => value !== valueToRemove));
    } else {
      handleInputChange('preferences', category, '');
    }
  };

  const handleSave = () => {
    onSave(profileData);
    setIsEditing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {profileData.personalInfo.avatar ? (
                    <img
                      src={profileData.personalInfo.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={profileData.personalInfo.headline}
                  onChange={(e) => handleInputChange('personalInfo', 'headline', e.target.value)}
                  disabled={!isEditing}
                  className="text-xl font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 disabled:opacity-100"
                  placeholder="Professional headline"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={profileData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={profileData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={profileData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.personalInfo.location}
                  onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="City, State/Country"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.personalInfo.bio}
                  onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience
                </label>
                <select
                  value={profileData.experience.yearsOfExperience}
                  onChange={(e) => handleInputChange('experience', 'yearsOfExperience', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
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
                  Current Role
                </label>
                <input
                  type="text"
                  value={profileData.experience.currentRole}
                  onChange={(e) => handleInputChange('experience', 'currentRole', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Company
                </label>
                <input
                  type="text"
                  value={profileData.experience.currentCompany}
                  onChange={(e) => handleInputChange('experience', 'currentCompany', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Desired Role
                </label>
                <input
                  type="text"
                  value={profileData.experience.desiredRole}
                  onChange={(e) => handleInputChange('experience', 'desiredRole', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., Lead Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Desired Salary
                </label>
                <input
                  type="text"
                  value={profileData.experience.desiredSalary}
                  onChange={(e) => handleInputChange('experience', 'desiredSalary', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., $100,000 - $130,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Preference
                </label>
                <select
                  value={profileData.experience.workPreference}
                  onChange={(e) => handleInputChange('experience', 'workPreference', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select preference</option>
                  <option value="remote">Fully Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            {(['technical', 'soft', 'languages'] as const).map((category) => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {category.charAt(0).toUpperCase() + category.slice(1)} Skills
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Add ${category} skill`}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      disabled={!isEditing}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && isEditing) {
                          e.preventDefault();
                          handleSkillAdd(category, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleSkillAdd(category, input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills[category].map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleSkillRemove(category, skill)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree
                </label>
                <input
                  type="text"
                  value={profileData.education.degree}
                  onChange={(e) => handleInputChange('education', 'degree', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={profileData.education.institution}
                  onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., Stanford University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={profileData.education.graduationYear}
                  onChange={(e) => handleInputChange('education', 'graduationYear', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  value={profileData.education.gpa || ''}
                  onChange={(e) => handleInputChange('education', 'gpa', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., 3.8"
                />
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={profileData.social.linkedin}
                  onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={profileData.social.github}
                  onChange={(e) => handleInputChange('social', 'github', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  value={profileData.social.portfolio}
                  onChange={(e) => handleInputChange('social', 'portfolio', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={profileData.social.twitter}
                  onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Job Types
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add job type (e.g., Full-time, Contract)"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    disabled={!isEditing}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && isEditing) {
                        e.preventDefault();
                        handlePreferenceAdd('jobTypes', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  {isEditing && (
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handlePreferenceAdd('jobTypes', input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.preferences.jobTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-2"
                    >
                      {type}
                      {isEditing && (
                        <button
                          onClick={() => handlePreferenceRemove('jobTypes', type)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remote Preference
                </label>
                <select
                  value={profileData.preferences.remotePreference}
                  onChange={(e) => handleInputChange('preferences', 'remotePreference', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">Select preference</option>
                  <option value="remote">Fully Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={profileData.preferences.salaryRange}
                  onChange={(e) => handleInputChange('preferences', 'salaryRange', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="e.g., $80,000 - $120,000"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your professional profile</p>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile; 