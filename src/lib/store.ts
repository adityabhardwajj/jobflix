import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job, UserProfile, SwipeAction, SwipeDirection } from './schemas';
import { sampleJobs, sampleProfile, defaultProfile } from './sampleData';
import { calculateCompatibility } from './match';

interface SwipeDeckState {
  // Deck state
  cards: Job[];
  currentIndex: number;
  isAnimating: boolean;
  swipeHistory: SwipeAction[];
  
  // User state
  profile: UserProfile | null;
  
  // Actions
  actions: {
    onSwipeRight: (job: Job) => void;
    onSwipeLeft: (job: Job) => void;
    onSwipeUp: (job: Job) => void;
    onSwipeDown: (job: Job) => void;
  };
  
  // Methods
  initializeDeck: (jobs: Job[], profile: UserProfile) => void;
  swipeCard: (direction: SwipeDirection) => void;
  nextCard: () => void;
  resetDeck: () => void;
  updateProfile: (profile: UserProfile) => void;
  hydrate: () => void;
  getCurrentCard: () => Job | null;
  getRemainingCards: () => number;
  isDeckEmpty: () => boolean;
}

export const useSwipeStore = create<SwipeDeckState>()(
  persist(
    (set, get) => ({
      // Initial state
      cards: [],
      currentIndex: 0,
      isAnimating: false,
      swipeHistory: [],
      profile: null,
      
      actions: {
        onSwipeRight: (job: Job) => {
          console.log('Applied to:', job.title);
          // In a real app, this would trigger an API call
        },
        onSwipeLeft: (job: Job) => {
          console.log('Skipped:', job.title);
        },
        onSwipeUp: (job: Job) => {
          console.log('Saved:', job.title);
          // In a real app, this would save to saved jobs
        },
        onSwipeDown: (job: Job) => {
          console.log('View details:', job.title);
          // In a real app, this would navigate to job details
        }
      },
      
      initializeDeck: (jobs: Job[], profile: UserProfile) => {
        // Calculate compatibility for all jobs
        const jobsWithCompatibility = jobs.map(job => ({
          ...job,
          compatibility: calculateCompatibility(profile, job)
        }));
        
        set({
          cards: jobsWithCompatibility,
          currentIndex: 0,
          isAnimating: false,
          profile
        });
      },
      
      swipeCard: (direction: SwipeDirection) => {
        const { cards, currentIndex, actions, profile } = get();
        
        if (cards.length === 0 || currentIndex >= cards.length) return;
        
        const currentCard = cards[currentIndex];
        if (!currentCard) return;
        
        // Record the swipe action
        const swipeAction: SwipeAction = {
          jobId: currentCard.id,
          action: direction === 'right' ? 'apply' : 
                  direction === 'left' ? 'skip' :
                  direction === 'up' ? 'save' : 'details',
          timestamp: new Date().toISOString()
        };
        
        set(state => ({
          swipeHistory: [...state.swipeHistory, swipeAction],
          isAnimating: true
        }));
        
        // Execute the appropriate action
        switch (direction) {
          case 'right':
            actions.onSwipeRight(currentCard);
            break;
          case 'left':
            actions.onSwipeLeft(currentCard);
            break;
          case 'up':
            actions.onSwipeUp(currentCard);
            break;
          case 'down':
            actions.onSwipeDown(currentCard);
            break;
        }
        
        // Move to next card after animation
        setTimeout(() => {
          get().nextCard();
        }, 300);
      },
      
      nextCard: () => {
        set(state => ({
          currentIndex: state.currentIndex + 1,
          isAnimating: false
        }));
      },
      
      resetDeck: () => {
        set({
          cards: [],
          currentIndex: 0,
          isAnimating: false,
          swipeHistory: []
        });
      },
      
      updateProfile: (profile: UserProfile) => {
        set({ profile });
        
        // Recalculate compatibility for existing cards
        const { cards } = get();
        if (cards.length > 0) {
          const updatedCards = cards.map(job => ({
            ...job,
            compatibility: calculateCompatibility(profile, job)
          }));
          set({ cards: updatedCards });
        }
      },
      
      hydrate: () => {
        const { profile } = get();
        
        if (!profile || profile.completion < 50) {
          // Use default profile if no profile or incomplete
          set({ profile: defaultProfile });
          return;
        }
        
        // Initialize with sample data
        get().initializeDeck(sampleJobs, profile);
      },
      
      getCurrentCard: () => {
        const { cards, currentIndex } = get();
        return cards[currentIndex] || null;
      },
      
      getRemainingCards: () => {
        const { cards, currentIndex } = get();
        return Math.max(0, cards.length - currentIndex);
      },
      
      isDeckEmpty: () => {
        const { cards, currentIndex } = get();
        return currentIndex >= cards.length;
      }
    }),
    {
      name: 'swipe-deck-storage',
      partialize: (state) => ({
        profile: state.profile,
        swipeHistory: state.swipeHistory
      })
    }
  )
);

// Selectors for common use cases
export const useCurrentCard = () => useSwipeStore(state => state.getCurrentCard());
export const useRemainingCards = () => useSwipeStore(state => state.getRemainingCards());
export const useIsDeckEmpty = () => useSwipeStore(state => state.isDeckEmpty());
export const useProfile = () => useSwipeStore(state => state.profile);
export const useSwipeActions = () => useSwipeStore(state => state.actions);

// Action creators
export const swipeActions = {
  apply: () => useSwipeStore.getState().swipeCard('right'),
  skip: () => useSwipeStore.getState().swipeCard('left'),
  save: () => useSwipeStore.getState().swipeCard('up'),
  details: () => useSwipeStore.getState().swipeCard('down')
};
