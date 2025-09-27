import { SwipeDirection, GestureState } from './schemas';

export interface GestureConfig {
  velocityThreshold: number;
  distanceThreshold: number;
  maxSwipeTime: number;
}

export const defaultGestureConfig: GestureConfig = {
  velocityThreshold: 0.6,
  distanceThreshold: 120,
  maxSwipeTime: 300
};

export class GestureHandler {
  private config: GestureConfig;
  private startTime: number = 0;
  private startX: number = 0;
  private startY: number = 0;
  private lastX: number = 0;
  private lastY: number = 0;
  private lastTime: number = 0;

  constructor(config: GestureConfig = defaultGestureConfig) {
    this.config = config;
  }

  start(x: number, y: number): void {
    this.startTime = Date.now();
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;
    this.lastTime = this.startTime;
  }

  update(x: number, y: number): GestureState {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime > 0) {
      const velocityX = (x - this.lastX) / deltaTime;
      const velocityY = (y - this.lastY) / deltaTime;
      
      this.lastX = x;
      this.lastY = y;
      this.lastTime = currentTime;

      return {
        isDragging: true,
        startX: this.startX,
        startY: this.startY,
        currentX: x,
        currentY: y,
        velocityX,
        velocityY,
        direction: this.getDirection(x, y, velocityX, velocityY) || undefined
      };
    }

    return {
      isDragging: true,
      startX: this.startX,
      startY: this.startY,
      currentX: x,
      currentY: y,
      velocityX: 0,
      velocityY: 0
    };
  }

  end(x: number, y: number): SwipeDirection | null {
    const deltaX = x - this.startX;
    const deltaY = y - this.startY;
    const deltaTime = Date.now() - this.startTime;
    
    // Calculate final velocity
    const velocityX = deltaX / deltaTime;
    const velocityY = deltaY / deltaTime;
    
    // Check if swipe was fast enough or far enough
    const isFastSwipe = Math.abs(velocityX) > this.config.velocityThreshold || 
                       Math.abs(velocityY) > this.config.velocityThreshold;
    const isLongSwipe = Math.abs(deltaX) > this.config.distanceThreshold || 
                       Math.abs(deltaY) > this.config.distanceThreshold;
    
    if (isFastSwipe || isLongSwipe) {
      return this.getDirection(x, y, velocityX, velocityY);
    }
    
    return null;
  }

  private getDirection(x: number, y: number, velocityX: number, velocityY: number): SwipeDirection | null {
    const deltaX = x - this.startX;
    const deltaY = y - this.startY;
    
    // Check velocity first (more responsive)
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      if (velocityX > this.config.velocityThreshold || deltaX > this.config.distanceThreshold) {
        return 'right';
      }
      if (velocityX < -this.config.velocityThreshold || deltaX < -this.config.distanceThreshold) {
        return 'left';
      }
    } else {
      if (velocityY > this.config.velocityThreshold || deltaY > this.config.distanceThreshold) {
        return 'down';
      }
      if (velocityY < -this.config.velocityThreshold || deltaY < -this.config.distanceThreshold) {
        return 'up';
      }
    }
    
    return null;
  }

  reset(): void {
    this.startTime = 0;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastTime = 0;
  }
}

export const gestureHandler = new GestureHandler();

// Keyboard gesture mapping
export const keyboardGestures = {
  ArrowRight: 'right' as SwipeDirection,
  ArrowLeft: 'left' as SwipeDirection,
  ArrowUp: 'up' as SwipeDirection,
  ArrowDown: 'down' as SwipeDirection,
  ' ': 'right' as SwipeDirection, // Space for apply
  Escape: 'left' as SwipeDirection, // Escape for skip
  Enter: 'right' as SwipeDirection, // Enter for apply
  '?': 'down' as SwipeDirection // ? for details
};

// Touch/pointer event handlers
export const createPointerHandlers = (
  onSwipe: (direction: SwipeDirection) => void,
  onDrag: (state: GestureState) => void
) => {
  const handler = new GestureHandler();
  
  return {
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      handler.start(e.clientX, e.clientY);
    },
    
    onPointerMove: (e: React.PointerEvent) => {
      if (handler) {
        const state = handler.update(e.clientX, e.clientY);
        onDrag(state);
      }
    },
    
    onPointerUp: (e: React.PointerEvent) => {
      const direction = handler.end(e.clientX, e.clientY);
      if (direction) {
        onSwipe(direction);
      }
      handler.reset();
    },
    
    onPointerCancel: () => {
      handler.reset();
    }
  };
};

// Touch event handlers for mobile
export const createTouchHandlers = (
  onSwipe: (direction: SwipeDirection) => void,
  onDrag: (state: GestureState) => void
) => {
  const handler = new GestureHandler();
  
  return {
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handler.start(touch.clientX, touch.clientY);
    },
    
    onTouchMove: (e: React.TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const state = handler.update(touch.clientX, touch.clientY);
      onDrag(state);
    },
    
    onTouchEnd: (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      const direction = handler.end(touch.clientX, touch.clientY);
      if (direction) {
        onSwipe(direction);
      }
      handler.reset();
    }
  };
};

// Keyboard event handler
export const createKeyboardHandler = (
  onSwipe: (direction: SwipeDirection) => void
) => {
  return (e: React.KeyboardEvent) => {
    const direction = keyboardGestures[e.key as keyof typeof keyboardGestures];
    if (direction) {
      e.preventDefault();
      onSwipe(direction);
    }
  };
};
