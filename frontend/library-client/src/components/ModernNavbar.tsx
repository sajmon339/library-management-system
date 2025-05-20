import { Fragment, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, DisclosureButton, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ModernNavbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hasDarkBackground, setHasDarkBackground] = useState(false);
  
  const isDarkMode = theme === 'dark';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Generate dynamic styles based on theme and scroll state
  const styles = useMemo(() => {
    return {
      navbar: `fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? isDarkMode 
            ? 'bg-burrito-dark-surface text-burrito-dark-text shadow-md py-1' 
            : 'bg-burrito-light-surface shadow-md py-1'
          : hasDarkBackground 
            ? 'bg-transparent pt-2' 
            : isDarkMode 
              ? 'bg-burrito-dark-bg text-burrito-dark-text pt-2' 
              : 'bg-burrito-brown pt-2'
      }`,
      menuButton: `relative inline-flex items-center justify-center rounded-md p-2 ${
        scrolled 
          ? isDarkMode
            ? 'text-burrito-gray hover:bg-burrito-charcoal bg-burrito-dark-surface/70'
            : 'text-burrito-brown hover:bg-burrito-beige bg-white/70' 
          : 'text-white hover:bg-white/10 bg-burrito-burgundy/20'
      } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-burrito-brown`,
      logoText: `flex items-center font-heading font-bold ${
        scrolled 
          ? 'text-burrito-brown' 
          : 'text-white'
      }`,
      themeToggle: `flex items-center justify-center p-2 rounded-full transition-colors ${
        scrolled 
          ? isDarkMode
            ? 'text-burrito-cheese hover:bg-burrito-burgundy/20'
            : 'text-burrito-brown hover:bg-burrito-beige' 
          : 'text-white hover:bg-white/10'
      }`,
      languageSwitcherClass: `${
        scrolled 
          ? isDarkMode
            ? 'text-burrito-cheese hover:bg-burrito-burgundy/20'
            : 'text-burrito-brown hover:bg-burrito-beige' 
          : 'text-white hover:bg-white/10'
      }`,
      loginLink: `text-sm font-medium ${
        scrolled 
          ? isDarkMode
            ? 'text-burrito-cheese hover:text-burrito-beige'
            : 'text-burrito-brown hover:text-burrito-burgundy' 
          : 'text-white hover:text-white/80'
      }`,
      mobileMenu: `sm:hidden ${isDarkMode ? 'bg-burrito-charcoal shadow-lg' : 'bg-white shadow-lg'} max-h-[85vh] overflow-y-auto z-50`,
      mobileThemeToggle: `flex items-center justify-center py-2 px-3 rounded-md ${
        isDarkMode
          ? 'bg-burrito-burgundy/20 text-burrito-cheese'
          : 'bg-burrito-beige text-burrito-brown'
      }`,
      mobileLangSwitcher: `py-2 px-3 rounded-md ${
        isDarkMode
          ? 'bg-burrito-burgundy/20 text-burrito-cheese'
          : 'bg-burrito-beige text-burrito-brown'
      }`
    };
  }, [scrolled, isDarkMode, hasDarkBackground]);

  // Detect if the page has a dark background or hero image
  useEffect(() => {
    const checkBackgroundColor = () => {
      // Look for a hero element, dark-background-marker, or full-page image within the viewport
      const heroElements = document.querySelectorAll('.hero-section, .dark-background-marker, section[style*="background-image"]');
      
      if (heroElements.length > 0) {
        // Found elements that indicate a dark background
        setHasDarkBackground(true);
        return;
      }
      
      // If we reach here, no explicit markers were found
      // Check if we're on the home page (which we know has a dark hero)
      if (location.pathname === '/') {
        setHasDarkBackground(true);
        return;
      }
      
      // Default to using the brown navbar background for non-hero pages
      setHasDarkBackground(false);
    };

    // Check on page load and after a short delay to ensure DOM is fully loaded
    checkBackgroundColor();
    const timeoutId = setTimeout(checkBackgroundColor, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation links that are always visible
  const publicNavigation = [
    { name: t('nav.home'), href: '/', current: location.pathname === '/' },
    { name: t('nav.books'), href: '/books', current: location.pathname === '/books' },
  ];
  
  // Navigation links for logged in users
  const userNavigation = [
    { name: t('nav.myBooks'), href: '/my-books', current: location.pathname === '/my-books' },
  ];
  
  // Navigation links for admin users
  const adminNavigation = [
    { name: t('nav.adminDashboard'), href: '/admin', current: location.pathname === '/admin' },
    { name: t('nav.manageBooks'), href: '/admin/books', current: location.pathname === '/admin/books' },
    { name: t('nav.manageUsers'), href: '/admin/users', current: location.pathname === '/admin/users' },
    { name: t('nav.checkouts'), href: '/admin/checkouts', current: location.pathname === '/admin/checkouts' },
  ];

  // Get navigation based on user role
  const navigation = [
    ...publicNavigation,
    ...(isAuthenticated ? userNavigation : []),
    ...(isAdmin ? adminNavigation : []),
  ];

  // User menu items
  const userMenuItems = [
    { name: t('nav.profile'), href: '/profile', icon: <UserIcon className="h-5 w-5 mr-2" /> },
    { name: t('nav.changePassword'), href: '/change-password', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> },
  ];

  return (      <Disclosure as="nav" className={styles.navbar}>
      {({ open }) => (
        <>
          <div className="container-custom px-3 sm:px-4">
            <div className="relative flex items-center justify-between h-14 sm:h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className={styles.menuButton}>
                  <span className="sr-only">{t('common.toggleMenu')}</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              
              <div className="flex flex-1 items-center justify-between sm:justify-start">
                <div className="flex-shrink-0 pl-10 sm:pl-0">
                  <Link to="/" className={styles.logoText}>
                    <img 
                      src={isDarkMode ? "/themes/dark/burrito_full_dark.png" : "/burrito_icon_plain.png"} 
                      alt="WSBurrito Logo" 
                      className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover"
                    />
                  </Link>
                </div>
                
                <div className="hidden sm:flex sm:ml-6 lg:ml-8 sm:space-x-2 lg:space-x-4 items-center flex-grow justify-center">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current 
                          ? (scrolled 
                              ? isDarkMode
                                ? 'text-burrito-cheese border-b-2 border-burrito-cheese'
                                : 'text-burrito-brown border-b-2 border-burrito-brown' 
                              : 'text-white border-b-2 border-white')
                          : (scrolled 
                              ? isDarkMode
                                ? 'text-burrito-gray hover:text-burrito-cheese'
                                : 'text-neutral-600 hover:text-burrito-brown' 
                              : 'text-white/80 hover:text-white'),
                        'px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <button 
                  className={`hidden sm:flex items-center justify-center p-2 rounded-full ${scrolled ? 'text-burrito-brown hover:bg-burrito-beige' : 'text-white hover:bg-white/10'}`}
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={toggleTheme} 
                  className={`hidden sm:flex ${styles.themeToggle}`}
                  aria-label={isDarkMode ? t('nav.switchToLightMode') : t('nav.switchToDarkMode')}
                >
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>
                
                <LanguageSwitcher 
                  className="hidden sm:block"
                  buttonClassName={styles.languageSwitcherClass}
                />
                
                {isAuthenticated ? (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className={`flex rounded-full focus:outline-none focus:ring-2 ${
                        isDarkMode 
                          ? 'focus:ring-burrito-cheese focus:ring-offset-2 focus:ring-offset-burrito-charcoal' 
                          : 'focus:ring-burrito-brown focus:ring-offset-2'
                      }`}>
                        <span className="sr-only">Open user menu</span>
                        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full ${
                          isDarkMode 
                            ? 'bg-burrito-burgundy' 
                            : 'bg-burrito-brown'
                        } flex items-center justify-center text-white font-medium text-sm shadow-sm`}>
                          {user?.userName.charAt(0).toUpperCase()}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl ${
                        isDarkMode 
                          ? 'bg-burrito-charcoal py-1 shadow-lg ring-1 ring-burrito-burgundy ring-opacity-30 focus:outline-none' 
                          : 'bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                      }`}>
                        <div className={`px-4 py-3 ${isDarkMode ? 'border-b border-burrito-burgundy' : 'border-b border-neutral-100'}`}>
                          <p className={`text-sm ${isDarkMode ? 'text-burrito-gray' : 'text-neutral-500'}`}>{t('nav.signedInAs')}</p>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-burrito-beige' : 'text-neutral-900'} truncate`}>{user?.userName}</p>
                        </div>
                        
                        {userMenuItems.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={classNames(
                                  active 
                                    ? isDarkMode 
                                      ? 'bg-burrito-burgundy/20' 
                                      : 'bg-neutral-50' 
                                    : '',
                                  'flex items-center px-4 py-2 text-sm',
                                  isDarkMode ? 'text-burrito-gray' : 'text-neutral-700'
                                )}
                              >
                                {item.icon}
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active 
                                  ? isDarkMode 
                                    ? 'bg-burrito-burgundy/20' 
                                    : 'bg-neutral-50' 
                                  : '',
                                'flex items-center w-full text-left px-4 py-2 text-sm',
                                isDarkMode ? 'text-burrito-gray' : 'text-neutral-700'
                              )}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                              </svg>
                              {t('nav.logout')}
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="hidden sm:flex items-center gap-3">
                    <Link
                      to="/login"
                      className={styles.loginLink}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary py-2 px-4 text-sm"
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className={styles.mobileMenu}>
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Search bar in mobile view */}
              <div className="mb-3 px-2">
                <div className={`flex items-center rounded-md ${isDarkMode ? 'bg-burrito-charcoal/50' : 'bg-gray-100'} p-2`}>
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <input
                    type="search"
                    placeholder={t('nav.search')}
                    className={`w-full bg-transparent border-none focus:ring-0 text-sm ${
                      isDarkMode ? 'text-burrito-beige placeholder:text-gray-500' : 'text-gray-700 placeholder:text-gray-500'
                    }`}
                  />
                </div>
              </div>
              
              {/* Navigation links in mobile view */}
              <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? isDarkMode
                          ? 'bg-burrito-burgundy text-burrito-beige'
                          : 'bg-burrito-beige text-burrito-brown'
                        : isDarkMode
                          ? 'text-burrito-gray hover:bg-burrito-burgundy hover:text-burrito-beige'
                          : 'text-neutral-600 hover:bg-burrito-beige hover:text-burrito-brown',
                      'block rounded-md px-3 py-3 text-base font-medium w-full text-left mb-1'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
              
              {/* Theme and language controls */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  onClick={toggleTheme} 
                  className={styles.mobileThemeToggle + " flex items-center justify-center w-full"}
                >
                  {isDarkMode ? <SunIcon className="h-5 w-5 mr-2" /> : <MoonIcon className="h-5 w-5 mr-2" />}
                  {isDarkMode ? t('nav.lightMode') : t('nav.darkMode')}
                </button>
                
                <LanguageSwitcher 
                  className="w-full"
                  buttonClassName={styles.mobileLangSwitcher + " justify-center w-full"}
                  dropdownClassName="w-full" 
                />
              </div>
              
              {/* User authentication options */}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <DisclosureButton
                    as={Link}
                    to="/login"
                    className={`block text-center w-full py-2 rounded-md ${
                      isDarkMode 
                        ? 'bg-burrito-burgundy/20 text-burrito-cheese' 
                        : 'bg-burrito-beige text-burrito-brown'
                    }`}
                  >
                    {t('nav.login')}
                  </DisclosureButton>
                  <DisclosureButton
                    as={Link}
                    to="/register"
                    className="btn btn-primary py-3 px-4 text-sm w-full text-center"
                  >
                    {t('nav.register')}
                  </DisclosureButton>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default ModernNavbar;
