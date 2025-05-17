import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Book, Genre } from '../types/book.js';
import { bookService } from '../api/bookService.js';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ModernBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get book data
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getBooks();
        setBooks(data);
        setFilteredBooks(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle URL search params
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) {
      setSelectedGenre(genreParam);
    }
  }, [searchParams]);

  // Filter books when search or genre filters change
  useEffect(() => {
    let result = [...books];
    
    // Apply genre filter
    if (selectedGenre) {
      result = result.filter(book => 
        book.genre.replace(/([A-Z])/g, ' $1').trim() === selectedGenre || // Convert camelCase to normal text
        book.genre === selectedGenre
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
      );
    }
    
    setFilteredBooks(result);
  }, [books, searchQuery, selectedGenre]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle genre selection
  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
    
    if (genre) {
      searchParams.set('genre', genre);
      setSearchParams(searchParams);
    } else {
      searchParams.delete('genre');
      setSearchParams(searchParams);
    }
  };

  // List of genres for filtering
  const genreList = Object.values(Genre).map(genre => 
    typeof genre === 'string' ? genre.replace(/([A-Z])/g, ' $1').trim() : genre
  );

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              Book Catalog
            </h1>
            <p className="text-neutral-600 max-w-2xl">
              Browse our collection of books across various genres
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn bg-white text-neutral-700 border border-neutral-200 shadow-sm hover:bg-neutral-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
              {selectedGenre && (
                <span className="ml-1 text-xs bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full">
                  1
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title or author..."
              className="block w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-neutral-900">Filters</h3>
                {selectedGenre && (
                  <button 
                    onClick={() => handleGenreSelect(null)}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    Clear filters
                    <XMarkIcon className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Genre</h4>
                <div className="flex flex-wrap gap-2">
                  {genreList.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreSelect(genre)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        selectedGenre === genre
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Book grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft p-12 text-center">
            <h3 className="text-xl font-medium text-neutral-800 mb-2">No books found</h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery || selectedGenre 
                ? "Try adjusting your filters or search terms." 
                : "Our catalog appears to be empty at the moment."}
            </p>
            {(searchQuery || selectedGenre) && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  handleGenreSelect(null);
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} to={`/books/${book.id}`} className="group">
                <div className="card h-full hover:shadow-lg overflow-hidden transition-all">
                  {/* Fake book cover using a gradient based on the book's genre */}
                  <div className="h-64 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center p-6">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                      <p className="opacity-80">by {book.author}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
                          {book.genre.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-neutral-600 text-sm">by {book.author}</p>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        book.availableCopies > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-neutral-500">
                        {book.publishedYear}
                      </div>
                      {isAuthenticated && book.availableCopies > 0 && (
                        <button className="text-xs font-medium text-primary-700 hover:text-primary-800 py-1 px-2 bg-primary-50 hover:bg-primary-100 rounded transition-colors">
                          Check Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernBooks;
