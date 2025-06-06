import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { checkOutService } from '../api/checkOutService.js';
import { Link } from 'react-router-dom';
import type { CheckOut } from '../types/checkOut.js';
import { UserIcon, IdentificationIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle.js';

const ModernProfile = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [checkOuts, setCheckOuts] = useState<CheckOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: string }>({});
  const [actionStatus, setActionStatus] = useState<{ [key: number]: { success: boolean; message: string } }>({});
  
  // Set page title
  usePageTitle(t('profile.title'));
  
  useEffect(() => {
    let isMounted = true;
    const fetchCheckOuts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await checkOutService.getUserCheckOuts();
        
        if (isMounted) {
          setCheckOuts(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching checkouts:", err);
        if (isMounted) {
          setError(t('errors.serverError'));
          setLoading(false);
        }
      }
    };
    
    fetchCheckOuts();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [t]);
  
  const handleRenewBook = async (checkOutId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [checkOutId]: 'renew' }));
      const updatedCheckOut = await checkOutService.renewCheckOut(checkOutId);
      
      // Update the checkouts list
      setCheckOuts(prev => 
        prev.map(co => co.id === checkOutId ? updatedCheckOut : co)
      );
      
      // Set success message
      setActionStatus(prev => ({
        ...prev,
        [checkOutId]: {
          success: true,
          message: t('checkOutAction.renewSuccess')
        }
      }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setActionStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[checkOutId];
          return newStatus;
        });
      }, 3000);
    } catch (err) {
      console.error("Error renewing book:", err);
      setActionStatus(prev => ({
        ...prev,
        [checkOutId]: {
          success: false,
          message: t('checkOutAction.failedAction')
        }
      }));
    } finally {
      setActionLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[checkOutId];
        return newLoading;
      });
    }
  };
  
  const handleReturnBook = async (checkOutId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [checkOutId]: 'return' }));
      const updatedCheckOut = await checkOutService.returnBook(checkOutId);
      
      // Update the checkouts list
      setCheckOuts(prev => 
        prev.map(co => co.id === checkOutId ? updatedCheckOut : co)
      );
      
      // Set success message
      setActionStatus(prev => ({
        ...prev,
        [checkOutId]: {
          success: true,
          message: t('checkOutAction.returnSuccess')
        }
      }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setActionStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[checkOutId];
          return newStatus;
        });
      }, 3000);
    } catch (err) {
      console.error("Error returning book:", err);
      setActionStatus(prev => ({
        ...prev,
        [checkOutId]: {
          success: false,
          message: t('checkOutAction.failedAction')
        }
      }));
    } finally {
      setActionLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[checkOutId];
        return newLoading;
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  
  return (
    <div className="auto-theme-bg min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 dark:text-burrito-beige mb-2">
            {t('profile.title')}
          </h1>
          <p className="auto-theme-text">
            {t('profile.personalInfo')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User details section */}
          <div>
            <div className="card p-6 md:p-8 mb-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-semibold shadow-sm">
                  {user?.userName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-5">
                  <h2 className="text-xl font-semibold auto-theme-text">
                    {user?.userName}
                  </h2>
                  <p className="auto-theme-text opacity-80">
                    {user?.role} {t('common.account')}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-6 space-y-4">
                <div className="flex items-center">
                  <IdentificationIcon className="h-5 w-5 text-neutral-500 mr-3" />
                  <div>
                    <div className="text-sm text-neutral-500">{t('profile.username')}</div>
                    <div className="font-medium">{user?.userName}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-500 mr-3" />
                  <div>
                    <div className="text-sm text-neutral-500">{t('profile.email')}</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-neutral-500 mr-3" />
                  <div>
                    <div className="text-sm text-neutral-500">{t('profile.memberSince')}</div>
                    <div className="font-medium">
                      {user?.createdAt ? formatDate(user.createdAt) : '-'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <Link to="/change-password" className="btn btn-secondary w-full justify-center">
                  {t('profile.changePasswordButton')}
                </Link>
                
                <Link to="/edit-profile" className="btn btn-primary w-full justify-center">
                  {t('profile.editProfileButton')}
                </Link>
              </div>
            </div>
            
            <div className="card p-6 md:p-8">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-burrito-beige mb-4">
                {t('admin.dashboard.quickStats')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="auto-theme-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-500">
                    {checkOuts.length}
                  </div>
                  <div className="text-sm auto-theme-text">{t('admin.dashboard.totalBooks')}</div>
                </div>
                
                <div className="auto-theme-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-500">
                    {checkOuts.filter(co => !co.returnDate).length}
                  </div>
                  <div className="text-sm auto-theme-text">{t('myBooks.currentlyBorrowed')}</div>
                </div>
                
                <div className="auto-theme-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-500">
                    {checkOuts.filter(co => new Date(co.dueDate) < new Date() && !co.returnDate).length}
                  </div>
                  <div className="text-sm auto-theme-text">{t('admin.manageCheckouts.overdueCheckouts')}</div>
                </div>
                
                <div className="auto-theme-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-500">
                    {checkOuts.filter(co => co.returnDate).length}
                  </div>
                  <div className="text-sm auto-theme-text">{t('books.return')}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkouts section */}
          <div className="lg:col-span-2">
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-semibold auto-theme-text mb-6">
                {t('myBooks.currentlyBorrowed')}
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : error ? (
                <div className="bg-red-50 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              ) : checkOuts.length === 0 ? (
                <div className="auto-theme-card rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <h3 className="text-lg font-medium text-neutral-800 mb-2">
                    {t('myBooks.noBooksMessage')}
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {t('myBooks.noBooksMessage')}
                  </p>
                  <Link to="/books" className="btn btn-primary">
                    {t('books.title')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Checkouts */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium auto-theme-text mb-4">
                      {t('myBooks.currentlyBorrowed')}
                    </h3>
                    {checkOuts.filter(co => !co.returnDate).length === 0 ? (
                      <p className="auto-theme-text">{t('myBooks.noBooksMessage')}</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {checkOuts
                          .filter(co => !co.returnDate)
                          .map(checkOut => {
                            const daysLeft = getDaysLeft(checkOut.dueDate);
                            return (
                              <div key={checkOut.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-neutral-900 mb-1 hover:text-primary-600 transition-colors">
                                      <Link to={`/books/${checkOut.bookId}`}>
                                        {checkOut.bookTitle}
                                      </Link>
                                    </h4>
                                    <p className="text-sm text-neutral-600 mb-2">
                                      {t('books.catalogNumber')}: {checkOut.catalogNumber}
                                    </p>
                                    <div className="flex items-center text-sm text-neutral-500">
                                      <span className="mr-4">
                                        {t('admin.manageCheckouts.checkedOutDate')}: {formatDate(checkOut.checkOutDate)}
                                      </span>
                                      <span>
                                        {t('books.dueDate')}: {formatDate(checkOut.dueDate)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    daysLeft < 0
                                      ? 'bg-red-100 text-red-800'
                                      : daysLeft <= 3
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {daysLeft < 0
                                      ? `${t('books.overdueWarning')} ${Math.abs(daysLeft)} ${Math.abs(daysLeft) !== 1 ? t('common.days') : t('common.day')}`
                                      : daysLeft === 0
                                      ? t('books.dueToday')
                                      : `${daysLeft} ${daysLeft !== 1 ? t('common.days') : t('common.day')} ${t('books.left')}`}
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <button 
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                    onClick={() => handleRenewBook(checkOut.id)}
                                    disabled={actionLoading[checkOut.id] === 'renew'}
                                  >
                                    {actionLoading[checkOut.id] === 'renew' ? t('common.loading') : t('books.renew')}
                                  </button>
                                  <span className="mx-2 text-neutral-300">|</span>
                                  <button 
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                    onClick={() => handleReturnBook(checkOut.id)}
                                    disabled={actionLoading[checkOut.id] === 'return'}
                                  >
                                    {actionLoading[checkOut.id] === 'return' ? t('common.loading') : t('books.return')}
                                  </button>
                                </div>
                                {actionStatus[checkOut.id] && (
                                  <div className={`mt-2 text-sm ${actionStatus[checkOut.id].success ? 'text-green-600' : 'text-red-600'}`}>
                                    {actionStatus[checkOut.id].message}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  
                  {/* Borrowing History */}
                  {checkOuts.filter(co => co.returnDate).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium auto-theme-text mb-4">
                        {t('myBooks.readingHistory')}
                      </h3>
                      <div className="border border-neutral-200 dark:border-burrito-dark-border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-neutral-200 dark:divide-burrito-dark-border">
                          <thead className="bg-neutral-100 dark:bg-burrito-dark-surface">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                                {t('admin.manageCheckouts.book')}
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                                {t('admin.manageCheckouts.checkedOutDate')}
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                                {t('admin.manageCheckouts.returnedDate')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-burrito-dark-bg divide-y divide-neutral-200 dark:divide-burrito-dark-border">
                            {checkOuts
                              .filter(co => co.returnDate)
                              .map(checkOut => (
                                <tr key={checkOut.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                                      <Link to={`/books/${checkOut.bookId}`}>
                                        {checkOut.bookTitle}
                                      </Link>
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                      {t('books.catalogNumber')}: {checkOut.catalogNumber}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                    {formatDate(checkOut.checkOutDate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                    {checkOut.returnDate ? formatDate(checkOut.returnDate) : '-'}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;
