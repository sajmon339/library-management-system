import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { bookService } from '../api/bookService.js';
import { checkOutService } from '../api/checkOutService.js';
import { Book } from '../types/book.js';
import CheckOutModal from '../components/CheckOutModal.js';
import { 
  CalendarIcon, 
  UserIcon, 
  BuildingLibraryIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle.js';

const ModernBookDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Set a default page title
  usePageTitle('books.details');
  
  // Update document title directly when book changes
  useEffect(() => {
    if (book?.title) {
      document.title = `${book.title} - ${t('app.title')}`;
    }
  }, [book, t]);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      try {
        console.log('Fetching book details for id:', id);
        const data = await bookService.getBookById(parseInt(id, 10));
        console.log('Received book data:', data);
        setBook(data);
      } catch (err: any) {
        console.error('Error fetching book details:', {
          error: err,
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        if (err.response?.status === 404) {
          setError(t('books.notFound'));
        } else {
          setError(t('errors.serverError'));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id, t]);
  
  const handleCheckoutButtonClick = () => {
    setIsCheckoutModalOpen(true);
  };
  
  const handleCheckout = async (daysToReturn: number = 14) => {
    if (!book || !isAuthenticated) return;
    
    setCheckoutLoading(true);
    setCheckoutError(null);
    
    try {
      console.log('Attempting to check out book:', book.id, 'for', daysToReturn, 'days');
      await checkOutService.createCheckOut(book.id, daysToReturn);
      setCheckoutSuccess(true);
      
      // Update the book's available copies
      setBook({
        ...book,
        availableCopies: book.availableCopies - 1
      });
    } catch (err: any) {
      console.error('Error in handleCheckout:', err);
      // Provide more detailed error information to the user
      const errorMessage = err.response?.data || t('bookDetail.checkoutError');
      setCheckoutError(errorMessage);
    } finally {
      setCheckoutLoading(false);
      setIsCheckoutModalOpen(false);
    }
  };
  
  const renderCheckoutButton = () => {
    if (!isAuthenticated) {
      return (
        <div className="mt-2">
          <Link to="/login" className="btn btn-primary">
            {t('bookDetail.signInToCheckOut', 'Sign in to check out')}
          </Link>
        </div>
      );
    }
    
    if (checkoutSuccess) {
      return (
        <div className="mt-4 bg-green-50 text-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{t('bookDetail.checkoutSuccess')}</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (checkoutError) {
      return (
        <div className="mt-4 bg-red-50 text-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{checkoutError}</p>
            </div>
          </div>
          <button 
            onClick={handleCheckoutButtonClick} 
            className="mt-3 text-sm font-medium text-red-700 underline"
          >
            {t('common.tryAgain', 'Try Again')}
          </button>
        </div>
      );
    }
    
    const isBookAvailable = book && book.availableCopies > 0;
    
    return (
      <div className="mt-2">
        <button
          onClick={handleCheckoutButtonClick}
          disabled={!isBookAvailable || checkoutLoading}
          className={`btn ${isBookAvailable ? 'btn-primary' : 'btn-disabled'} w-full md:w-auto`}
        >
          {checkoutLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.loading')}
            </span>
          ) : isBookAvailable ? (
            t('books.checkout')
          ) : (
            t('books.unavailable')
          )}
        </button>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="auto-theme-bg min-h-screen pt-24 pb-16">
        <div className="container-custom">
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="auto-theme-bg min-h-screen pt-24 pb-16">
        <div className="container-custom">
          <div className="bg-red-50 rounded-lg p-6 text-red-700 max-w-xl mx-auto">
            <h1 className="text-xl font-semibold mb-3">{t('common.error')}</h1>
            <p className="mb-4">{error || t('errors.serverError')}</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate(-1)} 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
                {t('common.back')}
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('common.tryAgain', 'Try Again')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auto-theme-bg min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center auto-theme-text hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            {t('common.back')}
          </button>
        </div>
        
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row">
            {/* Book cover image */}
            <div className="md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
              <div className="relative w-48 h-72 md:w-56 md:h-80 overflow-hidden rounded-lg shadow-md">
                <img
                  src={bookService.getBookCover(book.id)}
                  alt={`${book.title} ${t('common.cover')}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Prevent infinite loop by clearing error handler
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // Try placeholder
                    target.src = '/assets/book-placeholder.jpg';
                    target.onerror = () => {
                      // If placeholder also fails, show fallback gradient
                      target.style.display = 'none';
                      (target.parentNode as HTMLElement).innerHTML = `
                        <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-600 to-primary-400 p-6">
                          <div class="text-center text-white">
                            <h3 class="text-xl font-semibold mb-2">${book.title}</h3>
                            <p class="opacity-80">${book.author}</p>
                          </div>
                        </div>
                      `;
                    };
                  }}
                />
              </div>
            </div>
            
            {/* Book details */}
            <div className="md:w-2/3 md:pl-8">
              <span className="text-sm uppercase tracking-wide text-neutral-500 font-medium">
                {book.genre}
              </span>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 dark:text-burrito-beige mt-1 mb-2">
                {book.title}
              </h1>
              <p className="text-lg auto-theme-text-secondary mb-4">
                {t('books.by')} {book.author}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 mb-6">
                <div className="flex items-center">
                  <BuildingLibraryIcon className="h-5 w-5 auto-theme-text-secondary mr-2" />
                  <span className="text-sm auto-theme-text-secondary">
                    <strong>{t('books.publisher')}:</strong> {book.publisher}
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 auto-theme-text-secondary mr-2" />
                  <span className="text-sm auto-theme-text-secondary">
                    <strong>{t('books.publishedYear')}:</strong> {book.publishedYear}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="mr-2 auto-theme-text-secondary">{t('books.availability')}:</span>
                  {book.availableCopies > 0 ? (
                    <span className="inline-flex items-center text-sm font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <svg className="h-2 w-2 fill-current text-green-500 mr-1.5" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      {t('books.available')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      <svg className="h-2 w-2 fill-current text-red-500 mr-1.5" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      {t('books.unavailable')}
                    </span>
                  )}
                </div>
                <p className="text-sm auto-theme-text-secondary">
                  <strong>{t('books.copies')}:</strong> {book.availableCopies} / {book.totalCopies}
                </p>
                <p className="text-sm auto-theme-text-secondary">
                  <strong>{t('books.catalogNumber')}:</strong> {book.catalogNumber || 'N/A'}
                </p>
              </div>
              
              {/* Checkout button */}
              {renderCheckoutButton()}
            </div>
          </div>
          
          {/* Book description section */}
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-burrito-beige mb-4">
              {t('bookDetail.about', 'About this book')}
            </h2>
            <div className="prose max-w-none auto-theme-text">
              <p>{t('bookDetail.noDescription', 'No description available for this book.')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Checkout modal */}
      <CheckOutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleCheckout}
        bookTitle={book.title}
      />
    </div>
  );
};

export default ModernBookDetail;
