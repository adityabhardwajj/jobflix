'use client';

import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { Button, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus, Target, Zap } from "lucide-react";

export default function CareerAdvancement() {
  return (
    <section className="relative w-full">
      <div className="w-full mx-auto rounded-none h-[40rem] overflow-hidden">
        <Vortex
          backgroundColor="hsl(var(--heroui-background))"
          baseHue={220}
          particleCount={500}
          baseSpeed={0.1}
          rangeSpeed={1.2}
          baseRadius={1}
          rangeRadius={3}
          className="flex items-center flex-col justify-center px-6 md:px-10 py-8 w-full h-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
            >
              <Zap size={16} />
              Career Acceleration
            </motion.div>

            {/* Main Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-foreground text-3xl md:text-5xl lg:text-6xl font-bold text-center leading-tight"
            >
              Advance Your Career
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                with Confidence
              </span>
            </motion.h2>

            {/* Subtitle - Two Lines Only */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-default-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed space-y-2"
            >
              <p>Create a profile, get tailored matches, and connect with decision-makers. Your next opportunity is waiting.</p>
              <p className="flex items-center justify-center gap-4 text-base font-medium">
                <span className="flex items-center gap-2">
                  <UserPlus size={16} className="text-primary" />
                  Create Profile
                </span>
                <span className="text-default-400">→</span>
                <span className="flex items-center gap-2">
                  <Target size={16} className="text-secondary" />
                  Get Matched
                </span>
                <span className="text-default-400">→</span>
                <span className="flex items-center gap-2">
                  <Zap size={16} className="text-success" />
                  Connect & Grow
                </span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
            >
              <Button
                as={Link}
                href="/auth/signup"
                color="primary"
                size="lg"
                radius="full"
                endContent={<ArrowRight size={20} />}
                className="font-semibold px-8 py-6 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 min-w-[200px]"
              >
                Start Your Journey
              </Button>
              
              <Button
                as={Link}
                href="/jobs"
                variant="bordered"
                size="lg"
                radius="full"
                className="font-semibold px-8 py-6 text-lg border-default-300 hover:border-primary hover:bg-primary/5 min-w-[200px]"
              >
                Explore Opportunities
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-12"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-success/10 border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">500+ Senior Roles</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">92% Success Rate</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-sm font-medium text-secondary">24hr Response</span>
              </div>
            </motion.div>
          </motion.div>
        </Vortex>
      </div>
    </section>
  );
}
