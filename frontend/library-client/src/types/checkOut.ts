export enum CheckOutStatus {
  Active = 'Active',
  Returned = 'Returned',
  Overdue = 'Overdue',
  Lost = 'Lost'
}

export interface CheckOut {
  id: number;
  bookId: number;
  bookTitle: string;
  catalogNumber: string;
  userId: number;
  userName: string;
  checkOutDate: string;
  dueDate: string;
  returnDate?: string;
  status: CheckOutStatus;
  notes?: string;
}

export interface CreateCheckOutDto {
  bookId: number;
  userId: number;
  daysToReturn?: number;
  notes?: string;
}

export interface UpdateCheckOutStatusDto {
  status: CheckOutStatus;
  notes?: string;
}
