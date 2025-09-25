"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Bookmark,
  Eye,
  Share2,
  SortAsc,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Building2
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Chip, 
  Card, 
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge
} from '@heroui/react';
import EnhancedJobCard from '../components/EnhancedJobCard';
import { SparklesCore } from '@/components/ui/sparkles';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { useToastHelpers } from '../components/Toast';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Job {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  logo: string;
  accentColor: string;
  role: string;
  roleColor: string;
  description: string;
  requirements: string[];
  postedDate: string;
  experience: string;
  skills: string[];
  isRemote: boolean;
  isUrgent: boolean;
  companySize?: string;
  companyRating?: number;
  companyIndustry?: string;
  companyFounded?: string;
  companyDescription?: string;
}

// Enhanced mock job data
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    salary: "$120,000 - $150,000",
    location: "San Francisco, CA",
    type: "Full-time",
    logo: "https://logo.clearbit.com/google.com",
    accentColor: "border-blue-500",
    role: "frontend",
    roleColor: "#3B82F6",
    description: "We're looking for a Senior Frontend Developer to join our growing team and build the next generation of web applications.",
    requirements: ["React", "TypeScript", "5+ years experience", "Team leadership"],
    postedDate: "2 days ago",
    experience: "Senior",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    isRemote: true,
    isUrgent: true,
    companySize: "1,000+ employees",
    companyRating: 4.9,
    companyIndustry: "Technology",
    companyFounded: "2010",
    companyDescription: "Leading technology company focused on innovative web solutions"
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "StartupXYZ",
    salary: "$90,000 - $120,000",
    location: "New York, NY",
    type: "Full-time",
    logo: "https://logo.clearbit.com/microsoft.com",
    accentColor: "border-green-500",
    role: "backend",
    roleColor: "#10B981",
    description: "Join our backend team to build scalable microservices and APIs that power millions of users.",
    requirements: ["Node.js", "Python", "AWS", "3+ years experience"],
    postedDate: "1 week ago",
    experience: "Mid-level",
    skills: ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
    isRemote: false,
    isUrgent: false,
    companySize: "50-200 employees",
    companyRating: 4.6,
    companyIndustry: "Fintech",
    companyFounded: "2018",
    companyDescription: "Fast-growing fintech startup revolutionizing digital payments"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    salary: "$80,000 - $110,000",
    location: "Remote",
    type: "Full-time",
    logo: "https://logo.clearbit.com/airbnb.com",
    accentColor: "border-purple-500",
    role: "design",
    roleColor: "#8B5CF6",
    description: "Create beautiful and intuitive user experiences that delight our customers and drive business growth.",
    requirements: ["Figma", "Adobe Creative Suite", "Portfolio", "2+ years experience"],
    postedDate: "3 days ago",
    experience: "Mid-level",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    isRemote: true,
    isUrgent: false,
    companySize: "20-50 employees",
    companyRating: 4.7,
    companyIndustry: "Design Agency",
    companyFounded: "2015",
    companyDescription: "Award-winning design studio creating digital experiences"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    salary: "$100,000 - $130,000",
    location: "Austin, TX",
    type: "Full-time",
    logo: "https://logo.clearbit.com/amazon.com",
    accentColor: "border-orange-500",
    role: "devops",
    roleColor: "#F59E0B",
    description: "Build and maintain our cloud infrastructure while ensuring high availability and scalability.",
    requirements: ["AWS", "Kubernetes", "Terraform", "4+ years experience"],
    postedDate: "5 days ago",
    experience: "Senior",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
    isRemote: false,
    isUrgent: true,
    companySize: "500+ employees",
    companyRating: 4.5,
    companyIndustry: "Cloud Services",
    companyFounded: "2012",
    companyDescription: "Enterprise cloud infrastructure and DevOps solutions"
  },
  {
    id: 5,
    title: "Full Stack Developer",
    company: "Innovation Labs",
    salary: "$95,000 - $125,000",
    location: "Seattle, WA",
    type: "Full-time",
    logo: "https://logo.clearbit.com/netflix.com",
    accentColor: "border-red-500",
    role: "fullstack",
    roleColor: "#EF4444",
    description: "Build end-to-end solutions for our platform using modern technologies and best practices.",
    requirements: ["React", "Node.js", "MongoDB", "3+ years experience"],
    postedDate: "1 day ago",
    experience: "Mid-level",
    skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
    isRemote: true,
    isUrgent: false,
    companySize: "100-500 employees",
    companyRating: 4.8,
    companyIndustry: "EdTech",
    companyFounded: "2016",
    companyDescription: "Innovative educational technology platform"
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Analytics Pro",
    salary: "$110,000 - $140,000",
    location: "Boston, MA",
    type: "Full-time",
    logo: "https://logo.clearbit.com/spotify.com",
    accentColor: "border-indigo-500",
    role: "data",
    roleColor: "#6366F1",
    description: "Transform data into actionable insights that drive strategic business decisions.",
    requirements: ["Python", "Machine Learning", "SQL", "PhD preferred"],
    postedDate: "4 days ago",
    experience: "Senior",
    skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
    isRemote: false,
    isUrgent: false,
    companySize: "200-500 employees",
    companyRating: 4.4,
    companyIndustry: "Data Analytics",
    companyFounded: "2014",
    companyDescription: "Advanced analytics and business intelligence solutions"
  }
];

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  const { success, error } = useToastHelpers();

  const typewriterWords = [
    {
      text: "Find",
      className: "text-foreground",
    },
    {
      text: "Your",
      className: "text-foreground",
    },
    {
      text: "Dream",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary",
    },
    {
      text: "Job",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary",
    },
  ];

  // Fetch jobs from API with pagination
  const fetchJobs = async (page = 1, search = '', location = '', role = '') => {
    try {
      setLoading(true);
      setApiError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...(search && { search }),
        ...(location && { location }),
        ...(role && role !== 'all' && { workType: role }),
        ...(sortBy && { sortBy })
      });

      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const result = await response.json();
      setJobs(result.data || []);
      setPagination(result.pagination);
      
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching jobs:', err);
      // Fallback to mock data if API fails
      setJobs(mockJobs);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(mockJobs.length / pagination.itemsPerPage),
        totalItems: mockJobs.length,
        itemsPerPage: pagination.itemsPerPage,
        hasNextPage: mockJobs.length > pagination.itemsPerPage,
        hasPreviousPage: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when component mounts or search params change
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const role = searchParams.get('role') || '';
    
    fetchJobs(page, search, location, role);
  }, [searchParams, sortBy]);

  // Update URL when filters change
  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change (except when changing page)
    if (!newParams.page) {
      params.delete('page');
    }
    
    router.push(`/jobs?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
  };

  const handleSaveJob = (jobId: number) => {
    setSavedJobs(prev => {
      const newSaved = prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      
      const isSaved = newSaved.includes(jobId);
      success(
        isSaved ? 'Job saved' : 'Job removed',
        isSaved ? 'Job added to your saved list' : 'Job removed from saved list'
      );
      
      return newSaved;
    });
  };

  const handleApplyJob = (jobId: number) => {
    success('Application submitted', 'Your application has been sent successfully!');
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    // The sorting will be handled by the API, so we just need to trigger a refetch
  };

  const handleSearch = () => {
    updateURL({
      search: searchQuery,
      location: locationFilter,
      role: roleFilter
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-600">Loading...</p>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-background text-foreground">
        
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
          {/* Sparkles Background */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-background via-content1/30 to-background">
            <SparklesCore
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={80}
              className="w-full h-full"
              particleColor="hsl(var(--heroui-primary))"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
              >
                <Briefcase size={16} />
                Verified opportunities await
              </motion.div>

              {/* Main Headline with Typewriter */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <TypewriterEffectSmooth 
                    words={typewriterWords}
                    className="flex justify-center"
                    cursorClassName="bg-primary"
                  />
                </div>
                
                <div className="text-xl sm:text-2xl text-default-600 leading-relaxed max-w-4xl mx-auto">
                  <div className="text-center">
                    Discover thousands of verified opportunities with direct access to decision-makers.
                  </div>
                </div>
              </motion.div>

              {/* Search Section */}
              <motion.div
                variants={itemVariants}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-content1/60 backdrop-blur-sm border border-default-200/60 shadow-xl">
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <Input
                        placeholder="Search jobs, companies, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        startContent={<Search size={20} className="text-default-400" />}
                        className="md:col-span-2"
                        variant="bordered"
                      />
                      <Input
                        placeholder="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        startContent={<MapPin size={20} className="text-default-400" />}
                        variant="bordered"
                      />
                      <Select
                        placeholder="Role"
                        selectedKeys={roleFilter ? [roleFilter] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setRoleFilter(selected || '');
                          // Trigger search after a short delay to allow state to update
                          setTimeout(() => {
                            updateURL({
                              search: searchQuery,
                              location: locationFilter,
                              role: selected || ''
                            });
                          }, 100);
                        }}
                        variant="bordered"
                      >
                        <SelectItem key="frontend">Frontend</SelectItem>
                        <SelectItem key="backend">Backend</SelectItem>
                        <SelectItem key="fullstack">Full Stack</SelectItem>
                        <SelectItem key="design">Design</SelectItem>
                        <SelectItem key="devops">DevOps</SelectItem>
                        <SelectItem key="data">Data Science</SelectItem>
                      </Select>
                      <Button
                        color="primary"
                        onPress={handleSearch}
                        startContent={<Search size={16} />}
                        className="w-full md:w-auto"
                      >
                        Search
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 max-w-5xl mx-auto"
              >
                {[
                  { label: 'Active Jobs', value: pagination.totalItems, suffix: '', icon: Briefcase },
                  { label: 'Companies', value: 500, suffix: '+', icon: Building2 },
                  { label: 'Success Rate', value: 92, suffix: '%', icon: TrendingUp },
                  { label: 'Avg Response', value: 24, suffix: 'h', icon: Clock },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                      <stat.icon size={24} />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-default-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0"
            >
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {loading ? 'Loading...' : `${pagination.totalItems} Jobs Found`}
                </h2>
                {jobs.length > 0 && (
                  <Chip color="primary" variant="flat" size="sm">
                    {pagination.totalItems} results
                  </Chip>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" endContent={<SortAsc size={16} />}>
                      Sort by
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={(key) => handleSort(key as string)}>
                    <DropdownItem key="recent">Most Recent</DropdownItem>
                    <DropdownItem key="salary-high">Salary: High to Low</DropdownItem>
                    <DropdownItem key="salary-low">Salary: Low to High</DropdownItem>
                    <DropdownItem key="company">Company Name</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-content1 rounded-lg border border-default-200 p-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant={viewMode === 'grid' ? 'solid' : 'light'}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    onPress={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant={viewMode === 'list' ? 'solid' : 'light'}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    onPress={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Job Listings */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-80 bg-content2 rounded-xl"></div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="jobs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
                >
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EnhancedJobCard 
                        job={job} 
                        onSave={handleSaveJob}
                        onApply={handleApplyJob}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Results */}
            {!loading && jobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-content2 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-default-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No jobs found
                  </h3>
                  <p className="text-default-600 mb-6">
                    Try adjusting your search criteria or browse all available jobs
                  </p>
                  <Button
                    color="primary"
                    onPress={() => {
                      setSearchQuery('');
                      setLocationFilter('');
                      setRoleFilter('');
                      updateURL({
                        search: '',
                        location: '',
                        role: ''
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-6"
              >
                <PaginationInfo
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  className="text-center"
                />
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  className="justify-center"
                />
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </Suspense>
  );
}