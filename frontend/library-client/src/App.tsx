import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import ModernNavbar from './components/ModernNavbar.js';
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

// Placeholder pages that haven't been modernized yet
const ForgotPassword = () => <div className="container-custom pt-24 pb-16"><h1 className="text-2xl font-bold mb-4">Forgot Password</h1><p className="text-neutral-600">This page is under construction.</p></div>;
const ResetPassword = () => <div className="container-custom pt-24 pb-16"><h1 className="text-2xl font-bold mb-4">Reset Password</h1><p className="text-neutral-600">This page is under construction.</p></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <ModernNavbar />
          <main className="flex-grow">
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
          <footer className="bg-gray-800 text-white p-4 text-center">
            <div className="container-custom">
              <p>&copy; {new Date().getFullYear()} LibraryHub Management System</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
