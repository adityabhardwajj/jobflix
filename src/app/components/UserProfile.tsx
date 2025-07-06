"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Check, Edit3, Save } from 'lucide-react';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    location: string;
    title: string;
    experience: string;
    skills: string[];
    bio: string;
  };
  onUpdate: (updatedUser: any) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function UserProfile({ user, onUpdate, isEditing, onToggleEdit }: UserProfileProps) {
  const [tempUser, setTempUser] = useState(user);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingAvatar(true);
      
      // Simulate file upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newAvatar = e.target?.result as string;
          setTempUser({ ...tempUser, avatar: newAvatar });
          setIsUploadingAvatar(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleSave = () => {
    onUpdate(tempUser);
    onToggleEdit();
  };

  const handleCancel = () => {
    setTempUser(user);
    onToggleEdit();
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !tempUser.skills.includes(skill.trim())) {
      setTempUser({
        ...tempUser,
        skills: [...tempUser.skills, skill.trim()]
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setTempUser({
      ...tempUser,
      skills: tempUser.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={onToggleEdit}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={tempUser.avatar}
                alt={tempUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mt-4">{tempUser.name}</h4>
            <p className="text-gray-600">{tempUser.title}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={tempUser.name}
                onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={tempUser.email}
                onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={tempUser.phone}
                onChange={(e) => setTempUser({ ...tempUser, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={tempUser.location}
                onChange={(e) => setTempUser({ ...tempUser, location: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={tempUser.title}
                onChange={(e) => setTempUser({ ...tempUser, title: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <input
                type="text"
                value={tempUser.experience}
                onChange={(e) => setTempUser({ ...tempUser, experience: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tempUser.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addSkill(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={tempUser.bio}
              onChange={(e) => setTempUser({ ...tempUser, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Download Resume</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload New Resume</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 