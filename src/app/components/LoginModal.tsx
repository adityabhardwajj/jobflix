'use client';

import { useState } from 'react';
import { X, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginMethod = 'email' | 'phone';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^\+?[1-9]\d{9,14}$/;
    return re.test(phone);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length === 0) {
      // Handle login logic here
      console.log('Email login:', { email, password });
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!showOtpField) {
      if (!phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(phone)) {
        newErrors.phone = 'Invalid phone number';
      }

      if (Object.keys(newErrors).length === 0) {
        setShowOtpField(true);
        // In a real app, you would send OTP here
        console.log('Sending OTP to:', phone);
      }
    } else {
      if (!otp) {
        newErrors.otp = 'OTP is required';
      } else if (otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits';
      }

      if (Object.keys(newErrors).length === 0) {
        // Handle OTP verification here
        console.log('Phone login:', { phone, otp });
        onClose();
      }
    }

    setErrors(newErrors);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Login Method Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              loginMethod === 'email'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setLoginMethod('email')}
          >
            <Mail className="w-5 h-5 mx-auto mb-2" />
            Email
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              loginMethod === 'phone'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setLoginMethod('phone')}
          >
            <Phone className="w-5 h-5 mx-auto mb-2" />
            Phone
          </button>
        </div>

        {/* Login Forms */}
        <div className="p-6">
          {loginMethod === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 9876543210"
                    disabled={showOtpField}
                  />
                  <Phone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {showOtpField && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                    <Lock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showOtpField ? 'Verify OTP' : 'Get OTP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 