'use client';

import { useState } from 'react';
import { X, Briefcase, Laptop } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleRoleSelect = (role: 'recruiter' | 'freelancer') => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      router.push(`/${role}-login`);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">I am a...</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Role Options */}
        <div className="p-6 space-y-4">
          {/* Recruiter Option */}
          <button
            onClick={() => handleRoleSelect('recruiter')}
            className="w-full flex items-center p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Recruiter
              </h3>
              <p className="text-sm text-gray-500">
                Post jobs and find the best talent for your company
              </p>
            </div>
          </button>

          {/* Freelancer Option */}
          <button
            onClick={() => handleRoleSelect('freelancer')}
            className="w-full flex items-center p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Laptop className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Freelancer
              </h3>
              <p className="text-sm text-gray-500">
                Find projects and showcase your skills to potential clients
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 