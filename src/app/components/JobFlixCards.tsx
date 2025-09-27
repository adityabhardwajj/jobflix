'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { ArrowRight, Briefcase, Users, Newspaper, Lightbulb, Bot } from 'lucide-react';
import { JobFlixCardData, CardGridProps, IconName } from '../types/cards';

interface Card3DProps {
  card: JobFlixCardData;
  index: number;
}

// Icon mapping function
const getIconComponent = (iconName: IconName) => {
  const iconMap = {
    briefcase: Briefcase,
    users: Users,
    newspaper: Newspaper,
    lightbulb: Lightbulb,
    bot: Bot,
  };
  
  return iconMap[iconName] || Briefcase;
};

const Card3D: React.FC<Card3DProps> = ({ card, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Reduced tilt range for accessibility
  const tiltRange = shouldReduceMotion ? 3 : 10;
  
  // Spring configuration for smooth animations
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  
  // Transform mouse position to rotation values
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltRange, -tiltRange]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltRange, tiltRange]), springConfig);
  
  // Shadow and scale effects
  const shadowOpacity = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || shouldReduceMotion) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseXPct = (e.clientX - centerX) / (rect.width / 2);
    const mouseYPct = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(mouseXPct);
    mouseY.set(mouseYPct);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    shadowOpacity.set(0.25);
    scale.set(1.02);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    shadowOpacity.set(0);
    scale.set(1);
  };
  
  const IconComponent = getIconComponent(card.iconName);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      <Link href={card.href} className="block">
        <motion.div
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            scale,
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative min-h-[16rem] rounded-2xl transition-colors duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-white"
        >
          {/* Background Card */}
          <motion.div
            style={{
              boxShadow: useTransform(
                shadowOpacity,
                [0, 0.25],
                [
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 20px -5px rgba(0, 0, 0, 0.2)'
                ]
              ),
            }}
            className={`
              absolute inset-0 rounded-2xl border backdrop-blur-sm transition-all duration-300
              bg-white border-gray-200 shadow-sm
            `}
          />
          
          {/* Background Decoration - Parallax */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden opacity-20"
            style={{ transform: `translateZ(${shouldReduceMotion ? 0 : -10}px)` }}
          >
            <div 
              className={`
                absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-transform duration-500
                ${card.type === 'assistant' ? 'bg-blue-100' : card.type === 'job' ? 'bg-emerald-100' : 'bg-gray-100'}
              `}
              style={{ 
                transform: shouldReduceMotion 
                  ? 'translate(25%, -25%)' 
                  : `translate(25%, -25%) translateZ(-5px)` 
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl bg-gray-100"
              style={{ 
                transform: shouldReduceMotion 
                  ? 'translate(-25%, 25%)' 
                  : `translate(-25%, 25%) translateZ(-3px)` 
              }}
            />
          </div>
          
          {/* Content Container */}
          <div 
            className="relative p-6 h-full flex flex-col justify-between"
            style={{ transform: `translateZ(${shouldReduceMotion ? 0 : 20}px)` }}
          >
            {/* Header */}
            <div className="space-y-4">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                {card.badge && (
                  <div 
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                    style={{ transform: `translateZ(${shouldReduceMotion ? 0 : 15}px)` }}
                  >
                    {card.badge}
                  </div>
                )}
                <div 
                  className={`
                    p-3 rounded-xl transition-all duration-300
                    ${card.type === 'assistant' 
                      ? 'bg-blue-50 text-blue-600' 
                      : card.type === 'job'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-gray-50 text-gray-600'
                    }
                    ${isHovered ? 'scale-110' : 'scale-100'}
                  `}
                  style={{ transform: `translateZ(${shouldReduceMotion ? 0 : 25}px)` }}
                >
                  <IconComponent size={24} className="drop-shadow-sm" />
                </div>
              </div>
              
              {/* Title & Subtitle */}
              <div style={{ transform: `translateZ(${shouldReduceMotion ? 0 : 30}px)` }}>
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-sm font-medium text-gray-600 line-clamp-1">
                  {card.subtitle}
                </p>
              </div>
              
              {/* Description */}
              <p 
                className="text-sm text-gray-600 leading-relaxed line-clamp-3"
                style={{ transform: `translateZ(${shouldReduceMotion ? 0 : 20}px)` }}
              >
                {card.description}
              </p>
            </div>
            
            {/* Footer */}
            <div 
              className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200"
              style={{ transform: `translateZ(${shouldReduceMotion ? 0 : 35}px)` }}
            >
              {card.stats ? (
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{card.stats.value}</span> {card.stats.label}
                </div>
              ) : (
                <div className="text-xs text-gray-500">
                  Explore
                </div>
              )}
              
              <motion.div
                className="flex items-center gap-1 text-xs font-medium text-accent group-hover:text-primary transition-colors duration-200"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <span>View</span>
                <ArrowRight size={12} />
              </motion.div>
            </div>
          </div>
          
          {/* Focus indicator for keyboard navigation */}
          <div className="absolute inset-0 rounded-2xl ring-2 ring-accent ring-offset-2 ring-offset-white opacity-0 focus-within:opacity-100 transition-opacity duration-200" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

const JobFlixCards: React.FC<CardGridProps> = ({ cards, className = '' }) => {
  return (
    <section className={`py-16 ${className}`} aria-label="JobFlix Services">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-fg mb-4">
            Discover Your Next Opportunity
          </h2>
          <p className="text-lg text-muted-fg max-w-2xl mx-auto">
            Explore jobs, stay updated with tech news, find project ideas, and get AI-powered career guidance.
          </p>
        </div>
        
        {/* Cards Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          role="grid"
          aria-label="Service cards"
        >
          {cards.map((card, index) => (
            <div key={card.id} role="gridcell">
              <Card3D card={card} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobFlixCards;
