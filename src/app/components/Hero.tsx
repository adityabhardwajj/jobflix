'use client';

import {
  Button,
  Link,
} from '@heroui/react';
import { motion, useReducedMotion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowRight, Shield, Play, Sparkles, Zap, Target, Users } from 'lucide-react';

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
  const containerRef = useRef<HTMLElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: shouldReduceMotion ? 0.1 : 1.2, 
        ease: [0.23, 1, 0.32, 1],
        type: "spring",
        damping: 25,
        stiffness: 100
      },
    },
  };

  return (
        <section 
          ref={containerRef}
          className="relative min-h-screen flex flex-col items-center justify-center bg-bg"
        >

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Professional Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border text-card-fg font-medium shadow-lg"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            <Shield size={16} className="text-accent" />
            <span>Verified • Trusted • Professional</span>
            <Sparkles size={14} className="text-muted-fg" />
          </motion.div>

          {/* Hero Headline */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-fg mb-4">
                  Your Career,
                </span>
                <span className="block text-primary">
                  Your Next Step
                </span>
              </h1>
            </div>
            
            <p className="text-xl sm:text-2xl text-muted-fg leading-relaxed max-w-4xl mx-auto">
              Professional opportunities. Trusted connections. Career growth.
              <br />
              <span className="text-accent font-medium">Building careers with purpose and precision.</span>
            </p>
          </motion.div>

          {/* Professional CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              as={Link}
              href="/jobs"
              size="lg"
              className="bg-primary text-primary-fg font-semibold px-8 py-4 text-lg rounded-lg hover:opacity-90 transition-all duration-200 min-w-[200px] shadow-sm hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                Find Opportunities
                <ArrowRight size={20} />
              </span>
            </Button>
            
            <Button
              as={Link}
              href="/about"
              variant="bordered"
              size="lg"
              className="bg-card border-2 border-border text-card-fg font-semibold px-8 py-4 text-lg rounded-lg hover:bg-muted transition-all duration-200 min-w-[200px]"
            >
              <Play size={18} />
              Learn More
            </Button>
          </motion.div>

          {/* Professional Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-16 max-w-5xl mx-auto"
          >
                  {[
                { label: 'Active Jobs', value: 15000, suffix: '+', sub: 'Open positions', color: 'primary', icon: Target },
                { label: 'Companies', value: 750, suffix: '+', sub: 'Trusted partners', color: 'accent', icon: Shield },
                { label: 'Success Rate', value: 98, suffix: '%', sub: 'Placement success', color: 'primary', icon: Zap },
                { label: 'Professionals', value: 2500, suffix: '+', sub: 'Network members', color: 'accent', icon: Users },
              ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div 
                  key={stat.label} 
                  className="relative group cursor-default"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Professional card with theme-aware background */}
                  <div className="relative p-6 rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="text-center space-y-3">
                      <div className="inline-flex p-3 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors duration-200">
                        <IconComponent size={24} className={`text-${stat.color}`} />
                      </div>
                      <div className={`text-3xl lg:text-4xl font-bold text-${stat.color}`}>
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-base font-semibold text-card-fg">{stat.label}</div>
                      <div className="text-sm text-muted-fg">{stat.sub}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
