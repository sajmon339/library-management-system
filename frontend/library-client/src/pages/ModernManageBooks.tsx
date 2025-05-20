import { useState, useEffect, useRef } from 'react';
import { bookService } from '../api/bookService';
import { Genre } from '../types/book';
import type { Book, CreateBookDto, UpdateBookDto } from '../types/book';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle';

const ModernManageBooks = () => {
  const { t, i18n } = useTranslation();
  // Set the page title based on the current language
  usePageTitle(t('admin.manageBooks.title'));
  
  // Books state
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  
  // Form states
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Add form state
  const [newBook, setNewBook] = useState<CreateBookDto>({
    title: '',
    author: '',
    publishedYear: new Date().getFullYear(),
    publisher: '',
    genre: Genre.Fiction,
    totalCopies: 1
  });
  
  // Edit form state
  const [editBook, setEditBook] = useState<UpdateBookDto>({
    title: '',
    author: '',
    publishedYear: 0,
    publisher: '',
    genre: Genre.Fiction
  });
  
  // File upload state
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch all books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);
  
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(t('common.failedToLoad'));
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormErrors([]);
      
      // Validate form
      const errors = validateBookForm(newBook);
      if (errors.length > 0) {
        setFormErrors(errors);
        return;
      }
      
      // Create the book
      const createdBook = await bookService.createBook(newBook);
      
      // Upload cover image if selected
      if (coverImage && createdBook.id) {
        await uploadCoverImage(createdBook.id, coverImage);
      }
      
      // Refresh book list
      await fetchBooks();
      
      // Reset form
      setNewBook({
        title: '',
        author: '',
        publishedYear: new Date().getFullYear(),
        publisher: '',
        genre: Genre.Fiction,
        totalCopies: 1
      });
      setCoverImage(null);
      setImagePreview(null);
      setIsAddFormVisible(false);
      
    } catch (err) {
      setFormErrors([t('admin.manageBooks.failedToAdd')]);
      console.error('Error adding book:', err);
    }
  };
  
  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBookId) return;
    
    try {
      setFormErrors([]);
      
      // Validate form
      const errors = validateBookForm(editBook);
      if (errors.length > 0) {
        setFormErrors(errors);
        return;
      }
      
      // Update the book
      await bookService.updateBook(selectedBookId, editBook);
      
      // Upload cover image if selected
      if (coverImage) {
        await uploadCoverImage(selectedBookId, coverImage);
      }
      
      // Refresh book list
      await fetchBooks();
      
      // Reset form and state
      setSelectedBookId(null);
      setEditBook({
        title: '',
        author: '',
        publishedYear: 0,
        publisher: '',
        genre: Genre.Fiction
      });
      setCoverImage(null);
      setImagePreview(null);
      setIsEditFormVisible(false);
      
    } catch (err) {
      setFormErrors([t('admin.manageBooks.failedToUpdate')]);
      console.error('Error updating book:', err);
    }
  };
  
  const handleDeleteBook = async (id: number) => {
    if (window.confirm(t('admin.manageBooks.confirmDelete'))) {
      try {
        await bookService.deleteBook(id);
        await fetchBooks();
      } catch (err) {
        setError(t('admin.manageBooks.failedToDelete'));
        console.error('Error deleting book:', err);
      }
    }
  };
  
  const handleEditClick = (book: Book) => {
    setSelectedBookId(book.id);
    setEditBook({
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
      publisher: book.publisher,
      genre: book.genre
    });
    setIsEditFormVisible(true);
    setImagePreview(bookService.getBookCover(book.id)); // Set image preview using the book service
  };
  
  const uploadCoverImage = async (bookId: number, file: File) => {
    try {
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('coverImage', file);
      
      await bookService.uploadCoverImage(bookId, formData, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 2000);
      
    } catch (err) {
      console.error('Error uploading cover image:', err);
      throw err;
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setCoverImage(null);
      setImagePreview(null);
      return;
    }
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setFormErrors([t('admin.manageBooks.imageTypeWarning')]);
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors([t('admin.manageBooks.imageSizeWarning')]);
      return;
    }
    
    setCoverImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setCoverImage(null);
    setImagePreview(null);
  };
  
  const validateBookForm = (book: CreateBookDto | UpdateBookDto) => {
    const errors: string[] = [];
    
    if (!book.title.trim()) errors.push(t('admin.manageBooks.validation.titleRequired'));
    if (!book.author.trim()) errors.push(t('admin.manageBooks.validation.authorRequired'));
    if (!book.publisher.trim()) errors.push(t('admin.manageBooks.validation.publisherRequired'));
    
    const currentYear = new Date().getFullYear();
    if (book.publishedYear < 1000 || book.publishedYear > currentYear) {
      errors.push(t('admin.manageBooks.yearValidation', { currentYear }));
    }
    
    if ('totalCopies' in book && book.totalCopies < 1) {
      errors.push(t('admin.manageBooks.validation.copiesMinimum'));
    }
    
    return errors;
  };
  
  const renderAddBookForm = () => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">{t('admin.manageBooks.addBook')}</h2>
      
      {formErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <ul className="list-disc list-inside">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleAddBook} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.bookTitle')} *
            </label>
            <input
              type="text"
              id="title"
              value={newBook.title}
              onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.author')} *
            </label>
            <input
              type="text"
              id="author"
              value={newBook.author}
              onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="publishedYear" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.publishedYear')} *
            </label>
            <input
              type="number"
              id="publishedYear"
              value={newBook.publishedYear}
              onChange={(e) => setNewBook({...newBook, publishedYear: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              min="1000"
              max={new Date().getFullYear()}
              required
            />
          </div>
          
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.publisher')} *
            </label>
            <input
              type="text"
              id="publisher"
              value={newBook.publisher}
              onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.genre')} *
            </label>
            <select
              id="genre"
              value={newBook.genre}
              onChange={(e) => setNewBook({...newBook, genre: e.target.value as Genre})}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {Object.values(Genre).map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="totalCopies" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.copies')} *
            </label>
            <input
              type="number"
              id="totalCopies"
              value={newBook.totalCopies}
              onChange={(e) => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              min="1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="catalogNumber" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.catalogNumber')}
            </label>
            <input
              type="text"
              id="catalogNumber"
              value={newBook.catalogNumber || ''}
              onChange={(e) => setNewBook({...newBook, catalogNumber: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder={t('admin.manageBooks.catalogNumberPlaceholder')}
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="coverImage" className="block text-sm font-medium text-neutral-700 mb-1">
              {t('admin.manageBooks.coverImage')}
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="coverImage"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('admin.manageBooks.chooseImage')}
                </button>
                {coverImage && (
                  <button
                    type="button"
                    onClick={resetFileInput}
                    className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {t('common.clear')}
                  </button>
                )}
              </div>
              {coverImage && (
                <span className="ml-2 text-sm text-neutral-500">
                  {coverImage.name} ({Math.round(coverImage.size / 1024)} KB)
                </span>
              )}
            </div>
            
            {imagePreview && (
              <div className="mt-3">
                <div className="w-32 h-48 border rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt={t('admin.manageBooks.coverImage')} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            {uploadProgress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {t('admin.manageBooks.uploading')}: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsAddFormVisible(false);
              setFormErrors([]);
              resetFileInput();
            }}
            className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('admin.manageBooks.addBook')}
          </button>
        </div>
      </form>
    </div>
  );
   const renderEditBookForm = () => {
    if (!selectedBookId) return null;
    
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">{t('admin.manageBooks.editBook')}</h2>
        
        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <ul className="list-disc list-inside">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleEditBook} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('admin.manageBooks.bookTitle')} *
              </label>
              <input
                type="text"
                id="edit-title"
                value={editBook.title}
                onChange={(e) => setEditBook({...editBook, title: e.target.value})}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-author" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('admin.manageBooks.author')} *
              </label>
              <input
                type="text"
                id="edit-author"
                value={editBook.author}
                onChange={(e) => setEditBook({...editBook, author: e.target.value})}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-publishedYear" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('admin.manageBooks.publishedYear')} *
              </label>
              <input
                type="number"
                id="edit-publishedYear"
                value={editBook.publishedYear}
                onChange={(e) => setEditBook({...editBook, publishedYear: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                min="1000"
                max={new Date().getFullYear()}
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-publisher" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('admin.manageBooks.publisher')} *
              </label>
              <input
                type="text"
                id="edit-publisher"
                value={editBook.publisher}
                onChange={(e) => setEditBook({...editBook, publisher: e.target.value})}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-genre" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('admin.manageBooks.genre')} *
              </label>
              <select
                id="edit-genre"
                value={editBook.genre}
                onChange={(e) => setEditBook({...editBook, genre: e.target.value as Genre})}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              >
                {Object.values(Genre).map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="edit-coverImage" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('admin.manageBooks.coverImage')}
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="edit-coverImage"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {t('admin.manageBooks.chooseNewImage')}
                  </button>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={resetFileInput}
                      className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {t('common.clear')}
                    </button>
                  )}
                </div>
                {coverImage && (
                  <span className="ml-2 text-sm text-neutral-500">
                    {coverImage.name} ({Math.round(coverImage.size / 1024)} KB)
                  </span>
                )}
              </div>
              
              {imagePreview && (
                <div className="mt-3">
                  <div className="w-32 h-48 border rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt={t('admin.manageBooks.coverImage')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {t('admin.manageBooks.uploading')}: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsEditFormVisible(false);
                setFormErrors([]);
                setSelectedBookId(null);
                resetFileInput();
              }}
              className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('common.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  return (
    <div className="auto-theme-bg min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-8 flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              {t('admin.manageBooks.title')}
            </h1>
            <p className="text-neutral-600">
              {t('admin.manageBooks.subtitle')}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => {
                setIsAddFormVisible(!isAddFormVisible);
                setIsEditFormVisible(false);
                setFormErrors([]);
                resetFileInput();
              }}
              className="btn btn-primary flex items-center"
            >
              {isAddFormVisible ? (
                <>
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  {t('common.cancel')}
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  {t('admin.manageBooks.addBook')}
                </>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        {isAddFormVisible && renderAddBookForm()}
        {isEditFormVisible && renderEditBookForm()}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-100 dark:bg-burrito-dark-surface">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('common.cover')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageBooks.bookTitle')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageBooks.author')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('books.publishedYear')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('admin.manageBooks.genre')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('books.copies')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-burrito-gray uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </td>
                  </tr>
                ) : books.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                      {t('admin.manageBooks.noBooksFound')}
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-neutral-50 dark:hover:bg-burrito-dark-surface">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-12 rounded overflow-hidden bg-neutral-100 flex items-center justify-center">
                          <img 
                            src={bookService.getBookCover(book.id)} 
                            alt={book.title}
                            onError={(e) => {
                              // Display placeholder icon if image fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.currentTarget.parentNode as HTMLElement).innerHTML = 
                                `<div class="flex items-center justify-center h-full w-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-neutral-400">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>`;
                            }}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-neutral-900">{book.title}</div>
                        <div className="text-sm text-neutral-500">{book.catalogNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-800">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-800">
                        {book.publishedYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {book.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-neutral-900">{book.availableCopies} / {book.totalCopies}</div>
                        <div className="text-xs text-neutral-500">{t('admin.manageBooks.available')} / {t('admin.manageBooks.total')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(book)}
                            className="text-primary-600 hover:text-primary-900 p-1"
                            title={t('common.edit')}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title={t('common.delete')}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernManageBooks;
