import { useState, useEffect } from 'react';
import { checkOutService } from '../api/checkOutService';
import { CheckOutStatus } from '../types/checkOut';
import type { CheckOut } from '../types/checkOut';
import CheckOutActionModal from '../components/CheckOutActionModal';
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle.js';

const ModernManageCheckouts = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t('admin.manageCheckouts.title'));
  
  const [checkouts, setCheckouts] = useState<CheckOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'overdue'>('active');
  const [selectedCheckOut, setSelectedCheckOut] = useState<CheckOut | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // State to control instruction visibility
  const [showInstructions, setShowInstructions] = useState(true);
  
  useEffect(() => {
    // Set a timer to automatically dismiss the instructions after 8 seconds
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showInstructions]);
  
  useEffect(() => {          // Verify auth status before fetching data
          if (!isAuthenticated || !isAdmin) {
            navigate('/login');
            return;
          }
          
          fetchCheckouts();
          // Force repaint for any UI rendering issues
          setTimeout(() => {
            setLoading(false);
          }, 500);
  }, [activeTab, isAuthenticated, isAdmin, navigate]);
  
  const fetchCheckouts = async () => {
    try {
      setLoading(true);
      let data: CheckOut[];
      
      switch (activeTab) {
        case 'active':
          console.log('Fetching active checkouts');
          data = await checkOutService.getActiveCheckOuts();
          console.log('Active checkouts data:', data);
          // Filter out any returned books that might have come back from the API
          // Modified: Only filter by status to ensure we show all Active books
          data = data.filter(checkout => checkout.status !== CheckOutStatus.Returned);
          console.log('Filtered active checkouts:', data);
          break;
        case 'overdue':
          console.log('Fetching overdue checkouts');
          data = await checkOutService.getOverdueCheckOuts();
          console.log('Overdue checkouts data:', data);
          // Filter out any returned books that might have come back from the API
          // Modified: Only filter by status to ensure we show all Overdue books
          data = data.filter(checkout => checkout.status !== CheckOutStatus.Returned);
          console.log('Filtered overdue checkouts:', data);
          break;
        default:
          console.log('Fetching all checkouts');
          data = await checkOutService.getAllCheckOuts();
          console.log('All checkouts data:', data);
      }
      
      setCheckouts(data);
      setError(null);
    } catch (err) {
      setError(t('common.failedToLoad'));
      console.error('Error fetching checkouts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReturnBook = async (id: number) => {
    try {
      // Call the API to return the book
      const updatedCheckout = await checkOutService.returnBook(id);
      console.log('Book return response:', updatedCheckout);
      
      // Update all checkouts to reflect the change
      setCheckouts(checkouts.map(checkout => 
        checkout.id === id
          ? { ...checkout, status: CheckOutStatus.Returned } // Force the status to Returned
          : checkout
      ));
      
      // If we're in active or overdue tab, this book should no longer be visible
      if (activeTab === 'active' || activeTab === 'overdue') {
        setCheckouts(prev => prev.filter(checkout => checkout.id !== id));
      }
      
      setError(null);
    } catch (err) {
      setError(t('checkOutAction.failedAction'));
      console.error('Error returning book:', err);
    }
  };
  
  const handleRenewBook = async (id: number) => {
    try {
      const updatedCheckout = await checkOutService.renewCheckOut(id);
      
      // Update local state
      setCheckouts(checkouts.map(checkout => 
        checkout.id === id ? updatedCheckout : checkout
      ));
      
      setError(null);
    } catch (err) {
      setError(t('checkOutAction.failedAction'));
      console.error('Error renewing checkout:', err);
    }
  };

  const handleCheckOutAction = (checkOut: CheckOut) => {
    setSelectedCheckOut(checkOut);
    setIsActionModalOpen(true);
  };

  // Helper function to determine if a checkout has been properly returned
  const isBookReturned = (checkout: CheckOut): boolean => {
    // Check for epoch date (01/01/1970) which indicates a database default rather than an actual return
    const isEpochDate = checkout.returnDate ? new Date(checkout.returnDate).getTime() < 86400000 : false;
    
    // Special debugging
    console.log(`Checkout ${checkout.id} status: ${checkout.status}, returnDate: ${checkout.returnDate}, isEpochDate: ${isEpochDate}`);
    
    // Book is considered returned if it has Returned status OR a valid return date (not epoch)
    // Note the reversed logic - first check status, then check date
    return checkout.status === CheckOutStatus.Returned || 
           (checkout.returnDate !== undefined && !isEpochDate);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Handle epoch date (01/01/1970)
    if (date.getTime() < 86400000) {
      return 'N/A';
    }
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getStatusClass = (status: CheckOutStatus, dueDate: string) => {
    if (status === CheckOutStatus.Returned) {
      return 'bg-green-100 text-green-800';
    }
    
    const daysLeft = getDaysLeft(dueDate);
    
    if (status === CheckOutStatus.Overdue || daysLeft < 0) {
      return 'bg-red-100 text-red-800';
    }
    
    if (daysLeft <= 3) {
      return 'bg-yellow-100 text-yellow-800';
    }
    
    return 'bg-blue-100 text-blue-800';
  };
  
  return (
    <div className="auto-theme-bg min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
            {t('admin.manageCheckouts.title')}
          </h1>
          <p className="text-neutral-600">
            {t('admin.manageCheckouts.subtitle', 'View and manage library book checkouts')}
          </p>
        </div>
        
        <div className="mb-6">
          {/* Information message about clicking on rows - shows for active or overdue tabs */}
          {!loading && showInstructions && (activeTab === 'active' || activeTab === 'overdue') && (
            <div className="mb-4 p-4 bg-primary-50 border-l-4 border-primary-500 rounded-md text-primary-700 animate-pulse">
              <div className="flex justify-between items-center">
                <p className="flex items-center text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <span>
                    <strong>{t('common.tip')}:</strong> {t('admin.manageCheckouts.rowClickTip', 'Click on any non-returned checkout row or the "MANAGE BOOK" button to return or renew a book.')}
                  </span>
                </p>
                <button 
                  onClick={() => setShowInstructions(false)} 
                  className="text-primary-500 hover:text-primary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {t('admin.manageCheckouts.allCheckouts')}
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {t('common.active')}
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overdue'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {t('common.overdue')}
              </button>
            </nav>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        <div className="auto-theme-card shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-burrito-dark-border">
              <thead className="bg-neutral-100 dark:bg-burrito-dark-surface">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageCheckouts.book')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageCheckouts.user')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageCheckouts.checkedOutDate')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageCheckouts.dueDate')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageCheckouts.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="auto-theme-bg divide-y divide-neutral-200 dark:divide-burrito-dark-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-primary-600 font-medium">
                        {t('common.loading')} {activeTab === 'all' ? t('admin.manageCheckouts.allCheckouts').toLowerCase() : 
                          activeTab === 'active' ? t('common.active').toLowerCase() : 
                          t('common.overdue').toLowerCase()}...
                      </p>
                    </td>
                  </tr>
                ) : checkouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-neutral-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 0 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 1-6 2.292m0-14.25v14.25" />
                      </svg>
                      <p className="text-lg font-medium mb-1">
                        {t('admin.manageCheckouts.noCheckouts', { 
                          type: activeTab === 'all' ? '' : activeTab === 'active' ? t('common.active').toLowerCase() : t('common.overdue').toLowerCase() 
                        })}
                      </p>
                      <p>
                        {t('admin.manageCheckouts.noCheckoutsDescription', { 
                          type: activeTab === 'all' ? '' : activeTab === 'active' ? t('common.active').toLowerCase() : t('common.overdue').toLowerCase() 
                        })}
                      </p>
                    </td>
                  </tr>
                ) : (
                  checkouts.map((checkout) => {
                    const daysLeft = getDaysLeft(checkout.dueDate);
                    const isOverdue = daysLeft < 0;
                    // Simplified check - only consider a book returned if its status is Returned
                    const isReturned = checkout.status === CheckOutStatus.Returned;
                    
                    return (
                      <tr 
                        key={checkout.id} 
                        className={`relative group auto-theme-bg ${!isReturned ? 'cursor-pointer hover:bg-primary-50 dark:hover:bg-burrito-dark-surface hover:shadow-md transition-all duration-150 active:bg-primary-100 dark:active:bg-burrito-burgundy/50' : 'hover:bg-neutral-100 dark:hover:bg-burrito-dark-bg/70'}`}
                        onClick={() => !isReturned && handleCheckOutAction(checkout)}
                        style={!isReturned ? { position: 'relative', zIndex: 10 } : {}}
                      >
                        {!isReturned && (
                          <td className="absolute left-0 top-0 h-full w-2 px-0 py-0">
                            <div className="h-full w-2 bg-primary-500 group-hover:bg-primary-600 transition-colors duration-150"></div>
                          </td>
                        )}
                        <td className="px-6 py-4 auto-theme-bg">
                          <div className="text-sm font-medium auto-theme-text">{checkout.bookTitle}</div>
                          <div className="text-sm text-neutral-500 dark:text-burrito-gray">{checkout.catalogNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap auto-theme-bg">
                          <div className="text-sm auto-theme-text">{checkout.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap auto-theme-bg">
                          <div className="text-sm auto-theme-text">
                            {formatDate(checkout.checkOutDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap auto-theme-bg">
                          <div className="text-sm auto-theme-text">
                            {formatDate(checkout.dueDate)}
                          </div>
                          {!isReturned && (
                            <div className={`text-xs ${isOverdue ? 'text-red-600 font-semibold dark:text-red-400' : 'text-neutral-500 dark:text-burrito-gray'}`}>
                              {isOverdue
                                ? t('books.overdueWarning') + ' ' + Math.abs(daysLeft) + ' ' + t(Math.abs(daysLeft) === 1 ? 'common.day' : 'common.days')
                                : daysLeft + ' ' + t(daysLeft === 1 ? 'common.day' : 'common.days') + ' ' + t('books.left')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap auto-theme-bg">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusClass(checkout.status, checkout.dueDate)
                          }`}>
                            {isReturned 
                              ? t('books.returned')
                              : isOverdue 
                              ? t('common.overdue')
                              : t('common.active')}
                          </span>
                          {isReturned && (
                            <div className="text-xs text-neutral-500 dark:text-burrito-gray mt-1">
                              {formatDate(checkout.returnDate!)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right auto-theme-bg">
                          {!isReturned && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click
                                  handleCheckOutAction(checkout);
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-colors duration-150 transform hover:scale-105"
                                title="Manage checkout"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <span className="font-bold">{t('admin.manageCheckouts.manageBook')}</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Action Modal for Return/Renew */}
        <CheckOutActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          onReturn={() => {
            if (selectedCheckOut) {
              handleReturnBook(selectedCheckOut.id);
              setIsActionModalOpen(false);
            }
          }}
          onRenew={() => {
            if (selectedCheckOut) {
              handleRenewBook(selectedCheckOut.id);
              setIsActionModalOpen(false);
            }
          }}
          checkOut={selectedCheckOut}
        />
      </div>
    </div>
  );
};

export default ModernManageCheckouts;
