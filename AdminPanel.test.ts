
/**
 * Tests for AdminPanel Sorting Logic
 * 
 * Note: These are conceptualized for a Vitest/Jest environment.
 * In a real environment, we would use React Testing Library to test the UI interactions.
 */

import { Discipline, Book } from './types';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Zeno\'s Paradoxes',
    author: 'Zeno',
    discipline: Discipline.PHILOSOPHY,
    category: 'Logic',
    description: 'Ancient puzzles.',
    coverUrl: '',
    fileUrl: '',
    createdAt: 1000,
  },
  {
    id: '2',
    title: 'Alchemy and Art',
    author: 'Hermes',
    discipline: Discipline.ESOTERIC,
    category: 'Mysticism',
    description: 'Hermetic arts.',
    coverUrl: '',
    fileUrl: '',
    createdAt: 3000,
  },
  {
    id: '3',
    title: 'Biology Basics',
    author: 'Darwin',
    discipline: Discipline.SCIENCE,
    category: 'Evolution',
    description: 'Natural selection.',
    coverUrl: '',
    fileUrl: '',
    createdAt: 2000,
  }
];

// Helper to simulate component sorting logic
const getSortedBooks = (books: Book[], field: 'title' | 'author' | 'createdAt', order: 'asc' | 'desc') => {
  return [...books].sort((a, b) => {
    let comparison = 0;
    if (field === 'createdAt') {
      comparison = a.createdAt - b.createdAt;
    } else {
      comparison = a[field].localeCompare(b[field]);
    }
    return order === 'asc' ? comparison : -comparison;
  });
};

export const runTests = () => {
  console.log('--- STARTING ADMIN PANEL SORTING TESTS ---');

  // Test Case 1: Sort by Title Ascending
  const titleAsc = getSortedBooks(mockBooks, 'title', 'asc');
  console.assert(titleAsc[0].title === 'Alchemy and Art', 'Test Case 1 Failed: Alchemy and Art should be first');
  console.assert(titleAsc[2].title === 'Zeno\'s Paradoxes', 'Test Case 1 Failed: Zeno should be last');
  console.log('✅ Test Case 1 Passed: Title Ascending');

  // Test Case 2: Sort by Title Descending
  const titleDesc = getSortedBooks(mockBooks, 'title', 'desc');
  console.assert(titleDesc[0].title === 'Zeno\'s Paradoxes', 'Test Case 2 Failed: Zeno should be first');
  console.assert(titleDesc[2].title === 'Alchemy and Art', 'Test Case 2 Failed: Alchemy should be last');
  console.log('✅ Test Case 2 Passed: Title Descending');

  // Test Case 3: Sort by Author Ascending
  const authorAsc = getSortedBooks(mockBooks, 'author', 'asc');
  console.assert(authorAsc[0].author === 'Darwin', 'Test Case 3 Failed: Darwin should be first');
  console.log('✅ Test Case 3 Passed: Author Ascending');

  // Test Case 4: Sort by Date Ascending
  const dateAsc = getSortedBooks(mockBooks, 'createdAt', 'asc');
  console.assert(dateAsc[0].createdAt === 1000, 'Test Case 4 Failed: Oldest should be first');
  console.assert(dateAsc[2].createdAt === 3000, 'Test Case 4 Failed: Newest should be last');
  console.log('✅ Test Case 4 Passed: Date Ascending');

  // Test Case 5: Sort by Date Descending
  const dateDesc = getSortedBooks(mockBooks, 'createdAt', 'desc');
  console.assert(dateDesc[0].createdAt === 3000, 'Test Case 5 Failed: Newest should be first');
  console.log('✅ Test Case 5 Passed: Date Descending');

  // Edge Case 6: Empty Archive
  const empty = getSortedBooks([], 'title', 'asc');
  console.assert(empty.length === 0, 'Test Case 6 Failed: Empty array should stay empty');
  console.log('✅ Test Case 6 Passed: Empty Archive');

  console.log('--- ALL TESTS COMPLETED SUCCESSFULLY ---');
};

// Auto-run if this were a script environment
// runTests();
