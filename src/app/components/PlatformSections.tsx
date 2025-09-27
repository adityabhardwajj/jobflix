'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@heroui/react';
import { Briefcase, Users, Newspaper, Lightbulb, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PlatformSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  href: string;
  badge?: string;
  stats: {
    label: string;
    value: string;
  };
  color: 'blue' | 'green' | 'purple' | 'orange' | 'cyan';
}

const sections: PlatformSection[] = [
  {
    id: 'jobs',
    title: 'Find Your Dream Job',
    subtitle: 'Curated Opportunities',
    description: 'Discover verified job openings from top tech companies. Connect directly with hiring managers and skip the endless applications.',
    icon: Briefcase,
    href: '/jobs',
    badge: 'Active',
    stats: { label: 'new jobs', value: '2.5K+' },
    color: 'blue'
  },
  {
    id: 'hire-talent',
    title: 'Hire Top Talent',
    subtitle: 'For Recruiters',
    description: 'Access our network of pre-screened developers and designers. Post jobs and find the perfect candidates faster.',
    icon: Users,
    href: '/hire-talent',
    badge: 'Recruiters',
    stats: { label: 'candidates', value: '15K+' },
    color: 'green'
  },
  {
    id: 'tech-news',
    title: 'Tech News & Insights',
    subtitle: 'Stay Updated',
    description: 'Get the latest technology news, industry insights, and career advice curated from top sources worldwide.',
    icon: Newspaper,
    href: '/tech-news',
    badge: 'Daily',
    stats: { label: 'articles', value: '500+' },
    color: 'purple'
  },
  {
    id: 'projects',
    title: 'Project Idea Hub',
    subtitle: 'Build & Learn',
    description: 'Discover exciting project ideas to build your portfolio. From beginner to advanced, find your next coding challenge.',
    icon: Lightbulb,
    href: '/project-ideas',
    badge: 'Popular',
    stats: { label: 'projects', value: '200+' },
    color: 'orange'
  },
  {
    id: 'assistant',
    title: 'AI Career Assistant',
    subtitle: 'Powered by GPT',
    description: 'Get personalized career advice, interview preparation, resume reviews, and skill recommendations from our AI assistant.',
    icon: Bot,
    href: '/assistant',
    badge: 'AI-Powered',
    stats: { label: 'conversations', value: '10K+' },
    color: 'cyan'
  }
];

function PlatformCard({ section, index }: { section: PlatformSection; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: shouldReduceMotion ? 0.2 : 0.8, 
        delay: shouldReduceMotion ? 0 : index * 0.1 
      }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={section.href}>
        <motion.div
          whileHover={shouldReduceMotion ? {} : { y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:border-accent/20 cursor-pointer"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            {/* Icon */}
            <div className={`
              p-3 rounded-xl transition-all duration-300 
              ${section.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' : 
                section.color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400' : 
                section.color === 'purple' ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400' : 
                section.color === 'orange' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400' : 
                'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400'}
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}>
              <Icon size={24} />
            </div>

            {/* Badge */}
            {section.badge && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-muted text-muted-fg border border-border">
                {section.badge}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-card-fg mb-2 group-hover:text-accent transition-colors duration-200">
                {section.title}
              </h3>
              <p className="text-sm font-semibold text-muted-fg">
                {section.subtitle}
              </p>
            </div>

            <p className="text-muted-fg leading-relaxed">
              {section.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="text-sm text-muted-fg">
              <span className="font-bold text-card-fg">{section.stats.value}</span> {section.stats.label}
            </div>
            
            <motion.div
              className="flex items-center gap-2 text-sm font-semibold text-accent group-hover:text-primary transition-colors duration-200"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span>Explore</span>
              <ArrowRight size={16} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function PlatformSections() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 sm:py-32 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fg mb-6">
            Everything You Need to{' '}
            <span className="text-accent">Advance Your Career</span>
          </h2>
          <p className="text-xl text-muted-fg max-w-3xl mx-auto leading-relaxed">
            A complete platform designed for modern professionals. Discover opportunities, 
            stay informed, build skills, and get AI-powered guidance.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Main Jobs Card - Takes 2 columns on lg */}
          <div className="lg:col-span-2">
            <PlatformCard section={sections[0]} index={0} />
          </div>
          
          {/* Hire Talent Card */}
          <div className="lg:col-span-1">
            <PlatformCard section={sections[1]} index={1} />
          </div>

          {/* Tech News Card */}
          <div className="md:col-span-1">
            <PlatformCard section={sections[2]} index={2} />
          </div>

          {/* Projects Card */}
          <div className="md:col-span-1">
            <PlatformCard section={sections[3]} index={3} />
          </div>

          {/* AI Assistant Card - Takes full width */}
          <div className="md:col-span-2 lg:col-span-1">
            <PlatformCard section={sections[4]} index={4} />
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-muted-fg mb-8">
            Ready to take your career to the next level?
          </p>
          <Button
            as={Link}
            href="/jobs"
            size="lg"
            className="bg-primary text-primary-fg hover:bg-primary/90 px-8 py-3 text-base font-semibold transition-all duration-200"
            endContent={<ArrowRight size={18} />}
          >
            Get Started Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
