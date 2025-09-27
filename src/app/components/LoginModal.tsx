'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, X, Mail, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { loginSchema, phoneLoginSchema, type LoginFormData, type PhoneLoginFormData } from '@/lib/validations';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginMethod = 'email' | 'phone';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email login form
  const emailForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Phone login form
  const phoneForm = useForm<PhoneLoginFormData>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: '',
      otp: '',
    },
  });

  if (!isOpen) return null;

  const handleEmailSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Use NextAuth signIn with credentials
      const { signIn } = await import('next-auth/react');
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        emailForm.setError('root', { 
          message: 'Login failed. Please check your credentials.' 
        });
      } else {
        onClose();
        emailForm.reset();
        // Optionally redirect or show success message
        window.location.reload(); // Refresh to update auth state
      }
    } catch (error) {
      console.error('Login failed:', error);
      emailForm.setError('root', { 
        message: 'Login failed. Please check your credentials.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (data: PhoneLoginFormData) => {
    setIsLoading(true);
    try {
      if (!showOtpField) {
        // Send OTP
        console.log('Sending OTP to:', data.phone);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowOtpField(true);
      } else {
        // Verify OTP and login
        console.log('Phone login with OTP:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        onClose();
        phoneForm.reset();
        setShowOtpField(false);
      }
    } catch (error) {
      console.error('Phone login failed:', error);
      phoneForm.setError('root', { 
        message: 'Phone login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    emailForm.reset();
    phoneForm.reset();
    setShowOtpField(false);
    setShowPassword(false);
    setLoginMethod('email');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In to JobFlix
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Login Method Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              loginMethod === 'email'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              loginMethod === 'phone'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            Phone
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loginMethod === 'email' ? (
            /* Email Login Form */
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...emailForm.register('email')}
                    type="email"
                    id="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      emailForm.formState.errors.email
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...emailForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      emailForm.formState.errors.password
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {emailForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {emailForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Root Error */}
              {emailForm.formState.errors.root && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {emailForm.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            /* Phone Login Form */
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...phoneForm.register('phone')}
                    type="tel"
                    id="phone"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      phoneForm.formState.errors.phone
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="+1234567890"
                    disabled={isLoading}
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {/* OTP Field */}
              {showOtpField && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    {...phoneForm.register('otp')}
                    type="text"
                    id="otp"
                    maxLength={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      phoneForm.formState.errors.otp
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center text-lg tracking-widest`}
                    placeholder="000000"
                    disabled={isLoading}
                  />
                  {phoneForm.formState.errors.otp && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {phoneForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
              )}

              {/* Root Error */}
              {phoneForm.formState.errors.root && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {phoneForm.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {showOtpField ? 'Verifying...' : 'Sending Code...'}
                  </>
                ) : (
                  showOtpField ? 'Verify & Sign In' : 'Send Verification Code'
                )}
              </button>

              {/* Back Button */}
              {showOtpField && (
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpField(false);
                    phoneForm.setValue('otp', '');
                  }}
                  className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 px-4 transition-colors flex items-center justify-center"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Phone Number
                </button>
              )}
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  // TODO: Open registration modal
                  console.log('Open registration modal');
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}