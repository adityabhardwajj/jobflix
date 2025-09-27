# JobFlix 3D Cards System

A dynamic, accessible, and performant 3D card grid component built with Next.js, TailwindCSS, and Framer Motion.

## ✨ Features

- **True 3D Effects**: Real depth using `transform-style: preserve-3d` with translateZ layers
- **Performance-First**: Optimized for 60fps with minimal repaints
- **Fully Accessible**: Keyboard navigation, ARIA labels, reduced motion support
- **Theme-Aware**: Seamless light/dark mode switching
- **Responsive**: 1 col mobile, 2 col tablet, 3 col desktop
- **Type-Safe**: Full TypeScript support with detailed interfaces

## 🚀 Quick Start

### Basic Usage

```tsx
import JobFlixCards from './components/JobFlixCards';
import { jobFlixCardsData } from './data/cards';

export default function HomePage() {
  return (
    <div>
      <JobFlixCards cards={jobFlixCardsData} />
    </div>
  );
}
```

### Creating Custom Cards

```tsx
import { createJobFlixCard } from './utils/cardHelpers';

const customCard = createJobFlixCard({
  id: 'custom-job',
  type: 'job',
  title: 'Senior Developer',
  subtitle: 'Remote Position',
  description: 'Join our team building the future of web development.',
  iconName: 'briefcase',
  href: '/jobs/senior-dev',
  badge: 'Featured',
  stats: {
    label: 'applicants',
    value: '150+'
  }
});
```

## 🎨 Theme System

### Color Tokens

The card system uses semantic color tokens that automatically adapt to light/dark themes:

```css
/* Dark Theme (Default) */
--bg: #121212          /* Global background */
--fg: #E5E7EB          /* Primary text */
--card: #1E1E1E        /* Card backgrounds */
--card-fg: #F3F4F6     /* Card text */
--muted: #374151       /* Muted backgrounds */
--muted-fg: #9CA3AF    /* Muted text */
--primary: #10B981     /* CTA green */
--accent: #2563EB      /* Muted blue */

/* Light Theme */
--bg: #F9FAFB          /* Global background */
--fg: #1A1A1A          /* Primary text */
--card: #FFFFFF        /* Card backgrounds */
--card-fg: #1F2937     /* Card text */
```

### Card Variants

**Primary Cards** (Jobs):
```tsx
// Soft dark background with subtle border
bg-card/95 dark:bg-card/90 border-border/50
```

**Glass Cards** (News, Projects):
```tsx
// Semi-transparent with backdrop blur
bg-card/90 dark:bg-white/[0.03] border-white/[0.08]
```

**Special Cards** (AI Assistant):
```tsx
// Gradient background with accent borders
bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20
```

## 🎭 3D Animation System

### Depth Layers

Each card element has a specific Z-depth for realistic layering:

- **Background**: `translateZ(-10px)` - Decorative elements
- **Card Base**: `translateZ(0px)` - Main card surface
- **Badge**: `translateZ(15px)` - Status indicators
- **Icon**: `translateZ(25px)` - Primary icons
- **Title**: `translateZ(30px)` - Main headings
- **CTA**: `translateZ(35px)` - Interactive elements

### Tilt Configuration

```tsx
// Responsive to user preferences
const tiltRange = shouldReduceMotion ? 3 : 10; // ±3° or ±10°
const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
```

### Performance Optimizations

- Hardware acceleration with `will-change: transform`
- Efficient spring animations with Framer Motion
- Reduced motion detection and graceful degradation
- Minimal DOM reflows with transform-only animations

## ♿ Accessibility Features

### Keyboard Navigation

- **Tab**: Navigate between cards
- **Enter/Space**: Activate card links
- **Focus indicators**: Visible ring with proper contrast

### Screen Readers

```tsx
<section aria-label="JobFlix Services">
  <div role="grid" aria-label="Service cards">
    <div role="gridcell">
      <Link aria-label="Find Your Dream Job - Curated Opportunities">
        ...
      </Link>
    </div>
  </div>
</section>
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .card-3d {
    transform: none !important;
  }
  
  .card-3d * {
    transform: none !important;
  }
}
```

## 📱 Responsive Behavior

### Grid Breakpoints

```tsx
// Tailwind responsive classes
grid-cols-1      // Mobile: 1 column
sm:grid-cols-2   // Tablet: 2 columns  
lg:grid-cols-3   // Desktop: 3 columns
```

