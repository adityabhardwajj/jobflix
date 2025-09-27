import { Job, UserProfile } from './schemas';

export const sampleJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    logoUrl: 'https://logo.clearbit.com/techcorp.com',
    salaryRange: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    location: 'San Francisco, CA',
    tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    description: 'Join our innovative team building the next generation of web applications. We\'re looking for a passionate frontend developer with expertise in modern React ecosystems.',
    videoUrl: '/video/demo-job.mp4',
    createdAt: new Date().toISOString(),
    compatibility: 0 // Will be computed
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    logoUrl: 'https://logo.clearbit.com/startupxyz.com',
    salaryRange: {
      min: 90000,
      max: 140000,
      currency: 'USD'
    },
    location: 'Remote',
    tags: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    description: 'Fast-growing startup seeking a versatile full-stack engineer to help scale our platform. Work with cutting-edge technologies in a collaborative environment.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-3',
    title: 'Product Manager',
    company: 'InnovateLab',
    logoUrl: 'https://logo.clearbit.com/innovatelab.com',
    salaryRange: {
      min: 110000,
      max: 160000,
      currency: 'USD'
    },
    location: 'New York, NY',
    tags: ['Product Strategy', 'Agile', 'User Research', 'Analytics'],
    description: 'Lead product development for our flagship SaaS platform. Work closely with engineering and design teams to deliver exceptional user experiences.',
    videoUrl: '/video/demo-job.mp4',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    logoUrl: 'https://logo.clearbit.com/cloudscale.com',
    salaryRange: {
      min: 100000,
      max: 150000,
      currency: 'USD'
    },
    location: 'Austin, TX',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    description: 'Build and maintain our cloud infrastructure. Help us scale to millions of users with robust, secure, and efficient systems.',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-5',
    title: 'UX Designer',
    company: 'DesignStudio',
    logoUrl: 'https://logo.clearbit.com/designstudio.com',
    salaryRange: {
      min: 80000,
      max: 120000,
      currency: 'USD'
    },
    location: 'Los Angeles, CA',
    tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    description: 'Create beautiful, intuitive user experiences for our mobile and web applications. Work with cross-functional teams to bring designs to life.',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-6',
    title: 'Data Scientist',
    company: 'DataInsights',
    logoUrl: 'https://logo.clearbit.com/datainsights.com',
    salaryRange: {
      min: 130000,
      max: 190000,
      currency: 'USD'
    },
    location: 'Seattle, WA',
    tags: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    description: 'Apply advanced analytics and machine learning to solve complex business problems. Work with large datasets to drive data-driven decisions.',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-7',
    title: 'Backend Developer',
    company: 'APICorp',
    logoUrl: 'https://logo.clearbit.com/apicorp.com',
    salaryRange: {
      min: 95000,
      max: 145000,
      currency: 'USD'
    },
    location: 'Chicago, IL',
    tags: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    description: 'Build scalable backend services and APIs. Work with microservices architecture and modern development practices.',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-8',
    title: 'Mobile Developer',
    company: 'AppMakers',
    logoUrl: 'https://logo.clearbit.com/appmakers.com',
    salaryRange: {
      min: 85000,
      max: 135000,
      currency: 'USD'
    },
    location: 'Miami, FL',
    tags: ['React Native', 'iOS', 'Android', 'TypeScript'],
    description: 'Develop cross-platform mobile applications. Work with React Native to create seamless experiences across iOS and Android.',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-9',
    title: 'Security Engineer',
    company: 'SecureTech',
    logoUrl: 'https://logo.clearbit.com/securetech.com',
    salaryRange: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    location: 'Denver, CO',
    tags: ['Cybersecurity', 'Penetration Testing', 'AWS', 'Compliance'],
    description: 'Protect our systems and data from security threats. Implement security best practices and conduct regular security assessments.',
    createdAt: new Date(Date.now() - 691200000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-10',
    title: 'AI/ML Engineer',
    company: 'AIFirst',
    logoUrl: 'https://logo.clearbit.com/aifirst.com',
    salaryRange: {
      min: 140000,
      max: 200000,
      currency: 'USD'
    },
    location: 'Boston, MA',
    tags: ['TensorFlow', 'PyTorch', 'Python', 'Deep Learning'],
    description: 'Develop cutting-edge AI solutions. Work with machine learning models and neural networks to solve complex problems.',
    createdAt: new Date(Date.now() - 777600000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-11',
    title: 'Sales Engineer',
    company: 'SalesPro',
    logoUrl: 'https://logo.clearbit.com/salespro.com',
    salaryRange: {
      min: 90000,
      max: 140000,
      currency: 'USD'
    },
    location: 'Phoenix, AZ',
    tags: ['Sales', 'Technical', 'CRM', 'Presentations'],
    description: 'Bridge the gap between sales and engineering. Help customers understand our technical solutions and drive revenue growth.',
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    compatibility: 0
  },
  {
    id: 'job-12',
    title: 'QA Engineer',
    company: 'QualityFirst',
    logoUrl: 'https://logo.clearbit.com/qualityfirst.com',
    salaryRange: {
      min: 70000,
      max: 110000,
      currency: 'USD'
    },
    location: 'Portland, OR',
    tags: ['Testing', 'Automation', 'Selenium', 'Jest'],
    description: 'Ensure software quality through comprehensive testing. Develop automated test suites and work with development teams.',
    createdAt: new Date(Date.now() - 950400000).toISOString(),
    compatibility: 0
  }
];

export const sampleProfile: UserProfile = {
  id: 'user-1',
  name: 'John Doe',
  title: 'Senior Software Engineer',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
  years: 5,
  location: 'San Francisco, CA',
  desiredSalary: 150000,
  availability: 'immediate',
  resumeUrl: 'https://example.com/resume.pdf',
  completion: 85
};

export const defaultProfile: UserProfile = {
  id: 'user-default',
  name: '',
  title: '',
  skills: [],
  years: 0,
  location: '',
  desiredSalary: 0,
  availability: 'immediate',
  completion: 0
};
