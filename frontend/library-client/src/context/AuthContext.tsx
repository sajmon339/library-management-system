import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginDto, UpdateProfileDto } from '../types/user.js';
import { userService } from '../api/userService.js';
import type { AuthResponse } from '../api/userService.js';
import api from '../api/api.js';
import { APP_VERSION, SESSION_VERSION_KEY, isSessionValid, updateSessionVersion } from '../utils/version.js';

// Helper function to check if a JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const { exp } = JSON.parse(jsonPayload);
    const expired = Date.now() >= exp * 1000;
    console.log(`Token expiration check: expires at ${new Date(exp * 1000).toLocaleString()}, expired: ${expired}`);
    return expired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't validate the token, consider it expired
  }
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: UpdateProfileDto) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Add periodic token validation
  useEffect(() => {
    // Only run validation if we have a token
    if (!token) return;
    
    // Check token validity every 5 minutes
    const validateInterval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        console.log('AuthContext: Token expired during active session, logging out');
        // Clear state and storage
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      }
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(validateInterval);
    };
  }, [token]);
  
  useEffect(() => {
    // Check if the user is already logged in (from localStorage)
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('AuthContext: Initializing with stored data', {
      hasToken: !!storedToken,
      hasUser: !!storedUser
    });
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Check if token is expired OR if app version has changed
        if (isTokenExpired(storedToken) || !isSessionValid()) {
          console.log('AuthContext: Session invalid - token expired or app version changed');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        } else {
          setToken(storedToken);
          setUser(parsedUser);
          
          // Set the token in api headers
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          console.log('AuthContext: Restored auth state from localStorage', {
            userId: parsedUser.id,
            userName: parsedUser.userName,
            role: parsedUser.role
          });
        }
      } catch (error) {
        console.error('AuthContext: Error parsing stored user:', error);
        // If error in parsing, clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, []);
  
  const login = async (credentials: LoginDto) => {
    try {
      console.log('AuthContext: Attempting login with email:', credentials.email);
      console.log('AuthContext: Device info:', {
        userAgent: navigator.userAgent,
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        isOnline: navigator.onLine
      });
      
      const response: AuthResponse = await userService.loginUser(credentials);
      console.log('AuthContext: Login response received:', { token: response.token ? 'Token received' : 'No token', userReceived: !!response.user });
      
      const { token, user } = response;
      
      if (!token || !user) {
        console.error('AuthContext: Missing token or user in response', { tokenExists: !!token, userExists: !!user });
        throw new Error('Invalid response from server: missing token or user data');
      }
      
      console.log('AuthContext: Setting auth state with user:', { id: user.id, userName: user.userName, role: user.role });
      
      // Store in state
      setToken(token);
      setUser(user);
      
      // Clear any previous storage first to prevent conflicts
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Then store in localStorage with a small delay to ensure proper write
      // This can help with mobile browser issues
      setTimeout(() => {
        try {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Store the current app version to validate the session in future
          updateSessionVersion();
          
          console.log('AuthContext: Data successfully stored in localStorage');
        } catch (storageError) {
          console.error('AuthContext: Error storing data in localStorage:', storageError);
          // Continue even if localStorage fails - we still have the data in memory
        }
      }, 100);
      
      // Update Authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('AuthContext: Login complete, data stored and API header updated');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      
      // Clear any partial state
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      throw error;
    }
  };
  
  const logout = () => {
    console.log('AuthContext: Logging out user');
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(SESSION_VERSION_KEY);
    
    // Clear Authorization header
    delete api.defaults.headers.common['Authorization'];
    
    console.log('AuthContext: User logged out, auth state cleared');
  };
  
  const updateUserProfile = async (profileData: UpdateProfileDto) => {
    try {
      console.log('AuthContext: Updating user profile:', profileData);
      const response = await userService.updateProfile(profileData);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      // Update state
      setToken(response.token);
      setUser(response.user);
      
      // Update localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update API header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      console.log('AuthContext: Profile updated successfully');
    } catch (error) {
      console.error('AuthContext: Profile update error:', error);
      throw error;
    }
  };
  
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      isAdmin, 
      login, 
      logout,
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
