'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeStore, swipeActions } from '@/lib/store';
import { JobCard3D } from './JobCard3D';
import { CardActions, CardActionsCompact } from './CardActions';
import { createPointerHandlers, createTouchHandlers, createKeyboardHandler } from '@/lib/gestures';
import { SwipeDirection } from '@/lib/schemas';
import { toast } from 'react-hot-toast';

interface SwipeDeckProps {
  className?: string;
}

export function SwipeDeck({ className = '' }: SwipeDeckProps) {
  const {
    cards,
    currentIndex,
    isAnimating,
    getCurrentCard,
    getRemainingCards,
    isDeckEmpty,
    swipeCard,
    hydrate
  } = useSwipeStore();

  const [isMobile, setIsMobile] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Initialize deck
    hydrate();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [hydrate]);

  const currentCard = getCurrentCard();
  const remainingCards = getRemainingCards();
  const isEmpty = isDeckEmpty();

  const handleSwipe = (direction: SwipeDirection) => {
    if (isAnimating || !currentCard) return;

    // Show toast based on action
    switch (direction) {
      case 'right':
        toast.success('Applied! 🎉', { duration: 2000 });
        break;
      case 'left':
        toast('Skipped', { duration: 1000 });
        break;
      case 'up':
        toast.success('Saved! 💾', { duration: 2000 });
        break;
      case 'down':
        toast('Viewing details...', { duration: 1000 });
        break;
    }

    swipeCard(direction);
  };

  const handleDrag = (x: number, y: number) => {
    setDragOffset({ x, y });
  };

  const handleDragEnd = (x: number, y: number) => {
    setDragOffset({ x: 0, y: 0 });
  };

  const pointerHandlers = createPointerHandlers(handleSwipe, () => {});
  const touchHandlers = createTouchHandlers(handleSwipe, () => {});
  const keyboardHandler = createKeyboardHandler(handleSwipe);

  // Empty state
  if (isEmpty) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center min-h-[600px] ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">🎯</span>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No more jobs to swipe!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've seen all available jobs. Check back later for new opportunities.
          </p>
          <motion.button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            Refresh Jobs
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      {/* Deck container */}
      <div className="relative h-[600px] w-full">
        <AnimatePresence>
          {cards.slice(currentIndex, currentIndex + 3).map((card, index) => {
            const isActive = index === 0;
            const zIndex = 3 - index;
            const scale = 1 - index * 0.05;
            const yOffset = index * 8;

            return (
              <motion.div
                key={card.id}
                className="absolute inset-0"
                style={{ zIndex }}
                initial={{ 
                  scale: 0.8, 
                  opacity: 0, 
                  y: 50,
                  rotateY: 15 
                }}
                animate={{ 
                  scale: isActive ? 1 : scale,
                  opacity: isActive ? 1 : 0.8,
                  y: isActive ? dragOffset.y : yOffset,
                  x: isActive ? dragOffset.x : 0,
                  rotateY: isActive ? 0 : 5
                }}
                exit={{ 
                  scale: 0.8, 
                  opacity: 0,
                  rotateZ: dragOffset.x > 0 ? 15 : -15,
                  x: dragOffset.x > 0 ? 300 : -300,
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  delay: index * 0.1
                }}
              >
                <JobCard3D
                  job={card}
                  isActive={isActive}
                  isAnimating={isAnimating && index === 0}
                  onDrag={isActive ? handleDrag : undefined}
                  onDragEnd={isActive ? handleDragEnd : undefined}
                  {...(isActive ? pointerHandlers : {})}
                  {...(isActive ? touchHandlers : {})}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="mt-8">
        {isMobile ? (
          <CardActionsCompact
            onSwipeLeft={() => handleSwipe('left')}
            onSwipeRight={() => handleSwipe('right')}
            onSwipeUp={() => handleSwipe('up')}
            onSwipeDown={() => handleSwipe('down')}
            disabled={isAnimating}
          />
        ) : (
          <CardActions
            onSwipeLeft={() => handleSwipe('left')}
            onSwipeRight={() => handleSwipe('right')}
            onSwipeUp={() => handleSwipe('up')}
            onSwipeDown={() => handleSwipe('down')}
            disabled={isAnimating}
          />
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Use arrow keys or swipe gestures to navigate
        </p>
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
          <span>← Skip</span>
          <span>↑ Save</span>
          <span>→ Apply</span>
          <span>↓ Details</span>
        </div>
      </div>

      {/* Remaining cards counter */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {remainingCards} jobs remaining
        </span>
      </div>

      {/* Keyboard event listener */}
      <div
        tabIndex={0}
        onKeyDown={keyboardHandler}
        className="absolute inset-0 focus:outline-none"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
