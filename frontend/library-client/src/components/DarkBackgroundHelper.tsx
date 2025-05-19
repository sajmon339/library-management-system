// DarkBackgroundHelper.tsx
import { useEffect } from 'react';

// This is a utility component that adds a marker class to help the navbar
// detect when the page has a dark background and should use light text.
// Add this component to any page with a dark header/hero section
const DarkBackgroundHelper = () => {
  useEffect(() => {
    // Add marker div to help navbar detection
    const marker = document.createElement('div');
    marker.className = 'dark-background-marker hero-section';
    marker.style.position = 'absolute';
    marker.style.top = '0';
    marker.style.left = '0';
    marker.style.width = '1px';
    marker.style.height = '1px';
    marker.style.opacity = '0';
    marker.style.pointerEvents = 'none';
    document.body.appendChild(marker);
    
    return () => {
      document.body.removeChild(marker);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default DarkBackgroundHelper;
