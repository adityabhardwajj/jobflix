'use client';

import React from "react";
import { FocusCards } from "@/components/ui/focus-cards";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, CheckCircle, Users, Award } from "lucide-react";

export default function JobGuards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const jobGuardCards = [
    {
      title: "Verified Companies Only",
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Salary Transparency",
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Direct Manager Access",
      src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Background Verified",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Team Culture Match",
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Growth Guarantee",
      src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const guardFeatures = [
    {
      icon: Shield,
      title: "Fraud Protection",
      description: "Every job posting is manually verified by our team to ensure legitimacy and prevent scams."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your personal information is never shared without your explicit consent and approval."
    },
    {
      icon: Eye,
      title: "Transparent Process",
      description: "Clear salary ranges, company culture insights, and honest job requirements upfront."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Only companies with proven track records and positive employee reviews make it through."
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-background via-content1/20 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium border border-success/20"
            >
              <Shield size={16} />
              Job Guards
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Career{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-success via-primary to-success">
                Protection
              </span>{' '}
              System
            </h2>
            
            <p className="text-xl text-default-600 max-w-3xl mx-auto leading-relaxed">
              Advanced safeguards that protect your career journey from fraud, ensure transparency, and guarantee quality opportunities.
            </p>
          </motion.div>
        </motion.div>

        {/* Focus Cards Gallery */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <FocusCards cards={jobGuardCards} />
        </motion.div>

        {/* Guard Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {guardFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="text-center p-6 rounded-xl bg-content1/60 border border-default-200/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 text-success mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-default-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16 p-8 rounded-2xl bg-success/5 border border-success/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-success mb-2">100%</div>
              <div className="text-sm text-default-600">Verified Companies</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-success mb-2">0</div>
              <div className="text-sm text-default-600">Fraud Reports</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-success mb-2">24/7</div>
              <div className="text-sm text-default-600">Protection Active</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
