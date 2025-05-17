import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BookOpenIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.js';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ModernNavbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Books', href: '/books', current: location.pathname === '/books' },
  ];
  
  // Navigation links for logged in users
  const userNavigation = [
    { name: 'My Books', href: '/my-books', current: location.pathname === '/my-books' },
  ];
  
  // Navigation links for admin users
  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', current: location.pathname === '/admin' },
    { name: 'Manage Books', href: '/admin/books', current: location.pathname === '/admin/books' },
    { name: 'Manage Users', href: '/admin/users', current: location.pathname === '/admin/users' },
    { name: 'Check-outs', href: '/admin/checkouts', current: location.pathname === '/admin/checkouts' },
  ];

  // Get navigation based on user role
  const navigation = [
    ...publicNavigation,
    ...(isAuthenticated ? userNavigation : []),
    ...(isAdmin ? adminNavigation : []),
  ];

  // User menu items
  const userMenuItems = [
    { name: 'Your Profile', href: '/profile', icon: <UserIcon className="h-5 w-5 mr-2" /> },
    { name: 'Change Password', href: '/change-password', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> },
  ];

  return (
    <Disclosure as="nav" className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-1' : 'bg-transparent pt-3'}`}>
      {({ open }) => (
        <>
          <div className="container-custom">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className={`relative inline-flex items-center justify-center rounded-md p-2 ${scrolled ? 'text-neutral-500 hover:bg-neutral-100' : 'text-white hover:bg-white/10'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500`}>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center">
                  <Link to="/" className={`flex items-center text-2xl font-heading font-bold ${scrolled ? 'text-primary-700' : 'text-white'}`}>
                    <BookOpenIcon className="h-8 w-8 mr-2" />
                    <span>LibraryHub</span>
                  </Link>
                </div>
                
                <div className="hidden sm:ml-10 sm:flex sm:space-x-4 items-center">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current 
                          ? (scrolled ? 'text-primary-700 border-b-2 border-primary-600' : 'text-white border-b-2 border-white')
                          : (scrolled ? 'text-neutral-600 hover:text-primary-700' : 'text-white/80 hover:text-white'),
                        'px-3 py-2 text-sm font-medium transition-colors duration-200'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className={`hidden sm:flex items-center justify-center p-2 rounded-full ${scrolled ? 'text-neutral-500 hover:bg-neutral-100' : 'text-white hover:bg-white/10'}`}>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
                
                {isAuthenticated ? (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className={`flex rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}>
                        <span className="sr-only">Open user menu</span>
                        <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <p className="text-sm text-neutral-500">Signed in as</p>
                          <p className="text-sm font-medium text-neutral-900 truncate">{user?.userName}</p>
                        </div>
                        
                        {userMenuItems.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={classNames(
                                  active ? 'bg-neutral-50' : '',
                                  'flex items-center px-4 py-2 text-sm text-neutral-700'
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
                                active ? 'bg-neutral-50' : '',
                                'flex items-center w-full text-left px-4 py-2 text-sm text-neutral-700'
                              )}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                              </svg>
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className={`text-sm font-medium ${scrolled ? 'text-neutral-700 hover:text-primary-700' : 'text-white hover:text-white/80'}`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary py-2 px-4 text-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-white shadow-lg">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-700',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default ModernNavbar;
