'use client';

import React, { Suspense, lazy, memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { LoadingSpinner, LoadingCard, LoadingJobCard } from './LoadingStates';

// Lazy load heavy components
const JobApplicationModal = lazy(() => import('./JobApplicationModal'));
const InterviewScheduler = lazy(() => import('./InterviewScheduler'));
const ResumeManager = lazy(() => import('./ResumeManager'));
const ApplicationTracker = lazy(() => import('./ApplicationTracker'));
const TechNewsSection = lazy(() => import('./TechNewsSection'));

// Memoized Job Card Component
interface JobCardProps {
  job: {
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
  };
  onApply: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const MemoizedJobCard = memo(function JobCard({ 
  job, 
  onApply, 
  onSave, 
  isSaved = false 
}: JobCardProps) {
  const handleApply = useCallback(() => {
    onApply();
  }, [onApply]);

  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`w-12 h-12 rounded-lg border-2 ${job.accentColor} flex items-center justify-center bg-white`}>
            <img
              src={job.logo}
              alt={job.company}
              className="w-8 h-8 object-contain"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
              }}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.salary}</span>
              <span>•</span>
              <span>{job.type}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isSaved 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save job'}
        >
          <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Apply Now
        </button>
        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
});

// Virtualized Job List Component
interface VirtualizedJobListProps {
  jobs: JobCardProps['job'][];
  onApply: (job: JobCardProps['job']) => void;
  onSave?: (job: JobCardProps['job']) => void;
  savedJobs?: Set<number>;
  itemHeight?: number;
  containerHeight?: number;
}

export function VirtualizedJobList({
  jobs,
  onApply,
  onSave,
  savedJobs = new Set(),
  itemHeight = 200,
  containerHeight = 600
}: VirtualizedJobListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, jobs.length);

  const visibleJobs = useMemo(() => {
    return jobs.slice(startIndex, endIndex);
  }, [jobs, startIndex, endIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = jobs.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={setContainerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleJobs.map((job, index) => (
            <div
              key={job.id}
              style={{ height: itemHeight }}
              className="p-4"
            >
              <MemoizedJobCard
                job={job}
                onApply={() => onApply(job)}
                onSave={() => onSave?.(job)}
                isSaved={savedJobs.has(job.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Image with lazy loading and optimization
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjwvc3ZnPg=='
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <img
        src={hasError ? placeholder : src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}

// Debounced Search Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Intersection Observer Hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Lazy Loaded Component Wrapper
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}

export function LazyComponent({ 
  children, 
  fallback = <LoadingCard />, 
  threshold = 0.1 
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(elementRef, { threshold });

  useEffect(() => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  }, [isIntersecting, isVisible]);

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Performance Monitoring Hook
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

// Memoized Search Results
interface SearchResultsProps {
  query: string;
  results: any[];
  onResultClick: (result: any) => void;
}

export const MemoizedSearchResults = memo(function SearchResults({
  query,
  results,
  onResultClick
}: SearchResultsProps) {
  const filteredResults = useMemo(() => {
    if (!query.trim()) return results;
    
    return results.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.company.toLowerCase().includes(query.toLowerCase())
    );
  }, [results, query]);

  return (
    <div className="space-y-4">
      {filteredResults.map((result) => (
        <div
          key={result.id}
          onClick={() => onResultClick(result)}
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <h3 className="font-semibold">{result.title}</h3>
          <p className="text-gray-600">{result.company}</p>
        </div>
      ))}
    </div>
  );
});

// Bundle Size Optimized Icon Component
interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = '' }: IconProps) {
  // Only import icons when needed
  const iconMap = {
    search: () => import('lucide-react').then(m => m.Search),
    heart: () => import('lucide-react').then(m => m.Heart),
    star: () => import('lucide-react').then(m => m.Star),
    // Add more icons as needed
  };

  const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      if (iconMap[name as keyof typeof iconMap]) {
        const icon = await iconMap[name as keyof typeof iconMap]();
        setIconComponent(() => icon);
      }
    };
    
    loadIcon();
  }, [name]);

  if (!IconComponent) {
    return <div className={`w-${size} h-${size} bg-gray-200 rounded animate-pulse ${className}`} />;
  }

  return <IconComponent size={size} className={className} />;
}

// Export lazy components with fallbacks
export const LazyJobApplicationModal = (props: any) => (
  <Suspense fallback={<LoadingSpinner size="lg" />}>
    <JobApplicationModal {...props} />
  </Suspense>
);

export const LazyInterviewScheduler = (props: any) => (
  <Suspense fallback={<LoadingCard />}>
    <InterviewScheduler {...props} />
  </Suspense>
);

export const LazyResumeManager = (props: any) => (
  <Suspense fallback={<LoadingCard />}>
    <ResumeManager {...props} />
  </Suspense>
);

export const LazyApplicationTracker = (props: any) => (
  <Suspense fallback={<LoadingCard />}>
    <ApplicationTracker {...props} />
  </Suspense>
);

export const LazyTechNewsSection = (props: any) => (
  <Suspense fallback={<LoadingCard />}>
    <TechNewsSection {...props} />
  </Suspense>
);
