'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Badge,
  Avatar,
  Divider,
  Skeleton,
  Progress
} from '@heroui/react';
import {
  Search,
  Filter,
  RefreshCw,
  Clock,
  TrendingUp,
  Eye,
  ExternalLink,
  Calendar,
  Zap,
  Globe,
  Bookmark,
  Share2,
  Bell,
  Rss
} from 'lucide-react';
import { SparklesCore } from '@/components/ui/sparkles';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

// Types for blog posts
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url?: string;
  source_name: string;
  author?: string;
  published_at: string;
  tags: string[];
  og_image?: string;
  is_featured: boolean;
  canonical_url: string;
}

interface BlogResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface LiveStats {
  totalArticles: number;
  todayArticles: number;
  lastUpdated: string;
  sources: string[];
}

// Categories for filtering (will be populated from API data)
const defaultCategories = ["All", "AI", "Web", "DevOps", "Programming", "Cloud", "Hardware"];

// News sources with their colors (all renowned sources)
const newsSourceColors: Record<string, string> = {
  'TechCrunch': 'success',
  'The Verge': 'primary',
  'Ars Technica': 'warning',
  'Wired': 'secondary',
  'Engadget': 'danger',
  'VentureBeat': 'primary',
  'MIT Technology Review': 'secondary',
  'TechRadar': 'warning',
  'ZDNet': 'default',
  'Mashable Tech': 'success',
  'Mashable': 'success',
  'Fast Company Tech': 'primary',
  'Fast Company': 'primary',
  'IEEE Spectrum': 'secondary',
  'Dev.to': 'default',
  'Hacker News': 'primary',
  'HN -': 'primary', // Hacker News with domain
  'NewsAPI': 'success',
  'Recode': 'warning',
  'Gizmodo': 'danger',
  'Lifehacker': 'success',
  'default': 'default'
};

// Auto-refresh intervals
const REFRESH_INTERVALS = {
  OFF: 0,
  FAST: 30000,    // 30 seconds
  NORMAL: 60000,  // 1 minute
  SLOW: 300000    // 5 minutes
};

