import api from './api';
import { CheckOut, CreateCheckOutDto, UpdateCheckOutStatusDto } from '../types/checkOut.js';

const getAllCheckOuts = async () => {
  const response = await api.get<CheckOut[]>('CheckOuts');
  return response.data;
};

const getActiveCheckOuts = async () => {
  const response = await api.get<CheckOut[]>('CheckOuts/active');
  return response.data;
};

const getOverdueCheckOuts = async () => {
  const response = await api.get<CheckOut[]>('CheckOuts/overdue');
  return response.data;
};

const getUserCheckOuts = async (userId?: number) => {
  // If userId is provided, use it; otherwise, the current user's ID will be extracted from the JWT on the server
  const endpoint = userId ? `CheckOuts/user/${userId}` : `CheckOuts/user/0`;
  const response = await api.get<CheckOut[]>(endpoint);
  return response.data;
};

const getCheckOutById = async (id: number) => {
  const response = await api.get<CheckOut>(`CheckOuts/${id}`);
  return response.data;
};

const createCheckOut = async (bookId: number, daysToReturn: number = 14) => {
  // Creating a proper CreateCheckOutDto object with the current user's info
  const checkoutData: CreateCheckOutDto = {
    bookId: bookId,
    userId: 0, // The backend will extract the user ID from the JWT token
    daysToReturn: daysToReturn
  };

  try {
    console.log('Sending checkout request:', checkoutData);
    // Since the baseURL already includes '/api' prefix and the controller uses [controller],
    // we need to match the casing exactly - remove the leading slash as it's part of baseURL
    const response = await api.post<CheckOut>('CheckOuts', checkoutData);
    console.log('Checkout successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Checkout failed:', error);
    throw error;
  }
};

const returnBook = async (id: number) => {
  const response = await api.post<CheckOut>(`CheckOuts/${id}/return`);
  return response.data;
};

const renewCheckOut = async (id: number) => {
  const response = await api.post<CheckOut>(`CheckOuts/${id}/renew`);
  return response.data;
};

export const checkOutService = {
  getAllCheckOuts,
  getActiveCheckOuts,
  getOverdueCheckOuts,
  getUserCheckOuts,
  getCheckOutById,
  createCheckOut,
  returnBook,
  renewCheckOut
};
