import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext.js';

const ThemeToast = () => {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    // Show the toast when theme changes
    setShow(true);
    
    // Hide the toast after 3 seconds
    const timeoutId = setTimeout(() => {
      setShow(false);
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [theme]);

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform transition duration-300 ease-out"
      enterFrom="translate-y-2 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transform transition duration-200 ease-in"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-2 opacity-0"
    >
      <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 ${
        isDark 
          ? 'bg-burrito-dark-border text-burrito-dark-text' 
          : 'bg-burrito-light-bg text-burrito-light-text'
      }`}>
        {isDark ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
        <p className="font-medium">
          {isDark ? 'Dark mode enabled' : 'Light mode enabled'}
        </p>
      </div>
    </Transition>
  );
};

export default ThemeToast;
