import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkOutService } from '../api/checkOutService.js';
import { bookService } from '../api/bookService.js';
import type { CheckOut } from '../types/checkOut.js';
import CheckOutActionModal from '../components/CheckOutActionModal.js';
import { 
  ArrowPathIcon, 
  ArrowUturnLeftIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle.js';

const ModernMyBooks = () => {
  const { t } = useTranslation();
  const [checkOuts, setCheckOuts] = useState<CheckOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionSuccess, setActionSuccess] = useState<{id: number, action: string} | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<CheckOut | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  
  // Set page title
  usePageTitle(t('myBooks.title'));
  
  useEffect(() => {
    fetchCheckOuts();
  }, []);
  
  const fetchCheckOuts = async () => {
    try {
      const data = await checkOutService.getUserCheckOuts();
      setCheckOuts(data);
    } catch (err) {
      setError('Failed to load your checked out books.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReturn = async (id: number) => {
    setActionLoading(id);
    try {
      await checkOutService.returnBook(id);
      setActionSuccess({id, action: 'return'});
      
      // Update the checkout in the list
      setCheckOuts(checkOuts.map(co => 
        co.id === id ? {...co, returnDate: new Date().toISOString()} : co
      ));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to return the book.');
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleRenew = async (id: number) => {
    setActionLoading(id);
    try {
      const updatedCheckout = await checkOutService.renewCheckOut(id);
      setActionSuccess({id, action: 'renew'});
      
      // Update the checkout in the list
      setCheckOuts(checkOuts.map(co => 
        co.id === id ? updatedCheckout : co
      ));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to renew the book.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOutAction = (checkOut: CheckOut) => {
    setSelectedCheckOut(checkOut);
    setIsActionModalOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
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
  
  const getCurrentCheckouts = () => {
    return checkOuts.filter(co => !co.returnDate);
  };
  
  const getReturnedBooks = () => {
    return checkOuts.filter(co => co.returnDate);
  };
  
  return (
    <div className="auto-theme-bg min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
            {t('myBooks.title')}
          </h1>
          <p className="text-neutral-600">
            {t('myBooks.manageBooks')}
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
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-red-700">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p>{error}</p>
            </div>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchCheckOuts();
              }}
              className="mt-3 text-sm font-medium text-red-700 underline"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        ) : checkOuts.length === 0 ? (
          <div className="card p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-16 w-16 text-neutral-300 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              {t('myBooks.noBooksTitle')}
            </h2>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              {t('myBooks.noBooksDescription')}
            </p>
            <Link to="/books" className="btn btn-primary">
              {t('myBooks.browseBooks')}
            </Link>
          </div>
        ) : (
          <div>
            {/* Current Checkouts */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-heading font-semibold text-neutral-900">
                  {t('myBooks.currentlyBorrowed')}
                </h2>
                {getCurrentCheckouts().length > 0 && (
                  <Link to="/books" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    {t('myBooks.browseBooks')}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                )}
              </div>
              
              {getCurrentCheckouts().length === 0 ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
                  <p className="text-neutral-600 mb-4">
                    {t('myBooks.noBooksMessage')}
                  </p>
                  <Link to="/books" className="btn btn-primary">
                    {t('myBooks.browseBooks')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentCheckouts().map(checkOut => {
                    const daysLeft = getDaysLeft(checkOut.dueDate);
                    const isOverdue = daysLeft < 0;
                    
                    return (
                      <div key={checkOut.id} className="card overflow-hidden">
                        {/* Book cover/placeholder */}
                        <div className="h-48 overflow-hidden">
                          {checkOut.bookId ? (
                            <img 
                              src={bookService.getBookCover(checkOut.bookId)} 
                              alt={checkOut.bookTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to a gradient placeholder on error
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite error loop
                                target.style.display = 'none';
                                (target.parentNode as HTMLElement).innerHTML = `
                                  <div class="h-full w-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center p-2">
                                    <div class="text-center text-white">
                                      <h3 class="text-xl font-semibold mb-1">${checkOut.bookTitle}</h3>
                                      <p class="opacity-90">by ${checkOut.catalogNumber}</p>
                                    </div>
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center p-6">
                              <div className="text-center text-white">
                                <h3 className="text-xl font-semibold mb-1">{checkOut.bookTitle}</h3>
                                <p className="opacity-90">by {checkOut.catalogNumber}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5">
                          <Link to={`/books/${checkOut.bookId}`}>
                            <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors mb-1">
                              {checkOut.bookTitle}
                            </h3>
                          </Link>
                          <p className="text-neutral-600 text-sm mb-4">
                            by {checkOut.catalogNumber}
                          </p>
                          
                          <div className="flex items-center mb-4">
                            <ClockIcon className="h-4 w-4 text-neutral-500 mr-2" />
                            <span className="text-sm text-neutral-600">Due: {formatDate(checkOut.dueDate)}</span>
                          </div>
                          
                          <div className={`mb-4 text-sm px-3 py-1.5 rounded-full inline-flex items-center ${
                            isOverdue
                              ? 'bg-red-100 text-red-800'
                              : daysLeft <= 3
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isOverdue ? (
                              <>
                                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                {t('books.overdueWarning')} {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? t('common.day') : t('common.days')}
                              </>
                            ) : daysLeft === 0 ? (
                              <>
                                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                {t('books.dueToday')}
                              </>
                            ) : (
                              <>
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {daysLeft} {daysLeft === 1 ? t('common.day') : t('common.days')} {t('books.left')}
                              </>
                            )}
                          </div>
                          
                          {actionSuccess && actionSuccess.id === checkOut.id && (
                            <div className="bg-green-50 text-green-800 px-3 py-2 rounded-md text-sm mb-4 flex items-center">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              {actionSuccess.action === 'renew' 
                                ? t('checkOutAction.renewSuccess')
                                : t('checkOutAction.returnSuccess')}
                            </div>
                          )}
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleCheckOutAction(checkOut)}
                              disabled={actionLoading === checkOut.id}
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-primary-300 rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none"
                            >                                  {actionLoading === checkOut.id ? (
                                <svg className="animate-spin h-4 w-4 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <>
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {t('checkOutAction.title')}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Borrowing History */}
            {getReturnedBooks().length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-semibold text-neutral-900 mb-6">
                  {t('myBooks.readingHistory')}
                </h2>
                
                <div className="bg-white shadow-soft rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                            {t('admin.manageCheckouts.status')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-burrito-dark-bg divide-y divide-neutral-200 dark:divide-burrito-dark-border">
                        {getReturnedBooks().map((checkOut) => {
                          const dueDate = new Date(checkOut.dueDate);
                          const returnDate = new Date(checkOut.returnDate!);
                          const isLate = returnDate > dueDate;
                          
                          return (
                            <tr key={checkOut.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                                  <Link to={`/books/${checkOut.bookId}`}>
                                    {checkOut.bookTitle}
                                  </Link>
                                </div>
                                <div className="text-sm text-neutral-500">
                                  by {checkOut.catalogNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                {formatDate(checkOut.checkOutDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                {formatDate(checkOut.returnDate!)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  isLate 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {isLate ? t('books.overdueWarning') : t('books.returned')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action Modal for Return/Renew */}
      <CheckOutActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onReturn={() => {
          if (selectedCheckOut) {
            handleReturn(selectedCheckOut.id);
            setIsActionModalOpen(false);
          }
        }}
        onRenew={() => {
          if (selectedCheckOut) {
            handleRenew(selectedCheckOut.id);
            setIsActionModalOpen(false);
          }
        }}
        checkOut={selectedCheckOut}
      />
    </div>
  );
};

export default ModernMyBooks;
