
import React from 'react';

export const COLORS = {
  midnight: '#0a0a0b',
  charcoal: '#18181b',
  gold: '#D4AF37',
  amber: '#FFD700',
  parchment: '#E5E7EB'
};

export const MANIFESTO = {
  headline: "Knowledge Born from the Shadows.",
  subheadline: "A legacy of truth, reclaimed from the dark night of the soul.",
  body: "For years, I walked a lonely road in search of answers. This library contains the over 300 voices that spoke back to me when the world was silent. From forbidden truths to lost disciplines, these archives are my legacy to you—so that you may know what few do, without paying the price I did. Read, unlearn, and transcend."
};

export const INITIAL_BOOKS = [
  {
    id: '1',
    title: 'The Kybalion',
    author: 'Three Initiates',
    discipline: 'Philosophy',
    category: 'Hermeticism',
    description: 'A study of the Hermetic Philosophy of Ancient Egypt and Greece. It explores the seven principles that govern reality.',
    coverUrl: 'https://picsum.photos/seed/kybalion/400/600',
    fileUrl: '#',
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    discipline: 'Philosophy',
    category: 'Stoicism',
    description: 'A series of personal writings by the Roman Emperor, recording his private notes to himself and ideas on Stoic philosophy.',
    coverUrl: 'https://picsum.photos/seed/meditations/400/600',
    fileUrl: '#',
    createdAt: Date.now()
  },
  {
    id: '3',
    title: 'The Hero with a Thousand Faces',
    author: 'Joseph Campbell',
    discipline: 'Psychology',
    category: 'Mythology',
    description: 'Work of comparative mythology that outlines the Hero\'s Journey, a universal motif of adventure and transformation.',
    coverUrl: 'https://picsum.photos/seed/hero/400/600',
    fileUrl: '#',
    createdAt: Date.now()
  },
  {
    id: '4',
    title: 'The Origins of Totalitarianism',
    author: 'Hannah Arendt',
    discipline: 'Political',
    category: 'History',
    description: 'A deep analysis of the historical conditions that led to the rise of totalitarian regimes in the 20th century.',
    coverUrl: 'https://picsum.photos/seed/arendt/400/600',
    fileUrl: '#',
    createdAt: Date.now()
  }
];
