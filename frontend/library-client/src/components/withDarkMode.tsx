import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.js';

/**
 * A higher-order component (HOC) that adds dark mode styling 
 * to the wrapped component and its children.
 * 
 * @param WrappedComponent The component to wrap with dark mode support
 * @returns A new component with enhanced dark mode support
 */
const withDarkMode = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithDarkMode = (props: P) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    
    useEffect(() => {
      // Add or remove specific custom styling for difficult components
      const applyDarkModeToElements = () => {
        // Target common white background elements that might not properly inherit dark mode
        const backgroundElements = document.querySelectorAll('.bg-white, .bg-neutral-50, .bg-gray-50, .bg-gray-100, .card');
        
        backgroundElements.forEach(el => {
          if (isDarkMode) {
            (el as HTMLElement).classList.add('dark-forced-bg');
          } else {
            (el as HTMLElement).classList.remove('dark-forced-bg');
          }
        });
        
        // Target text elements that might need color changes
        const textElements = document.querySelectorAll('.text-neutral-800, .text-neutral-900, .text-gray-800, .text-gray-900');
        
        textElements.forEach(el => {
          if (isDarkMode) {
            (el as HTMLElement).classList.add('dark-forced-text');
          } else {
            (el as HTMLElement).classList.remove('dark-forced-text');
          }
        });
      };
      
      // Run on mount and theme change
      applyDarkModeToElements();
      
      // Add DOM mutation observer to handle dynamically added elements
      const observer = new MutationObserver(applyDarkModeToElements);
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => observer.disconnect();
    }, [isDarkMode]);
    
    // Pass through all props to the wrapped component
    return <WrappedComponent {...props} />;
  };
  
  // Set display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithDarkMode.displayName = `withDarkMode(${displayName})`;
  
  return WithDarkMode;
};

export default withDarkMode;
