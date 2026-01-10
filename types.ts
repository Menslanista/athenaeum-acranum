
export enum Discipline {
  HISTORY = 'History',
  SCIENCE = 'Science',
  ESOTERIC = 'Esoteric',
  PHILOSOPHY = 'Philosophy',
  PSYCHOLOGY = 'Psychology',
  POLITICAL = 'Political',
  LOST_KNOWLEDGE = 'Lost Knowledge'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  discipline: Discipline;
  category: string;
  description: string;
  coverUrl: string;
  fileUrl: string;
  createdAt: number;
}

export interface Epiphany {
  id: string;
  seeker: string;
  content: string;
  timestamp: number;
  resonance: number; // Similar to 'likes' but thematic
}

export interface User {
  email: string;
  isAdmin: boolean;
}
