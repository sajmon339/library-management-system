import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import ModernNavbar from './components/ModernNavbar.js';
import ThemeToast from './components/ThemeToast.js';
import DarkModeEnforcer from './components/DarkModeEnforcer.js';
import ModernLogin from './pages/ModernLogin.js';
import ModernHome from './pages/ModernHome.js';
import ModernBooks from './pages/ModernBooks.js';
import ModernRegister from './pages/ModernRegister.js';
import ModernProfile from './pages/ModernProfile.js';
import ModernMyBooks from './pages/ModernMyBooks.js';
import ModernBookDetail from './pages/ModernBookDetail.js';
import ModernAdminDashboard from './pages/ModernAdminDashboard.js';
import ModernManageBooks from './pages/ModernManageBooks.js';
import ModernManageUsers from './pages/ModernManageUsers.js';
import ModernManageCheckouts from './pages/ModernManageCheckouts.js';
import ModernChangePassword from './pages/ModernChangePassword.js';
import ModernEditProfile from './pages/ModernEditProfile.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import AdminRoute from './components/AdminRoute.js';
import { useAppTitle } from './utils/usePageTitle';
import { useTranslation } from 'react-i18next';

// Placeholder pages that haven't been modernized yet
const ForgotPassword = () => <div className="container-custom pt-24 pb-16"><h1 className="text-2xl font-bold mb-4 dark:text-burrito-beige">Forgot Password</h1><p className="auto-theme-text">This page is under construction.</p></div>;
const ResetPassword = () => <div className="container-custom pt-24 pb-16"><h1 className="text-2xl font-bold mb-4 dark:text-burrito-beige">Reset Password</h1><p className="auto-theme-text">This page is under construction.</p></div>;

function App() {
  // Set the app title based on current language
  useAppTitle();
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen auto-theme-bg auto-theme-text">
            <ModernNavbar />
            <ThemeToast />
            <DarkModeEnforcer />
            <main className="flex-grow auto-theme-bg">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<ModernHome />} />
                <Route path="/books" element={<ModernBooks />} />
                <Route path="/books/:id" element={<ModernBookDetail />} />
                <Route path="/login" element={<ModernLogin />} />
                <Route path="/register" element={<ModernRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected routes (require login) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ModernProfile />} />
                  <Route path="/edit-profile" element={<ModernEditProfile />} />
                  <Route path="/my-books" element={<ModernMyBooks />} />
                  <Route path="/change-password" element={<ModernChangePassword />} />
                </Route>
                
                {/* Admin routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<ModernAdminDashboard />} />
                  <Route path="/admin/books" element={<ModernManageBooks />} />
                  <Route path="/admin/users" element={<ModernManageUsers />} />
                  <Route path="/admin/checkouts" element={<ModernManageCheckouts />} />
                </Route>
              </Routes>
            </main>
            <footer className="bg-gray-800 dark:bg-burrito-dark-surface text-white p-4 text-center border-t dark:border-burrito-dark-border">
              <div className="container-custom">
                <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
              </div>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