export default function TechNews() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [refreshInterval, setRefreshInterval] = useState(REFRESH_INTERVALS.NORMAL);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    totalArticles: 0,
    todayArticles: 0,
    lastUpdated: new Date().toISOString(),
    sources: []
  });
  const [savedArticles, setSavedArticles] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch posts from API
  const fetchPosts = useCallback(async (showRefreshIndicator = false) => {
      try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
        const response = await fetch('http://localhost:8000/api/v1/blog/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: BlogResponse = await response.json();
        setPosts(data.posts);
        
        // Extract unique categories from tags
        const allTags = data.posts.flatMap(post => post.tags);
        const uniqueTags = Array.from(new Set(allTags));
        setCategories(["All", ...uniqueTags]);
        
      // Update live stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayPosts = data.posts.filter(post => 
        new Date(post.published_at) >= today
      );
      const sources = Array.from(new Set(data.posts.map(post => post.source_name)));
      
      setLiveStats({
        totalArticles: data.total,
        todayArticles: todayPosts.length,
        lastUpdated: new Date().toISOString(),
        sources
      });
        
      } catch (err) {
      console.warn('API fetch failed, using mock data:', err);
      // Use mock data as fallback
      setPosts(mockNewsData);
      
      // Extract unique categories from mock tags
      const allTags = mockNewsData.flatMap(post => post.tags);
      const uniqueTags = Array.from(new Set(allTags));
      setCategories(["All", ...uniqueTags]);
      
      // Update live stats with mock data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayPosts = mockNewsData.filter(post => 
        new Date(post.published_at) >= today
      );
      const sources = Array.from(new Set(mockNewsData.map(post => post.source_name)));
      
      setLiveStats({
        totalArticles: mockNewsData.length,
        todayArticles: todayPosts.length,
        lastUpdated: new Date().toISOString(),
        sources
      });
      
      // Don't set error when using fallback data
      setError(null);
      } finally {
        setLoading(false);
      setIsRefreshing(false);
      }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval === 0) return;

    const interval = setInterval(() => {
      fetchPosts(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchPosts]);

  // Filter and sort posts
  const filteredAndSortedPosts = (() => {
    let filtered = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedCategory));

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.source_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'source':
        filtered.sort((a, b) => a.source_name.localeCompare(b.source_name));
        break;
      default:
        break;
    }

    return filtered;
  })();

  // Utility functions
  const handleSaveArticle = (articleId: number) => {
    setSavedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const getSourceColor = (sourceName: string) => {
    return newsSourceColors[sourceName] || newsSourceColors.default;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return publishedDate.toLocaleDateString();
  };

  const typewriterWords = [
    { text: "Live", className: "text-foreground" },
    { text: "Tech", className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary" },
    { text: "News", className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary" },
  ];

  // Mock data as fallback
  const mockNewsData: BlogPost[] = [
    {
      id: 1,
      slug: "openai-releases-gpt-5",
      title: "OpenAI Releases GPT-5 with Enhanced Multimodal Capabilities",
      excerpt: "The latest iteration of GPT brings unprecedented improvements in image understanding and generation, setting new benchmarks in AI performance.",
      cover_image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      source_name: "TechCrunch",
      author: "Sarah Chen",
      published_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      tags: ["AI", "OpenAI", "GPT", "Machine Learning"],
      og_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
      is_featured: true,
      canonical_url: "https://techcrunch.com/gpt5"
    },
    {
      id: 2,
      slug: "nextjs-15-server-components",
      title: "Next.js 15 Introduces Revolutionary Server Components",
      excerpt: "The latest version of Next.js brings significant performance improvements and new features that will change how we build React applications.",
      cover_image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      source_name: "Vercel Blog",
      author: "Alex Rodriguez",
      published_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      tags: ["Next.js", "React", "Web Development", "Performance"],
      og_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
      is_featured: false,
      canonical_url: "https://vercel.com/blog/nextjs15"
    },
    {
      id: 3,
      slug: "docker-container-security",
      title: "Docker Announces New Container Security Features",
      excerpt: "Enhanced security scanning and runtime protection features make Docker containers more secure than ever before.",
      cover_image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      source_name: "Docker Blog",
      author: "Mike Johnson",
      published_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
      tags: ["Docker", "Security", "DevOps", "Containers"],
      og_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop",
      is_featured: false,
      canonical_url: "https://docker.com/blog/security"
    },
    {
      id: 4,
      slug: "typescript-5-2-features",
      title: "TypeScript 5.2 Released with Powerful New Features",
      excerpt: "Microsoft releases TypeScript 5.2 with improved type inference, better performance, and new developer experience enhancements.",
      cover_image_url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      source_name: "Microsoft DevBlog",
      author: "Emma Thompson",
      published_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
      tags: ["TypeScript", "Microsoft", "Programming", "Web Development"],
      og_image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop",
      is_featured: true,
      canonical_url: "https://devblogs.microsoft.com/typescript"
    },
    {
      id: 5,
      slug: "aws-lambda-cold-starts",
      title: "AWS Lambda Eliminates Cold Starts with New Runtime",
      excerpt: "Amazon Web Services introduces a breakthrough runtime that virtually eliminates cold start delays for serverless functions.",
      cover_image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      source_name: "AWS News",
      author: "David Park",
      published_at: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
      tags: ["AWS", "Lambda", "Serverless", "Cloud"],
      og_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop",
      is_featured: false,
      canonical_url: "https://aws.amazon.com/blogs/compute"
    },
    {
      id: 6,
      slug: "github-copilot-x",
      title: "GitHub Copilot X: AI-Powered Development Revolution",
      excerpt: "GitHub unveils Copilot X, bringing AI assistance to every aspect of the software development lifecycle.",
      cover_image_url: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop",
      source_name: "The Verge",
      author: "Lisa Wang",
      published_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      tags: ["GitHub", "AI", "Copilot", "Development Tools"],
      og_image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=630&fit=crop",
      is_featured: true,
      canonical_url: "https://theverge.com/github-copilot-x"
    },
    {
      id: 7,
      slug: "meta-ai-breakthrough",
      title: "Meta's New AI Model Outperforms GPT-4 in Coding Tasks",
      excerpt: "Meta's latest AI research shows significant improvements in code generation and debugging capabilities.",
      cover_image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
      source_name: "Wired",
      author: "James Mitchell",
      published_at: new Date(Date.now() - 54000000).toISOString(), // 15 hours ago
      tags: ["Meta", "AI", "Programming", "Research"],
      og_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=630&fit=crop",
      is_featured: true,
      canonical_url: "https://wired.com/meta-ai-breakthrough"
    },
    {
      id: 8,
      slug: "quantum-computing-milestone",
      title: "IBM Achieves Quantum Computing Milestone with 1000-Qubit Processor",
      excerpt: "IBM's latest quantum processor represents a significant leap forward in quantum computing capabilities.",
      cover_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
      source_name: "MIT Technology Review",
      author: "Dr. Rachel Kim",
      published_at: new Date(Date.now() - 64800000).toISOString(), // 18 hours ago
      tags: ["IBM", "Quantum Computing", "Research", "Hardware"],
      og_image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=630&fit=crop",
      is_featured: false,
      canonical_url: "https://technologyreview.com/ibm-quantum-milestone"
    },
    {
      id: 9,
      slug: "cybersecurity-threats-2024",
      title: "New Cybersecurity Threats Emerge as AI Attacks Become More Sophisticated",
      excerpt: "Security experts warn of AI-powered cyberattacks that could reshape the threat landscape in 2024.",
      cover_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
      source_name: "Ars Technica",
      author: "Security Team",
      published_at: new Date(Date.now() - 72000000).toISOString(), // 20 hours ago
      tags: ["Cybersecurity", "AI", "Threats", "Security"],
      og_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop",
      is_featured: false,
      canonical_url: "https://arstechnica.com/cybersecurity-ai-threats"
    },
    {
      id: 10,
      slug: "startup-funding-record",
      title: "Tech Startup Funding Reaches Record High Despite Economic Uncertainty",
      excerpt: "VentureBeat reports that tech startups raised $50B in Q4, defying market predictions.",
      cover_image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
      source_name: "VentureBeat",
      author: "Investment Desk",
      published_at: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
      tags: ["Startups", "Funding", "Venture Capital", "Business"],
      og_image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=630&fit=crop",
      is_featured: false,
      canonical_url: "https://venturebeat.com/startup-funding-record"
    }
  ];

  return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden py-20">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Live Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium border border-success/20 mb-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-success rounded-full"
                />
                <Rss size={16} />
                Live Updates • {liveStats.todayArticles} new articles today
              </motion.div>

              {/* Main Headline with Typewriter Effect */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center">
                  <TypewriterEffectSmooth
                    words={typewriterWords}
                    className="flex justify-center"
                    cursorClassName="bg-primary"
                  />
                </div>

                <p className="text-xl sm:text-2xl text-default-600 leading-relaxed max-w-4xl mx-auto">
                  Stay ahead with real-time tech news from trusted sources, updated every minute.
                </p>
              </motion.div>

              {/* Live Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 max-w-4xl mx-auto"
              >
                {[
                  { label: 'Total Articles', value: liveStats.totalArticles, icon: Globe },
                  { label: 'Today\'s News', value: liveStats.todayArticles, icon: Calendar },
                  { label: 'Live Sources', value: liveStats.sources.length, icon: Rss },
                  { label: 'Auto Updates', value: refreshInterval > 0 ? 'ON' : 'OFF', icon: RefreshCw },
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <IconComponent size={20} className="text-primary" />
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </div>
                      <div className="text-sm text-default-500">{stat.label}</div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>

          {/* Radial Gradient Mask */}
          <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(50%_50%_at_50%_50%,transparent_0%,black_100%)]" />
        </section>

        {/* Controls Section */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-content1/70 backdrop-blur-md border border-default-200/60 shadow-lg">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <Input
                      placeholder="Search news, sources, topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      startContent={<Search size={20} className="text-default-400" />}
                      variant="bordered"
                      className="flex-1"
                    />
                    
                    <Select
                      placeholder="Category"
                      selectedKeys={selectedCategory ? new Set([selectedCategory]) : new Set()}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setSelectedCategory(selected || 'All');
                      }}
                      variant="bordered"
                      className="min-w-[150px]"
                      startContent={<Filter size={16} className="text-default-400" />}
                    >
                      {categories.map((category) => (
                        <SelectItem key={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      placeholder="Sort by"
                      selectedKeys={sortBy ? new Set([sortBy]) : new Set()}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setSortBy(selected || 'recent');
                      }}
                      variant="bordered"
                      className="min-w-[150px]"
                    >
                      <SelectItem key="recent">Most Recent</SelectItem>
                      <SelectItem key="oldest">Oldest First</SelectItem>
                      <SelectItem key="title">Title A-Z</SelectItem>
                      <SelectItem key="source">Source A-Z</SelectItem>
                    </Select>
        </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    {/* Auto-refresh control */}
                    <Select
                      placeholder="Auto-refresh"
                      selectedKeys={refreshInterval ? new Set([refreshInterval.toString()]) : new Set()}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setRefreshInterval(parseInt(selected) || 0);
                      }}
                      variant="bordered"
                      className="min-w-[120px]"
                      size="sm"
                    >
                      <SelectItem key="0">Off</SelectItem>
                      <SelectItem key={REFRESH_INTERVALS.FAST.toString()}>30s</SelectItem>
                      <SelectItem key={REFRESH_INTERVALS.NORMAL.toString()}>1m</SelectItem>
                      <SelectItem key={REFRESH_INTERVALS.SLOW.toString()}>5m</SelectItem>
                    </Select>

                    {/* Manual refresh */}
                    <Button
                      isIconOnly
                      variant="bordered"
                      size="sm"
                      onClick={() => fetchPosts(true)}
                      isLoading={isRefreshing}
                      className="min-w-unit-10"
                    >
                      <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    </Button>

                    {/* Last updated indicator */}
                    <div className="text-xs text-default-500 hidden sm:block">
                      Last updated: {getTimeAgo(liveStats.lastUpdated)}
                    </div>
                  </div>
                </div>

                {/* Active filters */}
                {(selectedCategory !== 'All' || searchTerm) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-default-200">
                    <span className="text-sm text-default-600">Active filters:</span>
                    {selectedCategory !== 'All' && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClose={() => setSelectedCategory('All')}
                      >
                        {selectedCategory}
                      </Chip>
                    )}
                    {searchTerm && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="secondary"
                        onClose={() => setSearchTerm('')}
                      >
                        "{searchTerm}"
                      </Chip>
                    )}
          </div>
        )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
          >
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {loading ? 'Loading...' : `${filteredAndSortedPosts.length} Articles Found`}
              </h2>
              {filteredAndSortedPosts.length > 0 && (
                <Chip color="primary" variant="flat" className="text-sm font-medium">
                  {filteredAndSortedPosts.length} results
                </Chip>
              )}
            </div>

            {/* Auto-refresh indicator */}
            {refreshInterval > 0 && (
              <div className="flex items-center gap-2 text-sm text-success">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-success rounded-full"
                />
                Auto-updating every {refreshInterval === REFRESH_INTERVALS.FAST ? '30s' : 
                                   refreshInterval === REFRESH_INTERVALS.NORMAL ? '1m' : '5m'}
          </div>
        )}
          </motion.div>

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="bg-content1 shadow-sm">
                    <CardBody className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-4 w-16 rounded" />
                        </div>
                        <Skeleton className="h-6 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16 rounded" />
                          <Skeleton className="h-6 w-20 rounded" />
                        </div>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24 rounded" />
                          <Skeleton className="h-4 w-20 rounded" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </motion.div>
            ) : error ? (
              /* Error State */
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Card className="max-w-md mx-auto bg-danger/5 border border-danger/20">
                  <CardBody className="p-8 text-center">
                    <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-danger" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading News</h3>
                    <p className="text-default-600 mb-6">{error}</p>
                    <Button
                      color="danger"
                      variant="flat"
                      onClick={() => fetchPosts()}
                      startContent={<RefreshCw size={16} />}
                    >
                      Try Again
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            ) : filteredAndSortedPosts.length === 0 ? (
              /* No Results */
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Card className="max-w-md mx-auto bg-content1">
                  <CardBody className="p-8 text-center">
                    <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-default-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
                    <p className="text-default-600 mb-6">
                      Try adjusting your search criteria or check back later for new content.
                    </p>
                    <Button
                      color="primary"
                      variant="flat"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            ) : (
              /* News Grid */
              <motion.div
                key="news-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAndSortedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-content1 hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                      <CardBody className="p-0">
                {/* Cover Image */}
                {post.cover_image_url && (
                          <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            
                            {/* Live indicator for recent posts */}
                            {new Date(post.published_at) > new Date(Date.now() - 3600000) && (
                              <div className="absolute top-3 left-3">
                                <Chip
                                  size="sm"
                                  color="success"
                                  variant="solid"
                                  startContent={
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                      className="w-2 h-2 bg-white rounded-full"
                                    />
                                  }
                                  className="text-white font-medium"
                                >
                                  LIVE
                                </Chip>
                              </div>
                            )}

                            {/* Save button */}
                            <div className="absolute top-3 right-3">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveArticle(post.id);
                                }}
                              >
                                <Bookmark
                                  size={14}
                                  className={savedArticles.includes(post.id) ? 'fill-white text-white' : 'text-white'}
                                />
                              </Button>
                            </div>
                  </div>
                )}
                
                        <div className="p-6 flex flex-col flex-1">
                          {/* Source and Featured Badge */}
                  <div className="flex items-center justify-between mb-4">
                            <Chip
                              size="sm"
                              color={getSourceColor(post.source_name) as any}
                              variant="flat"
                              className="font-medium"
                            >
                      {post.source_name}
                            </Chip>
                    {post.is_featured && (
                              <Chip size="sm" color="warning" variant="flat" className="font-medium">
                        Featured
                              </Chip>
                    )}
                  </div>

                  {/* Title */}
                          <h2 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                          <p className="text-default-600 mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                                <Chip
                          key={tag}
                                  size="sm"
                                  variant="bordered"
                                  className="text-xs"
                        >
                          {tag}
                                </Chip>
                      ))}
                              {post.tags.length > 3 && (
                                <Chip size="sm" variant="bordered" className="text-xs">
                                  +{post.tags.length - 3}
                                </Chip>
                              )}
                    </div>
                  )}

                          {/* Footer */}
                          <div className="flex justify-between items-center pt-4 border-t border-default-200">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-default-400" />
                              <time className="text-sm text-default-500">
                                {getTimeAgo(post.published_at)}
                      </time>
                    </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Share functionality
                                }}
                              >
                                <Share2 size={14} />
                              </Button>
                              
                              <Button
                                as={Link}
                      href={post.canonical_url}
                      target="_blank"
                      rel="noopener noreferrer"
                                size="sm"
                                color="primary"
                                variant="flat"
                                endContent={<ExternalLink size={14} />}
                                className="font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Read
                              </Button>
                  </div>
                </div>

                          {/* Author */}
                          {post.author && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-default-200">
                              <Avatar
                                size="sm"
                                name={post.author}
                                className="w-6 h-6 text-xs"
                              />
                              <span className="text-xs text-default-500">by {post.author}</span>
          </div>
        )}
            </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
      </div>
  );
} 