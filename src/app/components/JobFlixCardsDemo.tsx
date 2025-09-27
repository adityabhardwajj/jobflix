'use client';

import React, { useState } from 'react';
import JobFlixCards from './JobFlixCards';
import { jobFlixCardsData, featuredCardsData } from '../data/cards';
import { motion } from 'framer-motion';
import { Sparkles, Grid3X3 } from 'lucide-react';

const JobFlixCardsDemo: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<'main' | 'featured'>('main');
  
  const currentData = selectedDataset === 'main' ? jobFlixCardsData : featuredCardsData;
  
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium mb-6">
            <Grid3X3 size={16} />
            <span>3D Card Grid Demo</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4">
            JobFlix Cards
            <span className="block text-primary">Interactive Experience</span>
          </h1>
          
          <p className="text-lg text-muted-fg max-w-2xl mx-auto mb-8">
            Experience smooth 3D animations, depth layers, and premium interactions. 
            Hover over cards to see the magic in action.
          </p>
          
          {/* Dataset Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedDataset('main')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedDataset === 'main'
                  ? 'bg-primary text-primary-fg'
                  : 'bg-card border border-border text-card-fg hover:bg-muted'
              }`}
            >
              Main Services
            </button>
            <button
              onClick={() => setSelectedDataset('featured')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedDataset === 'featured'
                  ? 'bg-primary text-primary-fg'
                  : 'bg-card border border-border text-card-fg hover:bg-muted'
              }`}
            >
              Featured Content
            </button>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <JobFlixCards cards={currentData} />
        
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-fg mb-2">True 3D Effects</h3>
            <p className="text-sm text-muted-fg">
              Real depth with transform-style: preserve-3d and translateZ layers
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="text-accent" size={24} />
            </div>
            <h3 className="font-bold text-fg mb-2">Responsive Grid</h3>
            <p className="text-sm text-muted-fg">
              1 column mobile, 2 columns tablet, 3 columns desktop
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-lg">♿</span>
            </div>
            <h3 className="font-bold text-fg mb-2">Fully Accessible</h3>
            <p className="text-sm text-muted-fg">
              Keyboard navigation, ARIA labels, reduced motion support
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobFlixCardsDemo;
