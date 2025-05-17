export enum Genre {
  Fiction = 'Fiction',
  NonFiction = 'NonFiction',
  Mystery = 'Mystery',
  SciFi = 'SciFi',
  Fantasy = 'Fantasy',
  Romance = 'Romance',
  Horror = 'Horror',
  Thriller = 'Thriller',
  Biography = 'Biography',
  History = 'History',
  Children = 'Children',
  Science = 'Science',
  Philosophy = 'Philosophy',
  Psychology = 'Psychology',
  Programming = 'Programming',
  Business = 'Business',
  SelfHelp = 'SelfHelp',
  Travel = 'Travel',
  Art = 'Art',
  Cooking = 'Cooking',
  Other = 'Other'
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
  publisher: string;
  genre: Genre;
  catalogNumber: string;
  totalCopies: number;
  availableCopies: number;
}

export interface CreateBookDto {
  title: string;
  author: string;
  publishedYear: number;
  publisher: string;
  genre: Genre;
  catalogNumber?: string;
  totalCopies: number;
}

export interface UpdateBookDto {
  title: string;
  author: string;
  publishedYear: number;
  publisher: string;
  genre: Genre;
}

export interface UpdateBookQuantityDto {
  quantity: number;
}
