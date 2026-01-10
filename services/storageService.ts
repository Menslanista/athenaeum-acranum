
import { Book, Epiphany } from '../types';
import { INITIAL_BOOKS } from '../constants';

const BOOKS_KEY = 'bemlib_archives_books';
const EPIPHANIES_KEY = 'bemlib_archives_epiphanies';

export const storageService = {
  getBooks: (): Book[] => {
    const stored = localStorage.getItem(BOOKS_KEY);
    if (!stored) {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(INITIAL_BOOKS));
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
    localStorage.setItem(BOOKS_KEY, JSON.stringify(updatedBooks));
    return newBook;
  },

  deleteBook: (id: string): void => {
    const books = storageService.getBooks();
    const updatedBooks = books.filter(b => b.id !== id);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(updatedBooks));
  },

  getEpiphanies: (): Epiphany[] => {
    const stored = localStorage.getItem(EPIPHANIES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addEpiphany: (content: string, seeker: string): Epiphany => {
    const epiphanies = storageService.getEpiphanies();
    const newEpiphany: Epiphany = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      seeker: seeker || 'Anonymous Seeker',
      timestamp: Date.now(),
      resonance: 0
    };
    localStorage.setItem(EPIPHANIES_KEY, JSON.stringify([newEpiphany, ...epiphanies]));
    return newEpiphany;
  },

  resonate: (id: string): void => {
    const epiphanies = storageService.getEpiphanies();
    const updated = epiphanies.map(e => e.id === id ? { ...e, resonance: e.resonance + 1 } : e);
    localStorage.setItem(EPIPHANIES_KEY, JSON.stringify(updated));
  }
};
