import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import type { LoginDto } from '../types/user.js';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle.js';
import DeviceInfo from '../components/DeviceInfo.js';

const ModernLogin = () => {
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Set page title
  usePageTitle(t('login.title'));
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    console.log('Login attempt with:', { 
      email: formData.email,
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    });
    
    try {
      // Validate form data
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      
      if (!formData.password) {
        throw new Error('Password is required');
      }
      
      console.log('Calling login function...');
      await login(formData);
      console.log('Login successful, navigating to home page');
      navigate('/');
    } catch (err: any) {
      console.error('Login error details:', err);
      
      // Display detailed error info for debugging
      console.error('Error breakdown:', {
        message: err.message,
        responseStatus: err.response?.status,
        responseData: err.response?.data,
        isAxiosError: err.isAxiosError,
        stack: err.stack
      });
      
      // Enhanced error handling to extract message from different error formats
      if (err.response?.data?.message) {
        // Extract message directly from API response
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status >= 500) {
        setError(`Server error (${err.response.status}): The server is experiencing issues. Please try again later.`);
      } else if (err.response?.data) {
        // Handle various response data formats
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (typeof err.response.data === 'object') {
          setError(err.response.data.message || JSON.stringify(err.response.data));
        } else {
          setError('Authentication failed. Please try again.');
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen auto-theme-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <DeviceInfo />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-3xl font-heading font-bold text-primary-700 mb-8">
            <img src="/burrito_icon_plain.png" alt="Universidad de WSBurrito Logo" className="h-10 w-10 mr-2 rounded-full object-cover" />
            <span>Universidad de WSBurrito</span>
          </Link>
          <h2 className="text-3xl font-heading font-bold text-neutral-900 dark:text-burrito-beige">
            {t('login.welcome')}
          </h2>
          <p className="mt-2 auto-theme-text">
            {t('login.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-burrito-brown dark:text-burrito-cheese">
            {t('login.title')}
          </h1>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card px-6 py-8 sm:px-10">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {typeof error === 'string' ? error : t('login.invalidCredentials')}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t('login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-800 bg-white shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition duration-150 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500"
                placeholder={t('login.email')}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('login.password')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-800 bg-white shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition duration-150 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500"
                placeholder={t('login.password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 px-4 text-base focus:outline-none focus:ring-4 focus:ring-primary-400/50 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('login.signingIn')}
                  </div>
                ) : (
                  t('login.loginButton')
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">{t('auth.or')}</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-base text-neutral-600">
                {t('login.newUser')}{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {t('login.createAccount')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;
