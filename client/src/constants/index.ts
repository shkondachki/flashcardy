import { Tech, Difficulty } from '../types';

// Available tech options (used in forms and filters)
export const TECH_OPTIONS: Tech[] = ['JavaScript', 'TypeScript', 'React', 'Node'];

// Available difficulty options (used in forms)
export const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard'];

// Study Mode configuration
// Study Mode needs all flashcards in memory for navigation and random selection
// Using a reasonable limit that should cover most use cases for a portfolio app
export const STUDY_MODE_MAX_CARDS = 500;

