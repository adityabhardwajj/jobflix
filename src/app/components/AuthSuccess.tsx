"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface AuthSuccessProps {
  isVisible: boolean;
  onClose: () => void;
  method?: string;
}

export default function AuthSuccess({ isVisible, onClose, method }: AuthSuccessProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.3 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Authentication Successful!
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {method === 'google' 
                    ? 'Successfully logged in with Google'
                    : 'Successfully logged in with phone number'
                  }
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 