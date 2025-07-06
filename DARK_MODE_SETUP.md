# Dark Mode Setup Guide

This guide explains the dark mode implementation in the realestateapp project.

## 🎨 Features

- **Automatic Theme Detection**: Detects user's system preference
- **Persistent Storage**: Remembers user's theme choice in localStorage
- **Smooth Transitions**: Beautiful animations when switching themes
- **Comprehensive Coverage**: All components support dark mode
- **Accessibility**: Proper contrast ratios and focus states

## 🏗️ Architecture

### 1. Theme Context (`src/app/contexts/ThemeContext.tsx`)
- Manages theme state across the entire application
- Handles localStorage persistence
- Provides theme toggle functionality
- Prevents hydration mismatches

### 2. Theme Toggle Component (`src/app/components/ThemeToggle.tsx`)
- Beautiful animated toggle button
- Uses Framer Motion for smooth animations
- Shows sun/moon icons based on current theme
- Includes ripple effect on click

### 3. Layout Integration (`src/app/components/Layout.tsx`)
- Theme toggle positioned in header
- Dark mode classes applied to all navigation elements
- Responsive design for mobile and desktop
- Smooth backdrop blur effects

## 🎯 Implementation Details

### Theme Provider Setup
```tsx
// In layout.tsx
<ThemeProvider>
  <div className="min-h-full">
    <main>{children}</main>
  </div>
</ThemeProvider>
```

### Using the Theme Hook
```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### CSS Classes Pattern
```css
/* Light mode (default) */
.class-name {
  @apply bg-white text-gray-900;
}

/* Dark mode */
.dark .class-name {
  @apply bg-gray-800 text-white;
}
```

## 🎨 Color Palette

### Light Mode
- Background: `#FFFFFF`
- Surface: `#F3F4F6`
- Text Primary: `#1F2937`
- Text Secondary: `#6B7280`
- Border: `#E5E7EB`

### Dark Mode
- Background: `#111827`
- Surface: `#1F2937`
- Text Primary: `#F9FAFB`
- Text Secondary: `#9CA3AF`
- Border: `#374151`

## 🔧 Configuration

### Tailwind Config
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
}
```

### CSS Variables
```css
/* globals.css */
:root {
  --background: #FFFFFF;
  --foreground: #1F2937;
  /* ... other light mode variables */
}

.dark {
  --background: #111827;
  --foreground: #F9FAFB;
  /* ... other dark mode variables */
}
```

## 📱 Responsive Design

### Desktop
- Theme toggle in header next to login button
- Smooth dropdown animations
- Hover effects with proper contrast

### Mobile
- Theme toggle in mobile menu
- Touch-friendly button sizes
- Proper spacing and accessibility

## ♿ Accessibility Features

- **High Contrast**: All colors meet WCAG AA standards
- **Focus States**: Visible focus indicators in both themes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and descriptions
- **Reduced Motion**: Respects user's motion preferences

## 🎭 Animation Details

### Theme Toggle
- **Rotation**: Icon rotates 180° when switching
- **Scale**: Button scales on hover and click
- **Ripple**: Click effect with opacity animation
- **Duration**: 300ms for smooth transitions

### Page Transitions
- **Background**: Smooth color transitions
- **Text**: Instant color changes for readability
- **Borders**: Gradual border color changes
- **Shadows**: Dynamic shadow adjustments

## 🧪 Testing

### Manual Testing Checklist
- [ ] Theme toggle works on desktop
- [ ] Theme toggle works on mobile
- [ ] Theme persists after page refresh
- [ ] System preference is detected correctly
- [ ] All components render properly in both themes
- [ ] Animations are smooth and performant
- [ ] No layout shifts during theme switching

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## 🚀 Performance Optimizations

### CSS Transitions
```css
/* Optimized transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

### Hydration Prevention
```tsx
// Prevents flash of wrong theme
if (!mounted) {
  return <div style={{ visibility: 'hidden' }}>{children}</div>;
}
```

## 🔄 Future Enhancements

### Planned Features
- **Theme Presets**: Multiple color schemes
- **Custom Themes**: User-defined color palettes
- **Auto-switch**: Time-based theme switching
- **Reduced Motion**: Respect user preferences
- **High Contrast**: Enhanced accessibility mode

### Integration Ideas
- **Analytics**: Track theme usage
- **A/B Testing**: Theme preference testing
- **User Profiles**: Save theme preferences
- **API Integration**: Sync theme across devices

## 🐛 Troubleshooting

### Common Issues

1. **Flash of Wrong Theme**
   - Ensure ThemeProvider wraps the app
   - Check hydration prevention logic
   - Verify localStorage access

2. **Inconsistent Styling**
   - Check Tailwind dark mode classes
   - Verify CSS variable definitions
   - Ensure proper class specificity

3. **Performance Issues**
   - Limit transition properties
   - Use transform instead of layout properties
   - Optimize animation durations

### Debug Commands
```bash
# Check if dark mode is enabled
document.documentElement.classList.contains('dark')

# Check localStorage
localStorage.getItem('theme')

# Force theme
document.documentElement.classList.add('dark')
```

## 📚 Resources

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Note**: This implementation provides a solid foundation for dark mode support. The theme system is extensible and can be easily customized for specific design requirements. 