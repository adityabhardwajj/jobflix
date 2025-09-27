'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfileSchema, UserProfile } from '@/lib/schemas';
import { NavBar } from '@/components/NavBar';
import { ProfileProgress } from '@/components/ProfileProgress';
import { apiClient } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar,
  Upload,
  Save
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<UserProfile>({
    resolver: zodResolver(UserProfileSchema)
  });

  const watchedValues = watch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.getProfile();
        if (response.success && response.data) {
          setProfile(response.data);
          reset(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: UserProfile) => {
    setSaving(true);
    try {
      const response = await apiClient.updateProfile(data);
      if (response.success && response.data) {
        setProfile(response.data);
        toast.success('Profile updated successfully! 🎉');
        router.push('/');
      } else {
        toast.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const currentSkills = watchedValues.skills || [];
    setValue('skills', [...currentSkills, '']);
  };

  const removeSkill = (index: number) => {
    const currentSkills = watchedValues.skills || [];
    setValue('skills', currentSkills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, value: string) => {
    const currentSkills = watchedValues.skills || [];
    const updatedSkills = [...currentSkills];
    updatedSkills[index] = value;
    setValue('skills', updatedSkills);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Your Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Help us find the perfect job matches for you
              </p>
            </div>

            {/* Profile Progress */}
            <ProfileProgress profile={profile} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                {/* Basic Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="mr-2" size={20} />
                    Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        {...register('title')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="e.g., Software Engineer"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="inline mr-1" size={16} />
                    Location *
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="e.g., San Francisco, CA"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Briefcase className="inline mr-1" size={16} />
                    Skills *
                  </label>
                  <div className="space-y-2">
                    {(watchedValues.skills || []).map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="Enter a skill"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSkill}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Skill
                    </button>
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                  )}
                </div>

                {/* Experience & Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      {...register('years', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                    {errors.years && (
                      <p className="text-red-500 text-sm mt-1">{errors.years.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <DollarSign className="inline mr-1" size={16} />
                      Desired Salary *
                    </label>
                    <input
                      {...register('desiredSalary', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      placeholder="e.g., 120000"
                    />
                    {errors.desiredSalary && (
                      <p className="text-red-500 text-sm mt-1">{errors.desiredSalary.message}</p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline mr-1" size={16} />
                    Availability *
                  </label>
                  <select
                    {...register('availability')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="immediate">Available immediately</option>
                    <option value="30d">Available in 30 days</option>
                    <option value="60d">Available in 60 days</option>
                  </select>
                  {errors.availability && (
                    <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
                  )}
                </div>

                {/* Resume Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Upload className="inline mr-1" size={16} />
                    Resume URL (Optional)
                  </label>
                  <input
                    {...register('resumeUrl')}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="https://example.com/resume.pdf"
                  />
                  {errors.resumeUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.resumeUrl.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={20} />
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
