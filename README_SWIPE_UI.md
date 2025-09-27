# 🎬 JobFlix - Immersive Swipe UI

A production-ready Next.js application with Tinder-style job swiping, 3D interactive cards, and recruiter video previews.

## ✨ Features

### 🎯 **Core Swipe Functionality**
- **Swipe Right** → Apply to job instantly
- **Swipe Left** → Skip job
- **Swipe Up** → Save job for later
- **Swipe Down** → View job details
- **Keyboard Support** → Arrow keys for navigation
- **Touch Gestures** → Mobile-optimized swipe detection

### 🎨 **3D Interactive Cards**
- **Three.js Integration** → Real 3D tilt effects on hover/drag
- **Smooth Animations** → Framer Motion powered transitions
- **Stacked Layout** → Multiple cards with depth perception
- **Compatibility Scoring** → AI-powered job matching
- **Video Previews** → Recruiter 30-second video previews

### 🚀 **Technical Features**
- **Next.js 14** → App Router with Server Components
- **TypeScript** → Full type safety
- **Zustand** → Client state management
- **React Three Fiber** → 3D graphics
- **Framer Motion** → Smooth animations
- **Tailwind CSS** → Responsive design
- **Zod** → Schema validation

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

## 🎮 Usage

### **Swipe Gestures**
- **Desktop**: Click and drag cards or use arrow keys
- **Mobile**: Touch and swipe gestures
- **Keyboard**: Arrow keys (← Skip, ↑ Save, → Apply, ↓ Details)

### **Navigation**
- **Home** (`/`) → Main swipe deck
- **Profile** (`/profile`) → Complete your profile
- **Saved** (`/saved`) → View saved jobs
- **Details** (`/details/[jobId]`) → Job details with video

### **Profile Completion**
1. Fill out your profile with skills, experience, and preferences
2. Higher completion = better job matches
3. AI calculates compatibility scores (0-100%)

## 🏗️ Architecture

### **State Management**
```typescript
// Zustand store for swipe deck state
const useSwipeStore = create<SwipeDeckState>()(
  persist(/* ... */)
);
```

### **Gesture System**
```typescript
// Velocity-based swipe detection
const gestureHandler = new GestureHandler({
  velocityThreshold: 0.6,
  distanceThreshold: 120
});
```

### **3D Cards**
```typescript
// Three.js integration with React
<Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
  <Card3D job={job} isActive={isActive} />
</Canvas>
```

## 📊 **Data Models**

### **User Profile**
```typescript
interface UserProfile {
  id: string;
  name: string;
  title: string;
  skills: string[];
  years: number;
  location: string;
  desiredSalary: number;
  availability: 'immediate' | '30d' | '60d';
  completion: number;
}
```

### **Job**
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  company: string;
  salaryRange: { min: number; max: number; currency: string };
  location: string;
  tags: string[];
  description: string;
  videoUrl?: string;
  compatibility: number;
}
```

## 🎯 **Matching Algorithm**

The compatibility score is calculated using weighted factors:

- **Skills Overlap** (60%) → Matching technical skills
- **Location Fit** (20%) → Geographic compatibility
- **Seniority Match** (10%) → Experience level alignment
- **Recency Bonus** (10%) → How recently the job was posted

## 🧪 **Testing**

### **Unit Tests** (Vitest)
```bash
npm run test
```

### **E2E Tests** (Playwright)
```bash
npm run test:e2e
```

### **Test Coverage**
- Compatibility calculation
- Swipe gesture detection
- Component rendering
- API route functionality

## 🚀 **Performance**

### **Optimizations**
- **Lazy Loading** → Cards load as needed
- **Preloading** → Next batch loads when < 3 cards remain
- **60 FPS Animations** → Smooth 3D interactions
- **LCP < 2.5s** → Fast initial load

### **Accessibility**
- **Keyboard Navigation** → Full keyboard support
- **Screen Reader** → ARIA labels and roles
- **Reduced Motion** → Respects user preferences
- **Focus Management** → Clear focus indicators

## 📱 **Responsive Design**

- **Desktop** → Full 3D experience with hover effects
- **Tablet** → Touch-optimized with gesture support
- **Mobile** → Compact layout with swipe gestures

## 🔧 **API Routes**

### **Jobs**
- `GET /api/jobs` → Fetch job listings
- `POST /api/jobs` → Create new job

### **Applications**
- `POST /api/apply` → Apply to job
- `POST /api/save` → Save job

### **Profile**
- `GET /api/profile` → Get user profile
- `PUT /api/profile` → Update profile

## 🎨 **Customization**

### **Themes**
- Light/Dark mode support
- Custom color schemes
- Reduced motion preferences

### **Gestures**
- Configurable velocity thresholds
- Custom swipe distances
- Keyboard shortcuts

## 🚀 **Deployment**

1. **Install dependencies**: `npm install`
2. **Start development**: `npm run dev`
3. **Build for production**: `npm run build`
4. **Deploy**: Push to Vercel/Netlify

## 📈 **Analytics**

Track user interactions:
- Swipe patterns
- Application rates
- Profile completion
- Job preferences

## 🔒 **Security**

- **Input Validation** → Zod schema validation
- **Rate Limiting** → API protection
- **CSRF Protection** → Built-in Next.js security
- **XSS Prevention** → Sanitized inputs

## 🎯 **Future Enhancements**

- **Real-time Notifications** → WebSocket integration
- **Advanced Matching** → Machine learning algorithms
- **Video Interviews** → Integrated video calling
- **Social Features** → User networking
- **Analytics Dashboard** → Job market insights

---

**Built with ❤️ using Next.js, Three.js, and Framer Motion**

[🌐 Live Demo](https://jobflix.vercel.app) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/yourusername/jobflix/issues)
