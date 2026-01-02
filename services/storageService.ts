
import { Book, Discipline } from '../types';
import { INITIAL_BOOKS } from '../constants';

const STORAGE_KEY = 'bemlib_archives_books';

export const storageService = {
  getBooks: (): Book[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS as Book[];
    }
    return JSON.parse(stored);
  },

  addBook: (bookData: Omit<Book, 'id' | 'createdAt'>): Book => {
    const books = storageService.getBooks();
    const newBook: Book = {
      ...bookData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const updatedBooks = [newBook, ...books];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    return newBook;
  },

  deleteBook: (id: string): void => {
    const books = storageService.getBooks();
    const updatedBooks = books.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  }
};
