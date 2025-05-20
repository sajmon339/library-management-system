import api from './api.js';
import type { Book, CreateBookDto, UpdateBookDto, UpdateBookQuantityDto } from '../types/book.js';

const getAllBooks = async () => {
  const response = await api.get<Book[]>('/books');
  return response.data;
};

const searchBooks = async (searchTerm: string) => {
  const response = await api.get<Book[]>(`/books?search=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

const filterBooks = async (
  author?: string,
  year?: number,
  publisher?: string,
  genre?: string
) => {
  let url = '/books?';
  if (author) url += `author=${encodeURIComponent(author)}&`;
  if (year) url += `year=${year}&`;
  if (publisher) url += `publisher=${encodeURIComponent(publisher)}&`;
  if (genre) url += `genre=${genre}&`;
  
  const response = await api.get<Book[]>(url);
  return response.data;
};

const getBookById = async (id: number) => {
  try {
    console.log('bookService: Fetching book with id:', id);
    const response = await api.get<Book>(`/books/${id}`);
    console.log('bookService: Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('bookService: Error fetching book:', error);
    throw error; // Re-throw to allow component-level error handling
  }
};

const getBookByCatalogNumber = async (catalogNumber: string) => {
  const response = await api.get<Book>(`/books/catalog/${catalogNumber}`);
  return response.data;
};

const createBook = async (book: CreateBookDto) => {
  const response = await api.post<Book>('/books', book);
  return response.data;
};

const updateBook = async (id: number, book: UpdateBookDto) => {
  const response = await api.put<Book>(`/books/${id}`, book);
  return response.data;
};

const updateBookQuantity = async (id: number, quantity: number) => {
  const dto: UpdateBookQuantityDto = { quantity };
  const response = await api.patch<void>(`/books/${id}/quantity`, dto);
  return response.data;
};

const deleteBook = async (id: number) => {
  await api.delete(`/books/${id}`);
};

// Upload a book cover image
const uploadCoverImage = async (bookId: number, formData: FormData, onUploadProgress?: (percentage: number) => void) => {
  const response = await api.post(`/books/${bookId}/cover`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onUploadProgress 
      ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          onUploadProgress(percentCompleted);
        }
      : undefined
  });
  return response.data;
};

// Get a book cover image
const getBookCover = (bookId: number) => {
  return `${api.defaults.baseURL}/books/${bookId}/cover`;
};

// Add getBooks as an alias to getAllBooks for compatibility with existing code
const getBooks = getAllBooks;

export const bookService = {
  getAllBooks,
  getBooks,
  searchBooks,
  filterBooks,
  getBookById,
  getBookByCatalogNumber,
  createBook,
  updateBook,
  updateBookQuantity,
  deleteBook,
  uploadCoverImage,
  getBookCover
};
