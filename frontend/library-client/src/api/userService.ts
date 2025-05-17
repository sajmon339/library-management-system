import api from './api';
import type { User, RegisterUserDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, UpdateUserRoleDto, UpdateProfileDto } from '../types/user.js';

interface AuthResponse {
  token: string;
  user: User;
}

const loginUser = async (credentials: LoginDto) => {
  console.log('userService: Attempting login API call with credentials:', {
    email: credentials.email,
    passwordProvided: !!credentials.password
  });
  
  try {
    // Ensure the payload matches exactly what the backend expects
    const payload = {
      email: credentials.email,
      password: credentials.password
    };
    
    // Check for empty values
    if (!payload.email.trim() || !payload.password) {
      throw new Error('Email and password are required');
    }
    
    const response = await api.post<AuthResponse>('/auth/login', payload);
    
    if (!response.data || !response.data.token || !response.data.user) {
      console.error('userService: Invalid response structure from login endpoint', {
        hasData: !!response.data,
        hasToken: response.data ? !!response.data.token : false,
        hasUser: response.data ? !!response.data.user : false
      });
      throw new Error('Invalid response from server');
    }
    
    console.log('userService: Login API call successful, response:', {
      tokenReceived: !!response.data.token,
      userReceived: !!response.data.user,
      userData: response.data.user ? {
        id: response.data.user.id,
        userName: response.data.user.userName,
        role: response.data.user.role
      } : 'No user data'
    });
    
    return response.data;
  } catch (error: any) {
    console.error('userService: Login API call failed:', error);
    if (error.response?.status === 0) {
      throw new Error('Network error: Cannot connect to the server');
    }
    throw error;
  }
};

const registerUser = async (userData: RegisterUserDto) => {
  // Ensure payload matches exactly what the backend expects
  const payload = {
    email: userData.email,
    password: userData.password,
    confirmPassword: userData.confirmPassword
  };
  
  const response = await api.post<User>('/auth/register', payload);
  return response.data;
};

const forgotPassword = async (data: ForgotPasswordDto) => {
  const response = await api.post<{ message: string }>('/auth/forgot-password', data);
  return response.data;
};

const resetPassword = async (data: ResetPasswordDto) => {
  const response = await api.post<{ message: string }>('/auth/reset-password', data);
  return response.data;
};

const changePassword = async (data: ChangePasswordDto) => {
  const response = await api.post<{ message: string }>('/auth/change-password', data);
  return response.data;
};

// Admin functions
const getAllUsers = async () => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

const getUserById = async (id: number) => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

const createUser = async (userData: RegisterUserDto) => {
  const response = await api.post<User>('/users', userData);
  return response.data;
};

const updateUserRole = async (id: number, role: string) => {
  const data: UpdateUserRoleDto = { role: role as any }; // Type assertion to bypass type checking
  const response = await api.patch<void>(`/users/${id}/role`, data);
  return response.data;
};

const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};

const updateProfile = async (profileData: UpdateProfileDto) => {
  const response = await api.put<{ token: string, user: User, message: string }>('/auth/profile', profileData);
  return response.data;
};

export const userService = {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
  updateProfile
};

// For backward compatibility
export type { AuthResponse };
