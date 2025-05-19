# Theming System Documentation

This document explains the theming system used in the Library Management System application.

## Overview

The Library Management System uses a centralized theming approach that leverages both:
1. CSS variables for runtime flexibility 
2. Tailwind CSS utility classes for component styling

This provides a maintainable solution where theme colors are defined in a single place and applied consistently throughout the application.

## Theme Configuration

### 1. Configuration in `tailwind.config.js`

Colors are defined in the Tailwind configuration with semantic naming:

```javascript
colors: {
  burrito: {
    // Brand colors
    brown: "#703512",
    beige: "#FFE4B2",
    tomato: "#EF4444",
    // ... other brand colors

    // Theme colors - semantic naming for better maintainability
    'dark-bg': "#242424",      // Primary dark mode background
    'dark-surface': "#2C2C2C", // Dark mode surface/card background
    'dark-border': "#802418",  // Dark mode borders
    'dark-text': "#E5DED6",    // Dark mode text
    'light-bg': "#FFE4B2",     // Light mode background
    'light-surface': "#FFFFFF", // Light mode surface/card background
    'light-border': "#E5DED6", // Light mode borders
    'light-text': "#50443A",   // Light mode text
  },
}
```

### 2. CSS Variables in `index.css`

CSS variables are defined in the `:root` element and overridden in the `.dark` class:

```css
:root {
  /* Light theme variables */
  --color-bg: theme('colors.burrito.light-bg');
  --color-surface: theme('colors.burrito.light-surface');
  --color-border: theme('colors.burrito.light-border');
  --color-text: theme('colors.burrito.light-text');
  --color-text-heading: theme('colors.neutral.900');
  --color-accent: theme('colors.burrito.brown');
}

.dark {
  /* Dark theme variables */
  --color-bg: theme('colors.burrito.dark-bg');
  --color-surface: theme('colors.burrito.dark-surface');
  --color-border: theme('colors.burrito.dark-border');
  --color-text: theme('colors.burrito.dark-text');
  --color-text-heading: theme('colors.burrito.beige');
  --color-accent: theme('colors.burrito.burgundy');
  color-scheme: dark;
}
```

## Using the Theme in Components

### 1. Direct Tailwind Classes

Components can use Tailwind classes that reference the theme colors:

```jsx
<button className="bg-burrito-light-bg dark:bg-burrito-dark-bg">Theme Button</button>
```

### 2. Utility Classes

For common patterns, utility classes are defined in `index.css`:

```css
/* Auto theme utility classes */
.auto-theme-bg {
  @apply bg-burrito-light-bg dark:bg-burrito-dark-bg;
}

.auto-theme-text {
  @apply text-burrito-light-text dark:text-burrito-dark-text;
}

.auto-theme-card {
  @apply bg-burrito-light-surface border-burrito-light-border 
         dark:bg-burrito-dark-surface dark:border-burrito-dark-border rounded-lg;
}

.auto-theme-section {
  @apply bg-burrito-light-bg dark:bg-burrito-dark-bg;
}
```

Usage example:
```jsx
<div className="auto-theme-card p-4">
  <h2 className="auto-theme-text">Card Title</h2>
</div>
```

### 3. CSS Variable Usage

For components that need dynamic styling, CSS variables can be used:

```jsx
<div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
  Dynamic Content
</div>
```

## Theme Switching Logic

Theme switching is handled by the `ThemeContext` which:
1. Sets `.dark` class on the root element
2. Updates CSS variables
3. Persists the theme choice in localStorage
4. Matches system preferences when appropriate

## Enforcing Dark Mode

For components that don't properly inherit dark mode styling, the `DarkModeEnforcer` component applies appropriate CSS classes.

## Guidelines for Developers

When creating new components:

1. **Use semantic color names**:
   - ✅ Good: `bg-burrito-dark-bg`, `text-burrito-light-text`
   - ❌ Bad: `bg-[#242424]`, `text-neutral-900`

2. **Use utility classes** for common patterns:
   - ✅ Good: `auto-theme-card`, `auto-theme-text`
   - ❌ Bad: `bg-white dark:bg-burrito-charcoal text-neutral-800 dark:text-burrito-gray`

3. **Avoid hardcoded colors**:
   - ✅ Good: Use Tailwind classes or CSS variables
   - ❌ Bad: Inline styles with hex values

4. **Test in both themes** before committing changes
