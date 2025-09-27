'use client';

import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MinimalHero() {
  return (
    <section className="relative overflow-hidden bg-bg">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
              Professional Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-fg mb-6"
          >
            Your Career Platform for{' '}
            <span className="text-accent">Modern Professionals</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-muted-fg leading-relaxed mb-10 max-w-2xl"
          >
            Discover opportunities, stay updated with industry insights, build your skills, and get AI-powered career guidance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              as={Link}
              href="/jobs"
              size="lg"
              className="bg-primary text-primary-fg hover:bg-primary/90 px-8 py-3 text-base font-semibold transition-all duration-200"
              endContent={<ArrowRight size={18} />}
            >
              Explore Jobs
            </Button>
            <Button
              as={Link}
              href="/tech-news"
              variant="bordered"
              size="lg"
              className="border-border text-fg hover:bg-muted px-8 py-3 text-base font-semibold transition-all duration-200"
            >
              Read Tech News
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 sm:gap-12"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-fg">15K+</div>
              <div className="text-sm text-muted-fg mt-1">Active Professionals</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-fg">2.5K+</div>
              <div className="text-sm text-muted-fg mt-1">Job Opportunities</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-fg">500+</div>
              <div className="text-sm text-muted-fg mt-1">Daily Updates</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decoration - Minimal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
    </section>
  );
}
