export enum UserRole {
  Customer = 'Customer',
  Admin = 'Admin'
}

export interface User {
  id: number;
  userName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateUserRoleDto {
  role: UserRole;
}

export interface UpdateProfileDto {
  userName: string;
  email: string;
}
