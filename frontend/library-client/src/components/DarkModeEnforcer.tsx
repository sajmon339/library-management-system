import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.js';

/**
 * A utility component that forces dark mode styles on its parent container
 * Useful for pages or sections that don't inherit dark mode properly
 */
const DarkModeEnforcer = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Get the parent element of where this component is mounted
    const parentElement = document.getElementById('dark-mode-enforcer')?.parentElement;
    if (parentElement) {
      if (theme === 'dark') {
        parentElement.classList.add('dark-forced-bg');
        parentElement.classList.add('dark-forced-text');
      } else {
        parentElement.classList.remove('dark-forced-bg');
        parentElement.classList.remove('dark-forced-text');
      }
    }
    
    // Apply to all content wrappers and sections
    const contentElements = document.querySelectorAll('.content-wrapper, .section, .card, .page-container');
    contentElements.forEach(el => {
      if (theme === 'dark') {
        (el as HTMLElement).classList.add('dark-forced-bg');
        (el as HTMLElement).classList.add('dark-forced-text');
      } else {
        (el as HTMLElement).classList.remove('dark-forced-bg');
        (el as HTMLElement).classList.remove('dark-forced-text');
      }
    });
  }, [theme]);
  
  // This is an invisible component, just returns a div with an id for targeting
  return <div id="dark-mode-enforcer" style={{ display: 'none' }} />;
};

export default DarkModeEnforcer;
