'use client';

import { motion } from 'framer-motion';
import { Users, ArrowRight, CheckCircle, Star, Building } from 'lucide-react';
import Link from 'next/link';

export default function HireTalentPage() {
  const benefits = [
    'Pre-screened candidates',
    'Direct communication',
    'Verified portfolios',
    'Fast hiring process',
    'Quality guarantee',
    'Dedicated support'
  ];

  const stats = [
    { label: 'Active Candidates', value: '15,000+' },
    { label: 'Successful Hires', value: '5,000+' },
    { label: 'Average Time to Hire', value: '7 days' },
    { label: 'Client Satisfaction', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="container mx-auto px-6 pt-24 pb-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
            <Building size={16} />
            <span>For Recruiters & Companies</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hire Top Talent
            <span className="block text-primary">Faster Than Ever</span>
          </h1>
          
          <p className="text-xl text-muted-fg max-w-3xl mx-auto leading-relaxed">
            Connect with pre-screened developers, designers, and tech professionals. 
            Skip the lengthy screening process and hire quality candidates in days, not months.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-primary-fg px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              Post a Job
              <ArrowRight size={20} />
            </motion.button>
            
            <Link
              href="/contact"
              className="bg-card border-2 border-border text-card-fg px-8 py-4 rounded-lg font-semibold text-lg hover:bg-muted transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <Users size={20} />
              Schedule Demo
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-fg">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-8 mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Choose JobFlix for Hiring?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle size={20} className="text-primary flex-shrink-0" />
                <span className="text-card-fg">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-border"
        >
          <Star className="mx-auto mb-4 text-primary" size={48} />
          <h3 className="text-2xl font-bold mb-4">Ready to Start Hiring?</h3>
          <p className="text-muted-fg mb-6 max-w-2xl mx-auto">
            Join hundreds of companies that have found their perfect candidates through JobFlix. 
            Post your first job today and see the difference quality makes.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-primary-fg px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-200 inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
