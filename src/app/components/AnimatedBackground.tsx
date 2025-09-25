'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'hero' | 'section' | 'minimal';
  className?: string;
}

export default function AnimatedBackground({ 
  variant = 'hero', 
  className = '' 
}: AnimatedBackgroundProps) {
  if (variant === 'minimal') {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        
        {/* Floating geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 opacity-10"
            style={{
              left: `${10 + (i * 15) % 80}%`,
              top: `${10 + (i * 20) % 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl" />
          </motion.div>
        ))}
      </div>
    );
  }

  // Hero variant
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800" />
      
      {/* Overlay image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Animated floating orbs */}
      <div className="absolute inset-0">
        {/* Primary orbs */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <motion.div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        
        {/* Secondary floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 opacity-20"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${10 + (i * 15) % 80}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-white/10 to-blue-300/20 rounded-full blur-xl" />
          </motion.div>
        ))}
        
        {/* Small floating dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-4 h-4 bg-white/30 rounded-full"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${5 + (i * 7) % 90}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* Floating tech elements */}
      <div className="absolute inset-0">
        {['💻', '🚀', '⚡', '🎯', '💡', '🔧'].map((emoji, i) => (
          <motion.div
            key={emoji}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${15 + (i * 15) % 70}%`,
              top: `${20 + (i * 12) % 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Particle system component
export function ParticleSystem({ count = 50 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Floating cards component
export function FloatingCards() {
  const cards = [
    { icon: '💼', text: 'Find Jobs', color: 'from-blue-500 to-cyan-500' },
    { icon: '🎯', text: 'Apply Smart', color: 'from-purple-500 to-pink-500' },
    { icon: '🚀', text: 'Grow Career', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cards.map((card, i) => (
        <motion.div
          key={card.text}
          className="absolute w-24 h-16 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex flex-col items-center justify-center"
          style={{
            left: `${20 + (i * 30) % 60}%`,
            top: `${30 + (i * 20) % 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div className="text-2xl mb-1">{card.icon}</div>
          <div className="text-xs text-white/80 font-medium">{card.text}</div>
        </motion.div>
      ))}
    </div>
  );
}