### Content Clamping

```css
.line-clamp-1 { -webkit-line-clamp: 1; } /* Titles */
.line-clamp-3 { -webkit-line-clamp: 3; } /* Descriptions */
```

## 🔧 API Reference

### JobFlixCardData Interface

```tsx
interface JobFlixCardData {
  id: string;                    // Unique identifier
  type: CardType;               // 'job' | 'news' | 'project' | 'idea' | 'assistant'
  title: string;                // Main heading
  subtitle: string;             // Secondary heading
  description: string;          // Body text (clamped to 3 lines)
  iconName: IconName;          // Icon identifier ('briefcase' | 'users' | 'newspaper' | 'lightbulb' | 'bot')
  href: string;                // Navigation URL
  badge?: string;              // Optional status badge
  stats?: {                    // Optional statistics
    label: string;
    value: string | number;
  };
  gradient?: string;           // Optional gradient class
}
```

### Card Grid Props

```tsx
interface CardGridProps {
  cards: JobFlixCardData[];    // Array of card data
  className?: string;          // Additional CSS classes
}
```

### Utility Functions

```tsx
// Create cards with validation
createJobFlixCard(params): JobFlixCardData

// Style helpers
getCardTypeStyles(type): StyleConfig
getGridClasses(variant): string

// Performance & accessibility
shouldReduceMotion(): boolean
validateCardData(cards): boolean
filterCardsByType(cards, type): JobFlixCardData[]
sortCardsByPriority(cards): JobFlixCardData[]
```

## 🎯 Example Implementations

### Homepage Integration

```tsx
// src/app/page.tsx
import JobFlixCards from './components/JobFlixCards';
import { jobFlixCardsData } from './data/cards';

export default function HomePage() {
  return (
    <>
      <Hero />
      <JobFlixCards cards={jobFlixCardsData} />
      <FeatureSections />
    </>
  );
}
```

### Filtered Grid

```tsx
// Show only job-related cards
import { filterCardsByType } from './utils/cardHelpers';

const jobCards = filterCardsByType(jobFlixCardsData, 'job');

<JobFlixCards cards={jobCards} className="py-8" />
```

### Custom Grid Layout

```tsx
// Wide layout for featured content
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
  {featuredCards.map(card => (
    <Card3D key={card.id} card={card} />
  ))}
</div>
```

## 🎨 Customization

### Adding New Card Types

1. Update the `CardType` union:
```tsx
export type CardType = 'job' | 'news' | 'project' | 'idea' | 'assistant' | 'event';
```

2. Add styles in `cardHelpers.ts`:
```tsx
export const getCardTypeStyles = (type: CardType) => {
  const styles = {
    // ... existing styles
    event: {
      primary: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
      accent: 'bg-purple-500/10 text-purple-400',
      gradient: 'from-purple-500/5 to-pink-500/5'
    }
  };
  return styles[type];
};
```

### Custom Animations

```tsx
// Override spring configuration
const customSpringConfig = { 
  damping: 30, 
  stiffness: 400, 
  mass: 0.3 
};

// Custom tilt range
const customTiltRange = 15; // ±15° for more dramatic effect
```

## 🔍 Troubleshooting

### Performance Issues

1. **Reduce tilt range** for lower-end devices
2. **Enable hardware acceleration** in CSS
3. **Use transform-only animations** (no layout changes)

### Accessibility Concerns

1. **Test with screen readers** (NVDA, JAWS, VoiceOver)
2. **Verify keyboard navigation** works correctly
3. **Check color contrast ratios** meet WCAG AA standards

### Theme Integration

1. **Use semantic tokens** instead of hardcoded colors
2. **Test both light and dark themes** thoroughly
3. **Ensure proper contrast** in both modes

## 📈 Performance Metrics

- **First Contentful Paint**: No impact (SSR friendly)
- **Largest Contentful Paint**: Optimized with `will-change`
- **Cumulative Layout Shift**: Zero (transform-only animations)
- **Frame Rate**: Consistent 60fps on modern devices

## 🤝 Contributing

To extend the card system:

1. Follow the existing TypeScript interfaces
2. Maintain accessibility standards
3. Test across different devices and themes
4. Document any new features or breaking changes

---

Built with ❤️ for JobFlix - Making career discovery beautiful and accessible.
