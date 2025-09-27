import { z } from 'zod';

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Job title is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  years: z.number().min(0).max(50),
  location: z.string().min(1, 'Location is required'),
  desiredSalary: z.number().min(0),
  availability: z.enum(['immediate', '30d', '60d']),
  resumeUrl: z.string().url().optional(),
  completion: z.number().min(0).max(100)
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Job Schema
export const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  logoUrl: z.string().url(),
  salaryRange: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string().default('USD')
  }),
  location: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  videoUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  compatibility: z.number().min(0).max(100)
});

export type Job = z.infer<typeof JobSchema>;

// Swipe Action Schema
export const SwipeActionSchema = z.object({
  jobId: z.string(),
  action: z.enum(['apply', 'skip', 'save', 'details']),
  timestamp: z.string().datetime()
});

export type SwipeAction = z.infer<typeof SwipeActionSchema>;

// Apply Payload Schema
export const ApplyPayloadSchema = z.object({
  jobId: z.string(),
  profileId: z.string()
});

export type ApplyPayload = z.infer<typeof ApplyPayloadSchema>;

// Save Payload Schema
export const SavePayloadSchema = z.object({
  jobId: z.string(),
  profileId: z.string()
});

export type SavePayload = z.infer<typeof SavePayloadSchema>;

// API Response Schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional()
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Swipe Direction Schema
export const SwipeDirectionSchema = z.enum(['left', 'right', 'up', 'down']);

export type SwipeDirection = z.infer<typeof SwipeDirectionSchema>;

// Gesture State Schema
export const GestureStateSchema = z.object({
  isDragging: z.boolean(),
  startX: z.number(),
  startY: z.number(),
  currentX: z.number(),
  currentY: z.number(),
  velocityX: z.number(),
  velocityY: z.number(),
  direction: SwipeDirectionSchema.optional()
});

export type GestureState = z.infer<typeof GestureStateSchema>;

// Card Stack State Schema
export const CardStackStateSchema = z.object({
  cards: z.array(JobSchema),
  currentIndex: z.number(),
  isAnimating: z.boolean(),
  swipeHistory: z.array(SwipeActionSchema)
});

export type CardStackState = z.infer<typeof CardStackStateSchema>;
