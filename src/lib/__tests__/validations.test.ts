import {
  loginSchema,
  phoneLoginSchema,
  registerSchema,
  userProfileSchema,
  jobApplicationPersonalInfoSchema,
  contactSchema,
} from '../validations'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }
      
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }
      
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format')
      }
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      }
      
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
      }
    })

    it('should reject empty fields', () => {
      const invalidData = {
        email: '',
        password: '',
      }
      
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
      }
    })
  })

  describe('phoneLoginSchema', () => {
    it('should validate correct phone number', () => {
      const validData = {
        phone: '+1234567890',
      }
      
      const result = phoneLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate phone with OTP', () => {
      const validData = {
        phone: '+1234567890',
        otp: '123456',
      }
      
      const result = phoneLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid phone format', () => {
      const invalidData = {
        phone: '123',
      }
      
      const result = phoneLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid phone number format')
      }
    })

    it('should reject invalid OTP format', () => {
      const invalidData = {
        phone: '+1234567890',
        otp: '123',
      }
      
      const result = phoneLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('OTP must be 6 digits')
      }
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'JOB_SEEKER' as const,
      }
      
      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword',
        role: 'JOB_SEEKER' as const,
      }
      
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match")
      }
    })

    it('should reject weak password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        confirmPassword: 'password',
        role: 'JOB_SEEKER' as const,
      }
      
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Password must contain')
      }
    })
  })

  describe('userProfileSchema', () => {
    it('should validate correct profile data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Software engineer with 5 years of experience',
        location: 'San Francisco, CA',
        website: 'https://johndoe.com',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        currentRole: 'Senior Software Engineer',
        experience: 5,
        education: 'BS Computer Science',
        desiredSalaryMin: 100000,
        desiredSalaryMax: 150000,
        remoteWork: true,
      }
      
      const result = userProfileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid salary range', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        desiredSalaryMin: 150000,
        desiredSalaryMax: 100000,
      }
      
      const result = userProfileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Minimum salary cannot be higher than maximum salary')
      }
    })

    it('should accept empty optional fields', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        website: '',
        linkedin: '',
        github: '',
      }
      
      const result = userProfileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('jobApplicationPersonalInfoSchema', () => {
    it('should validate correct personal info', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'San Francisco, CA',
      }
      
      const result = jobApplicationPersonalInfoSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'San Francisco, CA',
      }
      
      const result = jobApplicationPersonalInfoSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name is required')
      }
    })
  })

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question about JobFlix',
        message: 'I have a question about your platform and would like to know more.',
      }
      
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question',
        message: 'Short',
      }
      
      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Message must be at least 10 characters')
      }
    })
  })
})
