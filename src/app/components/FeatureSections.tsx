'use client';

import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Avatar,
  Button,
  Link,
  Chip,
  Divider,
} from '@heroui/react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { 
  Brain, 
  Sparkles, 
  ShieldCheck, 
  Route, 
  Quote,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';

// Differentiators Section
function DifferentiatorsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      title: 'Intelligent Matching',
      description: 'AI pairs skills with verified opportunities the moment they go live.',
      icon: Brain,
      color: 'primary' as const,
      meta: 'Personalised feed in minutes',
    },
    {
      title: 'Direct Access',
      description: 'Warm introductions to hiring managers — no cold outreach required.',
      icon: Sparkles,
      color: 'secondary' as const,
      meta: 'Average reply in 24 hours',
    },
    {
      title: 'Verified Roles',
      description: 'Every listing is screened and backed by JobFlix credibility signals.',
      icon: ShieldCheck,
      color: 'success' as const,
      meta: 'Fraud-free guarantee',
    },
    {
      title: 'Guided Growth',
      description: 'Structured insights and targets aligned to where you want to go next.',
      icon: Route,
      color: 'warning' as const,
      meta: 'Mentor-led planning',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-semibold tracking-tight">
            What Sets JobFlix Apart
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto">
            An opinionated platform built for senior talent — fast, credible, and intentional.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const accentClasses: Record<string, string> = {
              primary: 'bg-primary/10 text-primary',
              secondary: 'bg-secondary/10 text-secondary',
              success: 'bg-success/10 text-success',
              warning: 'bg-warning/10 text-warning',
            };

            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card
                  className="h-full border border-default-200/60 bg-background/90 backdrop-blur hover:border-primary/40 hover:shadow-primary/25 transition-all duration-200"
                  shadow="sm"
                  isPressable
                >
                  <CardBody className="p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accentClasses[feature.color]}`}>
                        <IconComponent size={22} />
                      </div>
                      <Chip variant="flat" color={feature.color} size="sm" className="text-xs">
                        {feature.meta}
                      </Chip>
                    </div>
                    <div className="space-y-3 text-left">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-default-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <Divider className="bg-default-200/70" />
                    <div className="text-xs text-default-500">
                      {index === 0 && 'Matching across role, culture, and trajectory — refreshed daily.'}
                      {index === 1 && 'Direct Slack and email intros with optional white-glove follow up.'}
                      {index === 2 && 'JobFlix verifies compensation, mission, and leadership credibility.'}
                      {index === 3 && 'Applied insights, curated reading, and accountability rituals.'}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineer, Google',
      quote: 'Transparent process. Two weeks to offer.',
      avatar: '/images/peeps/peep-1.png',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager, Microsoft',
      quote: 'Direct connection made all the difference.',
      avatar: '/images/peeps/peep-2.png',
    },
    {
      name: 'Emily Johnson',
      role: 'Designer, Apple',
      quote: 'Remote role found without noise.',
      avatar: '/images/peeps/peep-3.png',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="py-20 px-6 bg-content1/80 backdrop-blur">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Professional Journeys
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto">
            Real stories from professionals who changed roles faster with verified intros.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={itemVariants}>
              <Card
                className="h-full border border-default-200/60 bg-background/90 backdrop-blur hover:border-primary/40 transition-all duration-200"
                shadow="sm"
              >
                <CardBody className="p-7 space-y-5">
                  <Quote size={24} className="text-primary" />
                  <blockquote className="text-base sm:text-lg font-medium leading-relaxed text-foreground/90">
                    “{testimonial.quote}”
                  </blockquote>
                  <Divider className="bg-default-200/80" />
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      size="sm"
                      fallback={<User size={20} />}
                    />
                    <div>
                      <div className="font-semibold text-sm text-foreground">{testimonial.name}</div>
                      <div className="text-xs text-default-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// News Section
function NewsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  const newsCategories = ['AI/ML', 'Frontend', 'Backend', 'Web Dev'];
  
  const articles = [
    {
      category: 'AI/ML',
      title: 'Machine Learning Infrastructure Trends in 2025',
      excerpt: 'How leading companies are scaling ML operations.',
      date: '2025-01-15',
      readTime: '5 min read',
    },
    {
      category: 'Frontend',
      title: 'React Server Components: Production Insights',
      excerpt: 'Real-world implementation patterns and performance gains.',
      date: '2025-01-12',
      readTime: '7 min read',
    },
    {
      category: 'Backend',
      title: 'Microservices Architecture: Lessons Learned',
      excerpt: 'Key considerations for distributed system design.',
      date: '2025-01-10',
      readTime: '6 min read',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Insights That Matter
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-default-600 max-w-2xl mx-auto">
            Stay ahead with curated technical briefings — data-backed, concise, and signal-heavy.
          </motion.p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <Tabs 
            aria-label="News categories" 
            className="flex justify-center mb-12"
            variant="underlined"
            color="primary"
          >
            {newsCategories.map((category) => (
              <Tab key={category} title={category} />
            ))}
          </Tabs>

          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card
                key={article.title}
                className="border border-default-200/60 bg-background/90 backdrop-blur hover:border-primary/40 transition-all duration-200"
                shadow="sm"
                isPressable
              >
                <CardBody className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <Chip size="sm" color="primary" variant="flat" className="uppercase tracking-wide text-[11px]">
                      {article.category}
                    </Chip>
                    <span className="text-xs text-default-500 flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg leading-tight text-foreground">
                      {article.title}
                    </h3>
                    <p className="text-sm text-default-600 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-default-500">
                    <span>{article.readTime}</span>
                    <Button as={Link} href="#" size="sm" variant="light" radius="full" className="text-xs">
                      Read briefing
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button
              as={Link}
              href="/tech-news"
              variant="bordered"
              endContent={<ArrowRight size={16} />}
              className="font-medium"
            >
              View All Articles
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Final CTA Section
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-br from-primary/8 to-secondary/8 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            Advance Your Career with Confidence
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-default-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create a profile, get tailored matches, and connect with decision-makers. Your next opportunity is waiting.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button
              as={Link}
              href="/auth/signup"
              color="primary"
              size="lg"
              radius="lg"
              endContent={<ArrowRight size={20} />}
              className="font-semibold px-8 py-6 text-base shadow-lg shadow-primary/25 hover:shadow-primary/35"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Main component that combines all sections
export default function FeatureSections() {
  return (
    <>
      <DifferentiatorsSection />
      <TestimonialsSection />
      <NewsSection />
      <CTASection />
    </>
  );
}
