import { JobFlixCardData } from '../types/cards';

export const jobFlixCardsData: JobFlixCardData[] = [
  {
    id: 'jobs',
    type: 'job',
    title: 'Find Your Dream Job',
    subtitle: 'Curated Opportunities',
    description: 'Discover verified job openings from top tech companies. Connect directly with hiring managers and skip the endless applications.',
    iconName: 'briefcase',
    href: '/jobs',
    badge: 'Active',
    stats: {
      label: 'new jobs',
      value: '2.5K+'
    }
  },
  {
    id: 'hire-talent',
    type: 'job',
    title: 'Hire Top Talent',
    subtitle: 'For Recruiters',
    description: 'Access our network of pre-screened developers and designers. Post jobs and find the perfect candidates faster.',
    iconName: 'users',
    href: '/hire-talent',
    badge: 'Recruiters',
    stats: {
      label: 'candidates',
      value: '15K+'
    }
  },
  {
    id: 'tech-news',
    type: 'news',
    title: 'Tech News & Insights',
    subtitle: 'Stay Updated',
    description: 'Get the latest technology news, industry insights, and career advice curated from top sources worldwide.',
    iconName: 'newspaper',
    href: '/tech-news',
    badge: 'Daily',
    stats: {
      label: 'articles',
      value: '500+'
    }
  },
  {
    id: 'project-ideas',
    type: 'project',
    title: 'Project Idea Hub',
    subtitle: 'Build & Learn',
    description: 'Discover exciting project ideas to build your portfolio. From beginner to advanced, find your next coding challenge.',
    iconName: 'lightbulb',
    href: '/project-ideas',
    badge: 'Popular',
    stats: {
      label: 'projects',
      value: '200+'
    }
  },
  {
    id: 'ai-assistant',
    type: 'assistant',
    title: 'AI Career Assistant',
    subtitle: 'Powered by GPT',
    description: 'Get personalized career advice, interview preparation, resume reviews, and skill recommendations from our AI assistant.',
    iconName: 'bot',
    href: '/assistant',
    badge: 'AI-Powered',
    stats: {
      label: 'conversations',
      value: '10K+'
    }
  }
];

// Alternative dataset for different sections if needed
export const featuredCardsData: JobFlixCardData[] = [
  {
    id: 'frontend-jobs',
    type: 'job',
    title: 'Frontend Developer',
    subtitle: 'React & Next.js',
    description: 'Build amazing user interfaces with modern frameworks. Join innovative teams creating the future of web.',
    iconName: 'briefcase',
    href: '/jobs?category=frontend',
    badge: 'Hot',
    stats: {
      label: 'openings',
      value: '350+'
    }
  },
  {
    id: 'startup-news',
    type: 'news',
    title: 'Startup Ecosystem',
    subtitle: 'Latest Trends',
    description: 'Stay informed about startup funding, new product launches, and emerging technology trends.',
    iconName: 'newspaper',
    href: '/tech-news?category=startup',
    stats: {
      label: 'weekly reads',
      value: '25K+'
    }
  },
  {
    id: 'fullstack-project',
    type: 'project',
    title: 'Full-Stack SaaS',
    subtitle: 'Advanced Level',
    description: 'Build a complete SaaS application with authentication, payments, and analytics. Perfect for portfolio.',
    iconName: 'lightbulb',
    href: '/project-ideas/fullstack-saas',
    badge: 'Advanced',
    stats: {
      label: 'completions',
      value: '1.2K+'
    }
  }
];
