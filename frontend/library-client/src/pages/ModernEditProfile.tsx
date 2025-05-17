import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon } from '@heroicons/react/24/outline';

interface ProfileFormData {
  userName: string;
  email: string;
}

const ModernEditProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    userName: '',
    email: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName,
        email: user.email
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      // Call the auth context to update the profile
      await updateUserProfile({
        userName: formData.userName,
        email: formData.email
      });
      
      setSuccess('Profile updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="text-xl text-neutral-600">Please log in to edit your profile.</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="container-custom max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-neutral-600">
            Update your account information
          </p>
        </div>
        
        <div className="card p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-semibold shadow-sm">
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-5">
              <h2 className="text-xl font-semibold text-neutral-900">
                {user.userName}
              </h2>
              <p className="text-neutral-600">
                {user.role} Account
              </p>
            </div>
          </div>
          
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
              <label htmlFor="userName" className="block text-sm font-medium text-neutral-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                required
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 italic mb-2">
                Note: To change your password, please use the Change Password page.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModernEditProfile;
