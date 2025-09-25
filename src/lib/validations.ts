import { z } from 'zod'

// ================================
// USER & AUTHENTICATION SCHEMAS
// ================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
})

export const phoneLoginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers')
    .optional(),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.enum(['JOB_SEEKER', 'EMPLOYER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// ================================
// USER PROFILE SCHEMAS
// ================================

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  bio: z
    .string()
    .max(500, 'Bio is too long')
    .optional(),
  location: z
    .string()
    .max(100, 'Location is too long')
    .optional(),
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url('Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github: z
    .string()
    .url('Invalid GitHub URL')
    .optional()
    .or(z.literal('')),
  currentRole: z
    .string()
    .max(100, 'Current role is too long')
    .optional(),
  experience: z
    .number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience seems too high')
    .optional(),
  education: z
    .string()
    .max(200, 'Education is too long')
    .optional(),
  desiredSalaryMin: z
    .number()
    .min(0, 'Salary cannot be negative')
    .optional(),
  desiredSalaryMax: z
    .number()
    .min(0, 'Salary cannot be negative')
    .optional(),
  remoteWork: z.boolean().default(false),
}).refine((data) => {
  if (data.desiredSalaryMin && data.desiredSalaryMax) {
    return data.desiredSalaryMin <= data.desiredSalaryMax
  }
  return true
}, {
  message: "Minimum salary cannot be higher than maximum salary",
  path: ["desiredSalaryMax"],
})

// ================================
// JOB APPLICATION SCHEMAS
// ================================

export const jobApplicationPersonalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location is too long'),
})

export const jobApplicationExperienceSchema = z.object({
  yearsOfExperience: z
    .string()
    .min(1, 'Years of experience is required'),
  currentRole: z
    .string()
    .min(1, 'Current role is required')
    .max(100, 'Current role is too long'),
  currentCompany: z
    .string()
    .min(1, 'Current company is required')
    .max(100, 'Current company is too long'),
  skills: z
    .array(z.string())
    .min(1, 'At least one skill is required')
    .max(20, 'Too many skills selected'),
})

export const jobApplicationDocumentsSchema = z.object({
  resume: z
    .instanceof(File, { message: 'Resume is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Resume must be less than 5MB')
    .refine(
      (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'Resume must be a PDF or Word document'
    ),
  coverLetter: z
    .string()
    .max(1000, 'Cover letter is too long')
    .optional(),
  portfolio: z
    .string()
    .url('Invalid portfolio URL')
    .optional()
    .or(z.literal('')),
})

export const jobApplicationQuestionsSchema = z.object({
  whyJoin: z
    .string()
    .min(10, 'Please provide at least 10 characters')
    .max(500, 'Response is too long'),
  salaryExpectation: z
    .string()
    .min(1, 'Salary expectation is required'),
  startDate: z
    .string()
    .min(1, 'Start date is required'),
  remotePreference: z
    .string()
    .min(1, 'Remote preference is required'),
})

export const jobApplicationSchema = z.object({
  personalInfo: jobApplicationPersonalInfoSchema,
  experience: jobApplicationExperienceSchema,
  documents: jobApplicationDocumentsSchema,
  questions: jobApplicationQuestionsSchema,
})

// ================================
// JOB POSTING SCHEMAS
// ================================

export const jobPostingSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required')
    .max(100, 'Job title is too long'),
  description: z
    .string()
    .min(50, 'Job description must be at least 50 characters')
    .max(5000, 'Job description is too long'),
  requirements: z
    .array(z.string())
    .min(1, 'At least one requirement is required')
    .max(20, 'Too many requirements'),
  salaryMin: z
    .number()
    .min(0, 'Salary cannot be negative'),
  salaryMax: z
    .number()
    .min(0, 'Salary cannot be negative'),
  salaryCurrency: z
    .string()
    .length(3, 'Currency must be 3 characters')
    .default('USD'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location is too long'),
  workType: z
    .array(z.enum(['REMOTE', 'HYBRID', 'ON_SITE']))
    .min(1, 'At least one work type is required'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD']),
  tags: z
    .array(z.string())
    .max(10, 'Too many tags'),
  expiresAt: z
    .date()
    .min(new Date(), 'Expiry date must be in the future')
    .optional(),
}).refine((data) => data.salaryMin <= data.salaryMax, {
  message: "Minimum salary cannot be higher than maximum salary",
  path: ["salaryMax"],
})

// ================================
// COMPANY SCHEMAS
// ================================

export const companySchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name is too long'),
  description: z
    .string()
    .min(10, 'Company description must be at least 10 characters')
    .max(1000, 'Company description is too long'),
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  industry: z
    .string()
    .min(1, 'Industry is required')
    .max(50, 'Industry is too long'),
  size: z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location is too long'),
  foundedYear: z
    .number()
    .min(1800, 'Founded year seems too early')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional(),
})

// ================================
// SEARCH SCHEMAS
// ================================

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long'),
  type: z
    .enum(['all', 'jobs', 'companies', 'users'])
    .default('all'),
  page: z
    .number()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
})

// ================================
// CONTACT FORM SCHEMA
// ================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(100, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
})

// ================================
// TYPE EXPORTS
// ================================

export type LoginFormData = z.infer<typeof loginSchema>
export type PhoneLoginFormData = z.infer<typeof phoneLoginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>
export type JobPostingFormData = z.infer<typeof jobPostingSchema>
export type CompanyFormData = z.infer<typeof companySchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type ContactFormData = z.infer<typeof contactSchema>
