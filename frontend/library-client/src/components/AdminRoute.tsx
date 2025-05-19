import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useEffect, useState } from 'react';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a short delay to ensure auth context has fully initialized
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Show nothing while loading to prevent flash of redirect
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    console.log('AdminRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('AdminRoute: User authenticated but not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute: Access granted to admin route for user:', user?.email);
  return <Outlet />;
};

export default AdminRoute;
