'use client';

import {
  Button,
  Link,
} from '@heroui/react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import { SparklesCore } from '@/components/ui/sparkles';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

// Animated counter component
function AnimatedCounter({ 
  end, 
  suffix = '', 
  duration = 2000 
}: { 
  end: number; 
  suffix?: string; 
  duration?: number; 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endTime = startTime + (shouldReduceMotion ? 100 : duration);

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * end));

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, end, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className="font-semibold tracking-tight">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}



export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  
  const flipWords = [
    'verified opportunities',
    'direct connections', 
    'career growth',
    'meaningful work'
  ];

  const typewriterWords = [
    {
      text: "Your",
      className: "text-foreground",
    },
    {
      text: "Career,",
      className: "text-foreground",
    },
    {
      text: "Your",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary",
    },
    {
      text: "Next",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary",
    },
    {
      text: "Step",
      className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Sparkles Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-background via-content1/30 to-background">
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
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
            <Shield size={16} />
            Verified roles. Real connections.
          </motion.div>

          {/* Main Headline with Typewriter Effect */}
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
                A precise way to find meaningful work and connect with decision-makers.
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              as={Link}
              href="/jobs"
              color="primary"
              size="lg"
              radius="full"
              endContent={<ArrowRight size={20} />}
              className="font-semibold px-8 py-6 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40"
            >
              Get Started
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 max-w-5xl mx-auto"
          >
            {[
              { label: 'Active Jobs', value: 10000, suffix: '+', sub: 'Curated and updated daily' },
              { label: 'Verified Companies', value: 500, suffix: '+', sub: 'Startups to Fortune 500' },
              { label: 'Success Rate', value: 92, suffix: '%', sub: 'Offers within 30 days' },
              { label: 'Decision-Maker Intros', value: 1200, suffix: '+', sub: 'Warm intros each month' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-default-700 mb-1">{stat.label}</div>
                <div className="text-xs text-default-500">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent h-[2px] w-3/4 blur-sm" />
      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-px w-3/4" />
      <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-secondary/40 to-transparent h-[5px] w-1/4 blur-sm" />
      <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-secondary/60 to-transparent h-px w-1/4" />

      {/* Radial Gradient Mask */}
      <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(50%_50%_at_50%_50%,transparent_0%,black_100%)]" />
    </section>
  );
}
