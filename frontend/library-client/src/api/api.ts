import axios from 'axios';

// Use a relative URL which will work with the Nginx proxy
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check if a token was issued for a previous deployment
const isTokenFromPreviousDeployment = (token: string): boolean => {
  try {
    // Parse the JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    // Store the current deployment ID in sessionStorage 
    // This ensures it's unique per browser tab and session
    let currentDeployId = sessionStorage.getItem('current_deployment_id');
    
    // If this is our first request and we don't have a deployment ID yet
    if (!currentDeployId && payload.deployment_id) {
      // Store the token's deployment ID as the current one
      sessionStorage.setItem('current_deployment_id', payload.deployment_id);
      return false;
    }
    
    // If we have both IDs but they don't match, the application has been redeployed
    if (currentDeployId && payload.deployment_id && currentDeployId !== payload.deployment_id) {
      console.log(`API: Token is from a previous deployment. Current: ${currentDeployId}, Token: ${payload.deployment_id}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token deployment ID:', error);
    return false; // Don't invalidate if we can't check
  }
};

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
        // Check if the token is from a previous deployment
        if (isTokenFromPreviousDeployment(token)) {
          // Clear auth data if the app has been redeployed
          console.log('API: Clearing stale auth data after redeployment');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if not already on the login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?redeployed=true';
          }
          return config;
        }
        
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
      
      // Check if token is expired
      const token = localStorage.getItem('token');
      if (token) {
        // Import the isTokenExpired function
        try {
          const isExpired = (function checkTokenExpiration(token: string) {
            try {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              
              const { exp } = JSON.parse(jsonPayload);
              const expired = Date.now() >= exp * 1000;
              console.log(`Token expiration check: expires at ${new Date(exp * 1000).toLocaleString()}, expired: ${expired}`);
              return expired;
            } catch (error) {
              return true; // If we can't validate the token, consider it expired
            }
          })(token);
          
          if (isExpired) {
            console.log('API: Token is expired, logging out');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login?expired=true';
            return Promise.reject(error);
          }
        } catch (e) {
          console.error('Error checking token expiration', e);
        }
      }
      
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
