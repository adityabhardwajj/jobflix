import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from './errorHandler';
import { User } from '../types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new CustomError('Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as any;
      
      // Get user from database (you'll need to implement this)
      // const user = await User.findById(decoded.id);
      
      // For now, we'll use a mock user
      const user: User = {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
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

      req.user = user;
      next();
    } catch (error) {
      throw new CustomError('Not authorized to access this route', 401);
    }
  } catch (error) {
    next(error);
  }
};

// Optional auth middleware (doesn't throw error if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret') as any;
        
        // Mock user for now
        const user: User = {
          id: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          role: decoded.role,
          status: 'active',
          isEmailVerified: true,
          isPhoneVerified: false,
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

        req.user = user;
      } catch (error) {
        // Token is invalid, but we don't throw an error
        console.log('Invalid token in optional auth');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CustomError('Not authorized to access this route', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError('User role is not authorized to access this route', 403);
    }

    next();
  };
}; 