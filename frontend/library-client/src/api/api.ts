import axios from 'axios';

// Use a relative URL which will work with the Nginx proxy
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    console.log('API: Intercepting request', { 
      url: config.url, 
      method: config.method,
      hasAuthHeader: !!config.headers.Authorization
    });
    
    // Only add the token if not already present in the headers
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API: Added token to request headers');
      } else {
        console.log('No token found in localStorage');
      }
    } else {
      console.log('API: Authorization header already present');
    }
    
    return config;
  },
  (error) => {
    console.error('API: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('API: Successful response from', {
      url: response.config.url,
      status: response.status,
      hasAuthHeader: response.status === 200 && response.config.url?.includes('/auth/login') ? 
        'Login request succeeded' : undefined
    });
    return response;
  },
  async (error) => {
    console.error('API: Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data || error.message
    });
    
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('API: Authentication error encountered');
      originalRequest._retry = true;
      
      // Attempt to get a fresh token from localStorage
      // This can help if the token was updated in another tab
      const freshToken = localStorage.getItem('token');
      if (freshToken && freshToken !== originalRequest.headers?.Authorization?.replace('Bearer ', '')) {
        console.log('API: Found a different token in localStorage, retrying with new token');
        originalRequest.headers.Authorization = `Bearer ${freshToken}`;
        return axios(originalRequest);
      }
      
      // If the user is on an admin page, don't automatically redirect to login
      // This allows the admin route component to handle the redirection more gracefully
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/admin')) {
        console.log('API: Not on admin route, clearing token and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        console.log('API: On admin route, not redirecting automatically');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
