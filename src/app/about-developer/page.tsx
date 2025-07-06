'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const AboutDeveloper = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const cards = [
    {
      icon: '🧠',
      title: 'Skills',
      content: 'React, Node.js, FastAPI, MongoDB, TailwindCSS, AI Prompt Engineering'
    },
    {
      icon: '🎓',
      title: 'Education',
      content: 'Cultural Head at Oriental College (2023–2025)'
    },
    {
      icon: '🚀',
      title: 'Projects',
      content: 'E-commerce website, Jobflix'
    },
    {
      icon: '🌐',
      title: 'GitHub',
      content: 'github.com/adityabhardwajj'
    },
    {
      icon: '🔗',
      title: 'LinkedIn',
      content: 'linkedin.com/in/aditya-bhardwaj-961198232'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Built by Aditya Bhardwaj
          </h1>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Hey there! I'm Aditya — the mind and maker behind Jobflix.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.1 }}
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{card.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link href="/">
            <button className="group relative inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg overflow-hidden transition-all duration-300 hover:bg-blue-700">
              <span className="relative z-10 flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutDeveloper; 