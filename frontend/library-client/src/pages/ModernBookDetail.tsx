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
        const data = await bookService.getBookById(parseInt(id, 10));
        setBook(data);
        // Set page title with book title
        usePageTitle(data.title);
      } catch (err) {
        setError(t('errors.serverError'));
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
      const errorMessage = err.response?.data || 'Failed to check out the book. Please try again.';
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
            Sign in to check out
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
              <h3 className="text-sm font-medium">{t('common.success')}!</h3>
              <p className="mt-1 text-sm">{t('bookDetail.checkoutSuccess')}</p>
              <div className="mt-2">
                <Link to="/my-books" className="text-sm font-medium text-green-800 underline">
                  {t('myBooks.title')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (book?.availableCopies === 0) {
      return (
        <button 
          disabled
          className="btn bg-neutral-200 text-neutral-500 cursor-not-allowed mt-2"
        >
          {t('books.unavailable')}
        </button>
      );
    }
    
    return (
      <div className="mt-2">
        <button 
          onClick={handleCheckoutButtonClick}
          disabled={checkoutLoading}
          className="btn btn-primary"
        >
          {checkoutLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.loading')}
            </div>
          ) : (
            t('books.checkout')
          )}
        </button>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-start">
        <div className="animate-spin h-8 w-8 text-primary-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-soft p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-4">
            {t('books.noBooks')}
          </h2>
          <p className="text-neutral-600 mb-6">
            {error || t('errors.serverError')}
          </p>
          <button 
            onClick={() => navigate('/books')}
            className="btn btn-primary"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen auto-theme-bg pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            {t('common.back')}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book cover/image column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary-600 to-primary-400 aspect-[2/3] rounded-xl shadow-soft overflow-hidden flex items-center justify-center p-2">
              {book.coverImagePath ? (
                <img 
                  src={bookService.getBookCover(book.id)} 
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to the placeholder on error
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite error loop
                    target.src = '/assets/placeholder-cover.svg';
                  }}
                />
              ) : (
                <div className="text-center text-white p-6">
                  <img src="/burrito_icon_plain.png" alt="Universidad de WSBurrito Logo" className="h-16 w-16 mx-auto mb-4 opacity-90 rounded-full object-cover" />
                  <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
                  <p className="opacity-80">{t('books.author')}: {book.author}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t('books.availability')}</h3>
                
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-600">{t('admin.manageCheckouts.status')}:</span>
                  <span className={`font-medium ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.availableCopies > 0 ? t('books.available') : t('books.unavailable')}
                  </span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-600">{t('books.copies')}:</span>
                  <span className="font-medium text-neutral-900">{book.availableCopies} of {book.totalCopies}</span>
                </div>
                
                {checkoutError && (
                  <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm">
                    {checkoutError}
                  </div>
                )}
                
                {renderCheckoutButton()}
              </div>
            </div>
          </div>
          
          {/* Book details column */}
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">{book.title}</h1>
              <p className="text-xl text-neutral-600 mb-6">{t('books.author')}: {book.author}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">{t('books.publishedYear')}</div>
                    <div className="font-medium">{book.publishedYear}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <BuildingLibraryIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">{t('books.publisher')}</div>
                    <div className="font-medium">{book.publisher}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">{t('books.genre')}</div>
                    <div className="font-medium">{book.genre.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">{t('books.catalogNumber')}</div>
                    <div className="font-medium">{book.catalogNumber}</div>
                  </div>
                </div>
              </div>
              
              {/* Placeholder for book description since it's not in the type */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Description</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius faucibus massa sollicitudin amet augue. Nibh metus a semper purus mauris duis. Lorem eu neque, tristique quis duis. Nibh scelerisque ac adipiscing velit non nulla in amet pellentesque.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  Sit bibendum donec dolor fames neque vulputate non sit aliquam. Consequat turpis natoque leo, massa nibh. Neque ultrices odio amet consequat.
                </p>
              </div>
              
              {/* Related books (placeholder) */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">You might also like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-neutral-50 rounded-lg p-4 hover:bg-neutral-100 transition-colors">
                      <h4 className="font-medium text-neutral-900 mb-1">Similar Book Title {i}</h4>
                      <p className="text-sm text-neutral-600 mb-2">Author Name</p>
                      <Link to={`/books/${i}`} className="text-xs font-medium text-primary-600">
                        View details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Checkout Modal */}
      <CheckOutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleCheckout}
        bookTitle={book?.title || ''}
      />
    </div>
  );
};

export default ModernBookDetail;
