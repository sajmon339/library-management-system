import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const Home = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
            alt="Library"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Library Management System
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Discover, borrow, and manage your library experience with our comprehensive
            library management system.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/books"
              className="rounded-md bg-indigo-600 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Browse Books
            </Link>
            
            {!isAuthenticated && (
              <Link
                to="/register"
                className="rounded-md bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Register Now
              </Link>
            )}
            
            {isAuthenticated && !isAdmin && (
              <Link
                to="/my-books"
                className="rounded-md bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                My Books
              </Link>
            )}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-md bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
              Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage a library
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our comprehensive library management system provides tools for librarians 
              and patrons to streamline book borrowing and returns.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      Extensive Book Catalog
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Browse through our extensive collection of books with detailed information
                      including author, genre, and availability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      Seamless Check-out Process
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Check out books easily with our streamlined process, manage your lending periods
                      and get reminders when books are due.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      Admin Management Tools
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Advanced tools for librarians to manage inventory, track checkouts
                      and analyze library usage patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-700">
        <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to explore our collection?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join our library today and get access to thousands of books.
          </p>
          <Link
            to={isAuthenticated ? "/books" : "/register"}
            className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 sm:w-auto"
          >
            {isAuthenticated ? "Browse Books" : "Register Now"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
