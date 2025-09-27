'use client';

import React, { useState } from "react";
import { Button, Link } from "@heroui/react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, UserPlus, Target, Zap, Sparkles, Shield, Star } from "lucide-react";

export default function CareerAdvancement() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

    const features = [
      { 
        icon: UserPlus, 
        title: "Professional Profiling", 
        description: "Comprehensive career assessment and skills matching",
        color: "accent"
      },
      { 
        icon: Target, 
        title: "Smart Matching", 
        description: "Intelligent algorithms for optimal job alignment",
        color: "primary"
      },
      { 
        icon: Zap, 
        title: "Direct Access", 
        description: "Connect directly with hiring managers and recruiters",
        color: "accent"
      }
    ];

  return (
    <section className="relative w-full py-24 bg-bg">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Content */}
        <div className="text-center space-y-16">
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Professional Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border text-card-fg font-medium shadow-lg"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <Sparkles size={16} className="text-accent" />
              <span>Professional Career Development</span>
              <Shield size={16} className="text-muted-fg" />
            </motion.div>

            {/* Main Headline */}
            <div className="relative">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="block text-fg mb-2">
                  Advance Your Career
                </span>
                <span className="block text-primary">
                  With Confidence
                </span>
              </h2>
            </div>

            <p className="text-xl text-muted-fg leading-relaxed max-w-3xl mx-auto">
              Professional development through strategic connections and expert guidance.
              <br />
              <span className="text-accent font-medium">Your success is our priority.</span>
            </p>
          </motion.div>

          {/* Professional Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="relative group cursor-default"
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* Professional card with theme-aware background */}
                  <div className="relative p-8 rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="text-center space-y-4">
                      {/* Icon */}
                      <div className="inline-flex p-4 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors duration-200">
                        <IconComponent size={32} className={`text-${feature.color}`} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-card-fg">
                        {feature.title}
                      </h3>
                      
                      <p className="text-muted-fg leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Status indicator */}
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <div className={`w-2 h-2 rounded-full bg-${feature.color}`} />
                        <span className="text-xs text-muted-fg uppercase tracking-wider">Available</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Professional Action Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              as={Link}
              href="/auth/signup"
              size="lg"
              className="bg-primary text-primary-fg font-semibold px-10 py-4 text-lg rounded-lg hover:opacity-90 transition-all duration-200 min-w-[220px] shadow-sm hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                <Star size={20} />
                Get Started
                <ArrowRight size={20} />
              </span>
            </Button>
            
            <Button
              as={Link}
              href="/jobs"
              variant="bordered"
              size="lg"
              className="bg-card border-2 border-border text-card-fg font-semibold px-10 py-4 text-lg rounded-lg hover:bg-muted transition-all duration-200 min-w-[220px]"
            >
              <Zap size={18} />
              Browse Jobs
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
