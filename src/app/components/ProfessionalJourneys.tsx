'use client';

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { motion } from "framer-motion";
import { Quote, Star, Briefcase } from "lucide-react";

export default function ProfessionalJourneys() {
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

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-background via-content1/30 to-background overflow-hidden">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20"
            >
              <Briefcase size={16} />
              Professional Journeys
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Real stories from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                professionals
              </span>
            </h2>
            
            <p className="text-xl text-default-600 max-w-3xl mx-auto leading-relaxed">
              Who changed roles faster with verified intros.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          <InfiniteMovingCards
            items={professionalTestimonials}
            direction="right"
            speed="slow"
            pauseOnHover={true}
            className="py-8"
          />
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16"
        >
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span>4.9/5 average rating</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Quote className="w-4 h-4 text-primary" />
            <span>500+ success stories</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Briefcase className="w-4 h-4 text-secondary" />
            <span>Average 2 weeks to offer</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const professionalTestimonials = [
  {
    quote: "Transparent process. Two weeks to offer. The direct connection to the hiring manager made all the difference - no endless rounds with recruiters.",
    name: "Sarah Chen",
    title: "Senior Engineer, Google",
  },
  {
    quote: "Direct connection made all the difference. I was speaking with the actual team lead within 24 hours. The whole process felt authentic and respectful of my time.",
    name: "Michael Rodriguez", 
    title: "Product Manager, Microsoft",
  },
  {
    quote: "Remote role found without noise. JobFlix filtered out all the irrelevant positions and connected me directly with companies that matched my values and career goals.",
    name: "Emily Johnson",
    title: "Designer, Apple",
  },
  {
    quote: "The verification process gave me confidence that these were real opportunities with real budgets. No more wasting time on fake job postings.",
    name: "David Kim",
    title: "Staff Engineer, Stripe",
  },
  {
    quote: "Within a week, I had three warm introductions to senior leadership roles. The quality of opportunities was unmatched compared to traditional job boards.",
    name: "Lisa Thompson",
    title: "VP Engineering, Airbnb",
  },
  {
    quote: "The mentor-led approach helped me understand my market value and negotiate a 40% salary increase. This platform is a game-changer for senior professionals.",
    name: "James Wilson",
    title: "Principal Architect, Netflix",
  },
];
