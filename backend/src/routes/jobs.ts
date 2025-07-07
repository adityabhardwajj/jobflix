import { Router } from 'express';
import { Job } from '../types';

const router = Router();

// Mock jobs data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Google',
    description: 'We are looking for a Senior Frontend Developer to join our team...',
    requirements: [
      '5+ years of experience with React/TypeScript',
      'Strong understanding of modern JavaScript',
      'Experience with state management (Redux, Zustand)',
      'Knowledge of CSS preprocessors and responsive design'
    ],
    responsibilities: [
      'Build and maintain scalable frontend applications',
      'Collaborate with design and backend teams',
      'Mentor junior developers',
      'Participate in code reviews and technical discussions'
    ],
    location: 'Mountain View, CA',
    remoteType: 'hybrid',
    salary: {
      min: 150000,
      max: 200000,
      currency: 'USD',
      period: 'yearly'
    },
    jobType: 'full-time',
    experienceLevel: 'senior',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    benefits: [
      'Health insurance',
      '401k matching',
      'Flexible work hours',
      'Remote work options',
      'Professional development budget'
    ],
    status: 'active',
    views: 1250,
    applications: 45,
    recruiterId: 'recruiter1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'Netflix',
    description: 'Join our backend team to build scalable microservices...',
    requirements: [
      '3+ years of experience with Node.js/Python',
      'Experience with microservices architecture',
      'Knowledge of databases (PostgreSQL, MongoDB)',
      'Understanding of cloud platforms (AWS, GCP)'
    ],
    responsibilities: [
      'Design and implement backend services',
      'Optimize database queries and performance',
      'Work with DevOps team on deployment',
      'Write clean, maintainable code'
    ],
    location: 'Los Gatos, CA',
    remoteType: 'remote',
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD',
      period: 'yearly'
    },
    jobType: 'full-time',
    experienceLevel: 'mid',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS'],
    benefits: [
      'Competitive salary',
      'Stock options',
      'Health benefits',
      'Unlimited PTO',
      'Learning budget'
    ],
    status: 'active',
    views: 890,
    applications: 32,
    recruiterId: 'recruiter2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Airbnb',
    description: 'Help us create beautiful and intuitive user experiences...',
    requirements: [
      '4+ years of UI/UX design experience',
      'Proficiency in Figma, Sketch, or Adobe XD',
      'Strong portfolio showcasing user-centered design',
      'Experience with design systems and component libraries'
    ],
    responsibilities: [
      'Create user interfaces and user experiences',
      'Conduct user research and usability testing',
      'Collaborate with product and engineering teams',
      'Maintain and evolve design system'
    ],
    location: 'San Francisco, CA',
    remoteType: 'hybrid',
    salary: {
      min: 100000,
      max: 140000,
      currency: 'USD',
      period: 'yearly'
    },
    jobType: 'full-time',
    experienceLevel: 'mid',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
    benefits: [
      'Health insurance',
      '401k',
      'Flexible work schedule',
      'Design conference attendance',
      'Home office stipend'
    ],
    status: 'active',
    views: 650,
    applications: 28,
    recruiterId: 'recruiter3',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }
];

// @route   GET /api/v1/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    location, 
    remoteType, 
    jobType,
    experienceLevel 
  } = req.query;

  let filteredJobs = [...mockJobs];

  // Apply filters
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }

  if (location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes((location as string).toLowerCase())
    );
  }

  if (remoteType) {
    filteredJobs = filteredJobs.filter(job => job.remoteType === remoteType);
  }

  if (jobType) {
    filteredJobs = filteredJobs.filter(job => job.jobType === jobType);
  }

  if (experienceLevel) {
    filteredJobs = filteredJobs.filter(job => job.experienceLevel === experienceLevel);
  }

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const total = filteredJobs.length;
  const totalPages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    message: 'Jobs retrieved successfully',
    data: paginatedJobs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  });
});

// @route   GET /api/v1/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const job = mockJobs.find(j => j.id === id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  res.json({
    success: true,
    message: 'Job retrieved successfully',
    data: job
  });
});

// @route   POST /api/v1/jobs
// @desc    Create a new job (for recruiters)
// @access  Private
router.post('/', (req, res) => {
  // This would typically require authentication and recruiter role
  const newJob: Job = {
    id: (mockJobs.length + 1).toString(),
    ...req.body,
    status: 'active',
    views: 0,
    applications: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockJobs.push(newJob);

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: newJob
  });
});

// @route   PUT /api/v1/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', (req, res) => {
  const { id } = req.params;
  
  const jobIndex = mockJobs.findIndex(j => j.id === id);
  
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    ...req.body,
    updatedAt: new Date()
  };

  res.json({
    success: true,
    message: 'Job updated successfully',
    data: mockJobs[jobIndex]
  });
});

// @route   DELETE /api/v1/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const jobIndex = mockJobs.findIndex(j => j.id === id);
  
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  mockJobs.splice(jobIndex, 1);

  res.json({
    success: true,
    message: 'Job deleted successfully'
  });
});

export default router; 