import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { BookOpenIcon, ClockIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const ModernHome = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Mock featured books data
  const featuredBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=700",
      genre: "Fiction"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=700",
      genre: "Self-Help"
    },
    {
      id: 3,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=700",
      genre: "Finance"
    },
    {
      id: 4,
      title: "Project Hail Mary",
      author: "Andy Weir",
      coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=700",
      genre: "Science Fiction"
    },
  ];

  // Genre pills for quick access
  const genres = [
    "Fiction", "Non-Fiction", "Mystery", "Science Fiction", 
    "Fantasy", "Biography", "Self-Help", "History", 
    "Romance", "Thriller", "Science", "Philosophy"
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero section with a modern, full-width design */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/80 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2000&auto=format&fit=crop"
            alt="Modern Library"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container-custom relative z-20 mt-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Discover Your Next <span className="text-accent-400">Great Read</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Browse thousands of books, manage your personal library, and discover new authors and genres all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/books"
                className="btn btn-primary group"
              >
                Browse Collection
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn btn-secondary"
                >
                  Join Library
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats section */}
      <section className="py-10 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center p-6 rounded-xl bg-neutral-50 shadow-soft">
              <BookOpenIcon className="w-12 h-12 text-primary-600 mr-4" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">10,000+</div>
                <div className="text-neutral-600">Books Available</div>
              </div>
            </div>
            
            <div className="flex items-center p-6 rounded-xl bg-neutral-50 shadow-soft">
              <UserGroupIcon className="w-12 h-12 text-primary-600 mr-4" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">2,500+</div>
                <div className="text-neutral-600">Active Members</div>
              </div>
            </div>
            
            <div className="flex items-center p-6 rounded-xl bg-neutral-50 shadow-soft">
              <ClockIcon className="w-12 h-12 text-primary-600 mr-4" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">24/7</div>
                <div className="text-neutral-600">Digital Access</div>
              </div>
            </div>
            
            <div className="flex items-center p-6 rounded-xl bg-neutral-50 shadow-soft">
              <AcademicCapIcon className="w-12 h-12 text-primary-600 mr-4" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">50+</div>
                <div className="text-neutral-600">Genres</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick genre access */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">Browse by Genre</h2>
              <p className="text-neutral-600 max-w-2xl">Explore our vast collection by your favorite categories</p>
            </div>
            <Link to="/books" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              See all genres
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <Link 
                key={genre} 
                to={`/books?genre=${genre}`}
                className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow text-neutral-700 hover:text-primary-700 text-sm font-medium transition-all duration-200"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured books section with a modern card design */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">Featured Books</h2>
              <p className="text-neutral-600 max-w-2xl">Our librarians' top picks this month</p>
            </div>
            <Link to="/books" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View all books
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id} className="group">
                <div className="card h-full hover:shadow-lg overflow-hidden transition-all">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">{book.genre}</div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">{book.title}</h3>
                    <p className="text-neutral-600 text-sm">by {book.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights with modern design */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-neutral-600 text-lg">
              Our library management system provides powerful tools for both readers and librarians
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 hover:-translate-y-1 transition-all">
              <div className="rounded-full bg-primary-100 w-14 h-14 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Extensive Catalog
              </h3>
              <p className="text-neutral-600 mb-4">
                Browse through thousands of books with detailed information including summaries, author bios, and availability.
              </p>
              <Link to="/books" className="text-primary-600 font-medium text-sm inline-flex items-center hover:text-primary-700">
                Explore catalog
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
            
            <div className="card p-8 hover:-translate-y-1 transition-all">
              <div className="rounded-full bg-primary-100 w-14 h-14 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Easy Check-out Process
              </h3>
              <p className="text-neutral-600 mb-4">
                Check out books with a streamlined process, manage your lending periods, and receive due date reminders.
              </p>
              {isAuthenticated ? (
                <Link to="/my-books" className="text-primary-600 font-medium text-sm inline-flex items-center hover:text-primary-700">
                  Manage my books
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ) : (
                <Link to="/register" className="text-primary-600 font-medium text-sm inline-flex items-center hover:text-primary-700">
                  Sign up now
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              )}
            </div>
            
            <div className="card p-8 hover:-translate-y-1 transition-all">
              <div className="rounded-full bg-primary-100 w-14 h-14 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Admin Management
              </h3>
              <p className="text-neutral-600 mb-4">
                Powerful tools for librarians to manage inventory, track checkouts, add new books, and analyze library usage.
              </p>
              {isAdmin && (
                <Link to="/admin" className="text-primary-600 font-medium text-sm inline-flex items-center hover:text-primary-700">
                  Go to dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section with modern design */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 z-10" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" fill="none" viewBox="0 0 720 350" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0l720 350H0V0z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join our library today and get access to thousands of books, personalized recommendations, and a vibrant community of fellow readers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={isAuthenticated ? "/books" : "/register"}
                className="btn bg-white hover:bg-neutral-100 text-primary-700 px-8 py-3 text-base"
              >
                {isAuthenticated ? "Browse Collection" : "Sign Up for Free"}
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="btn border border-white/20 text-white hover:bg-white/10 px-8 py-3 text-base"
                >
                  Already a Member? Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;
