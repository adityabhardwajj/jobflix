import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { CustomError } from '../middleware/errorHandler';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

const router = Router();

// Mock user database (replace with real database)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    headline: 'Senior Frontend Developer',
    bio: 'Passionate developer with 5+ years of experience',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: '',
    isEmailVerified: true,
    isPhoneVerified: false,
    role: 'jobseeker',
    status: 'active',
    preferences: {
      jobTypes: ['Full-time', 'Remote'],
      locations: ['San Francisco', 'New York', 'Remote'],
      remotePreference: 'hybrid',
      salaryRange: { min: 100000, max: 150000, currency: 'USD' },
      companySize: ['Startup', 'Mid-size'],
      industries: ['Technology', 'Fintech'],
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
        jobAlerts: true,
        applicationUpdates: true,
        interviewReminders: true,
        newMessages: true
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock password hash (in real app, this would be stored in database)
const mockPasswordHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password"

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env['JWT_SECRET'] || 'fallback-secret',
    { expiresIn: process.env['JWT_EXPIRES_IN'] || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env['JWT_REFRESH_SECRET'] || 'refresh-secret',
    { expiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '30d' }
  );
};

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('role').isIn(['jobseeker', 'recruiter'])
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation error', 400);
  }

  const { email, password, firstName, lastName, role }: RegisterRequest = req.body;

  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    throw new CustomError('User already exists', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email,
    firstName,
    lastName,
    isEmailVerified: false,
    isPhoneVerified: false,
    role,
    status: 'active',
    preferences: {
      jobTypes: [],
      locations: [],
      remotePreference: 'hybrid',
      salaryRange: { min: 0, max: 0, currency: 'USD' },
      companySize: [],
      industries: [],
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
        jobAlerts: true,
        applicationUpdates: true,
        interviewReminders: true,
        newMessages: true
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add to mock database
  mockUsers.push(newUser);

  // Generate tokens
  const token = generateToken(newUser.id);
  const refreshToken = generateRefreshToken(newUser.id);

  const response: AuthResponse = {
    user: newUser,
    token,
    refreshToken
  };

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: response
  });
}));

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation error', 400);
  }

  const { email, password }: LoginRequest = req.body;

  // Find user
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new CustomError('Invalid credentials', 401);
  }

  // Check password (using mock hash for demo)
  const isPasswordValid = await bcrypt.compare(password, mockPasswordHash);
  if (!isPasswordValid) {
    throw new CustomError('Invalid credentials', 401);
  }

  // Check if user is active
  if (user.status !== 'active') {
    throw new CustomError('Account is not active', 401);
  }

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const response: AuthResponse = {
    user,
    token,
    refreshToken
  };

  res.json({
    success: true,
    message: 'Login successful',
    data: response
  });
}));

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', [
  body('refreshToken').notEmpty()
], asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new CustomError('Refresh token is required', 400);
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env['JWT_REFRESH_SECRET'] || 'refresh-secret') as any;
    
    // Find user
    const user = mockUsers.find(u => u.id === decoded.id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Generate new tokens
    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    const response: AuthResponse = {
      user,
      token: newToken,
      refreshToken: newRefreshToken
    };

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: response
    });
  } catch (error) {
    throw new CustomError('Invalid refresh token', 401);
  }
}));

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', asyncHandler(async (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', asyncHandler(async (req, res) => {
  // This would typically use auth middleware
  // For now, we'll return a mock response
  const user = mockUsers[0]; // Mock current user

  res.json({
    success: true,
    message: 'Current user retrieved successfully',
    data: user
  });
}));

export default router; 