// TypeScript types matching the backend Flashcard model

export type Tech = 'JavaScript' | 'TypeScript' | 'React' | 'Node';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  tech: Tech;
  categories: string[];
  difficulty?: Difficulty;
  createdAt: string;
  updatedAt: string;
}

// Filter/search parameters for API calls
export interface FlashcardFilters {
  tech?: Tech;
  category?: string;
  search?: string;
}
