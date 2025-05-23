import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/userService';
import type { ChangePasswordDto } from '../types/user';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../utils/usePageTitle.js';

const ModernChangePassword = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ChangePasswordDto>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  // Set page title
  usePageTitle(t('changePassword.title'));
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    // Validate form
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError(t('changePassword.passwordsMismatch'));
      setLoading(false);
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError(t('changePassword.passwordRequirements'));
      setLoading(false);
      return;
    }
    
    try {
      await userService.changePassword(formData);
      
      setSuccess(t('changePassword.successMessage'));
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error changing password:', err);
      
      if (err.response?.status === 400) {
        setError('Current password is incorrect.');
      } else if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError(t('errors.serverError'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auto-theme-bg min-h-screen pt-24 pb-16">
      <div className="container-custom max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-burrito-beige mb-2">
            {t('changePassword.title')}
          </h1>
          <p className="auto-theme-text">
            {t('profile.personalInfo')}
          </p>
        </div>
        
        <div className="card p-6 md:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('changePassword.currentPassword')}
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('changePassword.newPassword')}
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-neutral-500">
                {t('changePassword.passwordRequirements')}
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('changePassword.confirmNewPassword')}
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                required
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400"
              >
                {loading ? t('common.loading') : t('changePassword.updatePassword')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModernChangePassword;
