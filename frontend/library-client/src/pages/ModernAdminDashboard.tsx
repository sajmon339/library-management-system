import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../api/bookService.js';
import { userService } from '../api/userService.js';
import { checkOutService } from '../api/checkOutService.js';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle.js';
import { 
  UserGroupIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const ModernAdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeCheckouts: 0,
    overdueCheckouts: 0,
    returnsToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Set the page title
  usePageTitle(t('admin.dashboard.title'));
  
  // Dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Normally we would have a dedicated endpoint for dashboard stats
        // Here we'll simulate it with multiple API calls
        const [books, users, checkouts] = await Promise.all([
          bookService.getBooks(),
          userService.getAllUsers(),
          checkOutService.getAllCheckOuts()
        ]);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        setStats({
          totalBooks: books.length,
          availableBooks: books.reduce((sum, book) => sum + book.availableCopies, 0),
          totalUsers: users.length,
          activeCheckouts: checkouts.filter(co => !co.returnDate).length,
          overdueCheckouts: checkouts.filter(co => !co.returnDate && new Date(co.dueDate) < new Date()).length,
          returnsToday: checkouts.filter(co => {
            const returnDate = co.returnDate ? new Date(co.returnDate) : null;
            if (!returnDate) return false;
            returnDate.setHours(0, 0, 0, 0);
            return returnDate.getTime() === today.getTime();
          }).length
        });
        
        setLoading(false);
      } catch (err) {
        setError(t('common.failedToLoad'));
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [t]);
  
  // Sample activity data for charts
  const recentActivity = [
    { action: 'Check out', user: 'john_doe', book: 'The Great Gatsby', time: '10 minutes ago' },
    { action: 'Return', user: 'alice_smith', book: 'To Kill a Mockingbird', time: '45 minutes ago' },
    { action: 'New user', user: 'robert_johnson', book: null, time: '1 hour ago' },
    { action: 'Check out', user: 'emma_wilson', book: 'Pride and Prejudice', time: '2 hours ago' },
    { action: 'Book added', user: 'admin', book: 'The Catcher in the Rye', time: '3 hours ago' },
    { action: 'Return', user: 'michael_brown', book: '1984', time: '4 hours ago' },
  ];
  
  return (
    <div className="auto-theme-bg min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 dark:text-burrito-beige mb-2">
            {t('admin.dashboard.title')}
          </h1>
          <p className="auto-theme-text">
            {t('admin.dashboard.subtitle', 'Manage your library system and monitor key metrics')}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg p-4 text-red-700">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p>{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-red-700 underline"
            >
              {t('common.tryAgain', 'Try Again')}
            </button>
          </div>
        ) : (
          <div>
            {/* Quick stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary-100 p-3 mr-4">
                    <img src="/burrito_icon_plain.png" alt="Universidad de WSBurrito Logo" className="h-7 w-7 rounded-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">{t('books.title')}</h3>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.totalBooks}</div>
                    <div className="text-sm text-neutral-600">
                      {stats.availableBooks} {t('admin.dashboard.availableBooks').toLowerCase()}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <Link to="/admin/books" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                    {t('nav.manageBooks')}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-start">
                  <div className="rounded-full bg-accent-100 p-3 mr-4">
                    <UserGroupIcon className="h-7 w-7 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">{t('admin.dashboard.totalUsers')}</h3>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.totalUsers}</div>
                    <div className="text-sm text-neutral-600">
                      {t('admin.dashboard.activeMembers', 'Active library members')}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <Link to="/admin/users" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                    {t('nav.manageUsers')}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-start">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <ClockIcon className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">{t('nav.checkouts')}</h3>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.activeCheckouts}</div>
                    <div className="text-sm text-neutral-600">
                      {stats.overdueCheckouts > 0 ? (
                        <span className="text-red-600 font-medium">{stats.overdueCheckouts} {t('common.overdue').toLowerCase()}</span>
                      ) : (
                        <span>{t('admin.dashboard.noOverdueItems', 'No overdue items')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <Link to="/admin/checkouts" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center">
                    {t('admin.manageCheckouts.title')}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main reports section */}
              <div className="lg:col-span-2">
                <div className="card p-6 md:p-8 mb-8">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                    {t('admin.dashboard.systemOverview', 'System Overview')}
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-neutral-50 rounded-lg p-4 text-center">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600 mb-3">
                        <DocumentTextIcon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">
                        {stats.totalBooks}
                      </div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wide">
                        {t('admin.dashboard.totalBooks')}
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 text-center">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent-100 text-accent-600 mb-3">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">
                        {stats.totalUsers}
                      </div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wide">
                        {t('admin.dashboard.members', 'Members')}
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 text-center">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 mb-3">
                        <HandRaisedIcon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">
                        {stats.activeCheckouts}
                      </div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wide">
                        {t('admin.dashboard.activeLoans', 'Active Loans')}
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 text-center">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 mb-3">
                        <CheckCircleIcon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">
                        {stats.returnsToday}
                      </div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wide">
                        {t('admin.dashboard.returnsToday')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart placeholder */}
                  <div className="mt-4">
                    <h3 className="text-base font-medium text-neutral-900 mb-3">
                      {t('admin.dashboard.checkoutsOverTime', 'Checkouts Over Time')}
                    </h3>
                    <div className="h-64 bg-neutral-50 rounded-lg flex items-center justify-center">
                      <div className="text-neutral-400 text-center">
                        <TrophyIcon className="h-10 w-10 mx-auto mb-2" />
                        <p>{t('admin.dashboard.chartPlaceholder', 'Interactive chart will appear here')}</p>
                        <p className="text-sm">{t('admin.dashboard.chartDescription', 'Showing checkout trends over time')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                    {t('admin.dashboard.quickActions', 'Quick Actions')}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/admin/books" className="group p-5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {t('admin.manageBooks.addBook')}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {t('admin.dashboard.addBookDescription', 'Add a new book to the library catalog')}
                          </p>
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/admin/users?add=true" className="group p-5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {t('admin.manageUsers.addUser')}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {t('admin.dashboard.createUserDescription', 'Create a new user account')}
                          </p>
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/admin/checkouts" className="group p-5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {t('admin.manageCheckouts.newCheckout')}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {t('admin.dashboard.newCheckoutDescription', 'Process a new book checkout')}
                          </p>
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/admin/checkouts" className="group p-5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {t('admin.manageCheckouts.processReturn')}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {t('admin.dashboard.processReturnDescription', 'Process a book return')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Activity feed */}
              <div className="lg:col-span-1">
                <div className="card p-6 md:p-8 mb-8">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                    {t('admin.dashboard.recentActivity', 'Recent Activity')}
                  </h2>
                  
                  <div className="space-y-5">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            activity.action === 'Check out' 
                              ? 'bg-primary-100 text-primary-600' 
                              : activity.action === 'Return' 
                              ? 'bg-green-100 text-green-600'
                              : activity.action === 'New user'
                              ? 'bg-accent-100 text-accent-600'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {activity.action === 'Check out' && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                              </svg>
                            )}
                            {activity.action === 'Return' && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                              </svg>
                            )}
                            {activity.action === 'New user' && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                              </svg>
                            )}
                            {activity.action === 'Book added' && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-900">
                            <span className="font-medium">{activity.action}:</span>{' '}
                            <span className="text-primary-600">{activity.user}</span>
                            {activity.book && (
                              <span>
                                {' '}
                                {activity.action === 'Book added' ? 'added' : activity.action === 'Check out' ? 'checked out' : 'returned'}{' '}
                                <span className="text-neutral-900 font-medium">{activity.book}</span>
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                      {t('admin.dashboard.viewAllActivity', 'View all activity')}
                    </button>
                  </div>
                </div>
                
                <div className="card p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                    {t('admin.dashboard.systemStatus', 'System Status')}
                  </h2>
                  
                  <div className="flex items-center mb-4">
                    <div className="relative flex-shrink-0 mr-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <div className="absolute h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('admin.dashboard.allSystemsOperational', 'All systems operational')}</p>
                      <p className="text-xs text-neutral-500">{t('admin.dashboard.lastUpdated', 'Last updated')}: 10 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">{t('admin.dashboard.database', 'Database')}</span>
                      <span className="text-green-600 font-medium">{t('admin.dashboard.operational', 'Operational')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">{t('admin.dashboard.api', 'API')}</span>
                      <span className="text-green-600 font-medium">{t('admin.dashboard.operational', 'Operational')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">{t('admin.dashboard.webInterface', 'Web Interface')}</span>
                      <span className="text-green-600 font-medium">{t('admin.dashboard.operational', 'Operational')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernAdminDashboard;
