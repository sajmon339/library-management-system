import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Try to get the theme from localStorage or use 'light' as the default
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    // Also check system preference if no saved theme
    if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return (savedTheme as Theme) || 'light';
  });

  // Apply the theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the previous theme class
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Apply dark class to certain elements that might not inherit properly
    const elementsToForceTheme = document.querySelectorAll('.page-container, .container, .content-wrapper, main, section');
    elementsToForceTheme.forEach(el => {
      if (theme === 'dark') {
        el.classList.add('dark-forced');
      } else {
        el.classList.remove('dark-forced');
      }
    });
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Get theme values from tailwind config
    const themeColors = {
      dark: {
        bg: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim(),
        themeColor: '#242424' // Fallback if CSS var not available
      },
      light: {
        bg: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim(),
        themeColor: '#FFE4B2' // Fallback if CSS var not available
      }
    };
    
    // Update meta theme-color for mobile browsers
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', 
      theme === 'dark' ? themeColors.dark.themeColor : themeColors.light.themeColor
    );
  }, [theme]);

  // Listen for changes in system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === null) {
        // Only auto-switch if the user hasn't explicitly chosen a theme
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Function to toggle between themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
