import api from './api';
import type { CheckOut, CreateCheckOutDto, UpdateCheckOutStatusDto } from '../types/checkOut.js';

const getAllCheckOuts = async () => {
  const response = await api.get<CheckOut[]>('/checkouts');
  return response.data;
};

const getActiveCheckOuts = async () => {
  const response = await api.get<CheckOut[]>('/checkouts/active');
  return response.data;
};

const getOverdueCheckOuts = async () => {
  const response = await api.get<CheckOut[]>('/checkouts/overdue');
  return response.data;
};

const getUserCheckOuts = async (userId?: number) => {
  // If userId is provided, use it; otherwise, the current user's ID will be extracted from the JWT on the server
  const endpoint = userId ? `/checkouts/user/${userId}` : `/checkouts/user/0`;
  const response = await api.get<CheckOut[]>(endpoint);
  return response.data;
};

const getCheckOutById = async (id: number) => {
  const response = await api.get<CheckOut>(`/checkouts/${id}`);
  return response.data;
};

const createCheckOut = async (bookId: number) => {
  const response = await api.post<CheckOut>('/checkouts', { bookId });
  return response.data;
};

const returnBook = async (id: number) => {
  const response = await api.post<CheckOut>(`/checkouts/${id}/return`);
  return response.data;
};

const renewCheckOut = async (id: number) => {
  const response = await api.post<CheckOut>(`/checkouts/${id}/renew`);
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
