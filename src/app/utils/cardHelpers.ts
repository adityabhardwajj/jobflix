import { JobFlixCardData, CardType, IconName } from '../types/cards';

/**
 * Helper function to create a JobFlix card with default values
 */
export function createJobFlixCard(params: {
  id: string;
  type: CardType;
  title: string;
  subtitle: string;
  description: string;
  iconName: IconName;
  href: string;
  badge?: string;
  stats?: {
    label: string;
    value: string | number;
  };
  gradient?: string;
}): JobFlixCardData {
  return {
    id: params.id,
    type: params.type,
    title: params.title,
    subtitle: params.subtitle,
    description: params.description,
    iconName: params.iconName,
    href: params.href,
    badge: params.badge,
    stats: params.stats,
    gradient: params.gradient,
  };
}

/**
 * Card style variants based on type
 */
export const getCardTypeStyles = (type: CardType) => {
  const styles = {
    job: {
      primary: 'bg-card/95 dark:bg-card/90 border-border/50',
      accent: 'bg-primary/10 text-primary',
      gradient: 'from-primary/5 to-primary/10'
    },
    news: {
      primary: 'bg-card/90 dark:bg-white/[0.03] border-white/[0.08] dark:border-white/[0.12]',
      accent: 'bg-accent/10 text-accent',
      gradient: 'from-accent/5 to-accent/10'
    },
    project: {
      primary: 'bg-card/90 dark:bg-white/[0.03] border-white/[0.08] dark:border-white/[0.12]',
      accent: 'bg-muted/50 text-accent',
      gradient: 'from-muted/5 to-accent/5'
    },
    idea: {
      primary: 'bg-card/90 dark:bg-white/[0.03] border-white/[0.08] dark:border-white/[0.12]',
      accent: 'bg-muted/50 text-accent',
      gradient: 'from-muted/5 to-accent/5'
    },
    assistant: {
      primary: 'bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20',
      accent: 'bg-accent/10 text-accent',
      gradient: 'from-accent/10 to-primary/10'
    }
  };
  
  return styles[type];
};

/**
 * Performance optimization for 3D cards
 */
export const optimizeCardPerformance = () => {
  // Enable hardware acceleration for better performance
  if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      .card-3d {
        transform-style: preserve-3d;
        backface-visibility: hidden;
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Check if user prefers reduced motion
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Generate card grid classes based on screen size
 */
export const getGridClasses = (variant: 'default' | 'compact' | 'wide' = 'default') => {
  const variants = {
    default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    compact: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    wide: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  };
  
  return `grid ${variants[variant]} gap-6 lg:gap-8`;
};

/**
 * Card animation configurations
 */
export const cardAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }
};

/**
 * Tilt configuration based on user preferences
 */
export const getTiltConfig = () => {
  const reduceMotion = shouldReduceMotion();
  
  return {
    tiltRange: reduceMotion ? 3 : 10,
    springConfig: { damping: 25, stiffness: 300, mass: 0.5 },
    enableTilt: !reduceMotion
  };
};

/**
 * Validate card data structure
 */
export const validateCardData = (cards: JobFlixCardData[]): boolean => {
  return cards.every(card => 
    card.id &&
    card.type &&
    card.title &&
    card.subtitle &&
    card.description &&
    card.iconName &&
    card.href
  );
};

/**
 * Filter cards by type
 */
export const filterCardsByType = (cards: JobFlixCardData[], type: CardType): JobFlixCardData[] => {
  return cards.filter(card => card.type === type);
};

/**
 * Sort cards by priority (assistant > job > news > project > idea)
 */
export const sortCardsByPriority = (cards: JobFlixCardData[]): JobFlixCardData[] => {
  const priority: Record<CardType, number> = {
    assistant: 1,
    job: 2,
    news: 3,
    project: 4,
    idea: 5
  };
  
  return [...cards].sort((a, b) => priority[a.type] - priority[b.type]);
};
