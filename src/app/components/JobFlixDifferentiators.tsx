'use client';

import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Shield, 
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  Sparkles,
  Brain,
  UserCheck,
  Award,
  Compass
} from "lucide-react";

// Enhanced gradient skeleton with floating elements
const JobFlixSkeleton = ({ gradient, icon }: { gradient: string; icon: React.ReactNode }) => (
  <div className={cn(
    "relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden",
    gradient
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
    
    {/* Floating geometric shapes */}
    <motion.div
      animate={{ 
        y: [-10, 10, -10],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute top-4 right-4 w-8 h-8 opacity-20"
    >
      {icon}
    </motion.div>
    
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute bottom-2 left-2 w-4 h-4 bg-white/20 rounded-full"
    />
    
    <motion.div
      animate={{ 
        x: [-5, 5, -5],
        y: [5, -5, 5]
      }}
      transition={{ 
        duration: 6, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/30 rounded-full"
    />
  </div>
);

// Enhanced animated icon wrapper with pulse effect
const AnimatedIcon = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <motion.div
    whileHover={{ 
      scale: 1.15, 
      rotate: 10,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={cn("p-3 rounded-xl shadow-sm", color)}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// Metric badge component
const MetricBadge = ({ value, label }: { value: string; label: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
  >
    <span className="text-sm font-bold">{value}</span>
    <span className="text-xs opacity-80">{label}</span>
  </motion.div>
);

export default function JobFlixDifferentiators() {
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
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-content1/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.05),transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6"
            >
              <Sparkles size={16} />
              Platform Differentiators
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Why{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                JobFlix
              </span>{' '}
              Works Differently
            </h2>
            
            <p className="text-xl sm:text-2xl text-default-600 max-w-4xl mx-auto leading-relaxed">
              The only platform designed exclusively for{' '}
              <span className="font-semibold text-primary">senior professionals</span> who deserve more than job boards.
              <br />
              <span className="text-lg text-default-500 mt-2 block">Fast, credible, and intentionally curated.</span>
            </p>
            
            {/* Key metrics */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <MetricBadge value="<24h" label="response time" />
              <MetricBadge value="92%" label="offer success" />
              <MetricBadge value="100%" label="role verification" />
              <MetricBadge value="500+" label="senior roles" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <BentoGrid className="max-w-7xl mx-auto">
            {jobflixFeatures.map((item, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <BentoGridItem
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                  className={cn(
                    "group border-default-200/60 bg-content1/90 backdrop-blur-md hover:bg-content1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 dark:border-default-100/20 dark:bg-content1/50",
                    item.className
                  )}
                />
              </motion.div>
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}

const jobflixFeatures = [
  {
    title: "Skip the noise. Get matched instantly.",
    description: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">AI-Powered Precision</span>
        </div>
        <div className="text-sm leading-relaxed">
          Our AI analyzes your expertise and matches you with roles that actually fit your career goals — not just keywords.
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">Technical depth</span>
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">Team culture</span>
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">Growth potential</span>
        </div>
        <div className="text-xs text-default-500 mt-2 italic">
          Fresh opportunities delivered daily, pre-screened for senior-level impact
        </div>
      </div>
    ),
    header: <JobFlixSkeleton gradient="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" icon={<Brain className="h-8 w-8" />} />,
    icon: (
      <AnimatedIcon color="bg-primary/10 text-primary">
        <Brain className="h-6 w-6" />
      </AnimatedIcon>
    ),
    className: "md:col-span-2",
  },
  {
    title: "Talk to decision-makers, not recruiters",
    description: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-secondary" />
          <span className="font-semibold text-secondary">Direct Line to Leadership</span>
        </div>
        <div className="text-sm leading-relaxed">
          Skip the middleman. Get warm introductions directly to hiring managers and team leads who make the decisions.
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Clock className="h-3 w-3 text-secondary" />
          <span className="text-xs font-medium text-secondary">Guaranteed response within 24 hours</span>
        </div>
        <div className="text-xs text-default-500 mt-2 italic">
          Personal Slack/email intros with optional white-glove support
        </div>
      </div>
    ),
    header: <JobFlixSkeleton gradient="bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent" icon={<UserCheck className="h-8 w-8" />} />,
    icon: (
      <AnimatedIcon color="bg-secondary/10 text-secondary">
        <UserCheck className="h-6 w-6" />
      </AnimatedIcon>
    ),
  },
  {
    title: "No fake jobs. No bait-and-switch.",
    description: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-success" />
          <span className="font-semibold text-success">Triple-Verified Opportunities</span>
        </div>
        <div className="text-sm leading-relaxed">
          Every role is personally vetted by our team. Real companies, real budgets, real hiring intent.
        </div>
        <div className="flex items-center gap-2 mt-3">
          <CheckCircle className="h-3 w-3 text-success" />
          <span className="text-xs font-medium text-success">100% authenticity guarantee</span>
        </div>
        <div className="text-xs text-default-500 mt-2 italic">
          Salary ranges, company culture, and leadership track records all verified
        </div>
      </div>
    ),
    header: <JobFlixSkeleton gradient="bg-gradient-to-br from-success/20 via-success/10 to-transparent" icon={<Award className="h-8 w-8" />} />,
    icon: (
      <AnimatedIcon color="bg-success/10 text-success">
        <Award className="h-6 w-6" />
      </AnimatedIcon>
    ),
  },
  {
    title: "Your career deserves a strategy, not just a search",
    description: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-warning" />
          <span className="font-semibold text-warning">Strategic Career Partnership</span>
        </div>
        <div className="text-sm leading-relaxed">
          Work with senior professionals who've been where you want to go. Get personalized roadmaps, not generic advice.
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded-full">Market intelligence</span>
          <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded-full">Skill gap analysis</span>
          <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded-full">Progress tracking</span>
        </div>
        <div className="text-xs text-default-500 mt-2 italic">
          Monthly check-ins with industry veterans who understand your level
        </div>
      </div>
    ),
    header: <JobFlixSkeleton gradient="bg-gradient-to-br from-warning/20 via-warning/10 to-transparent" icon={<Compass className="h-8 w-8" />} />,
    icon: (
      <AnimatedIcon color="bg-warning/10 text-warning">
        <Compass className="h-6 w-6" />
      </AnimatedIcon>
    ),
    className: "md:col-span-2",
  },
];
