// API client for flashcards - using native fetch (no abstractions)

import type { Flashcard, FlashcardFilters } from '../types';

// In production (single service), use relative URLs. In development, use VITE_API_URL or localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

// Response type for paginated flashcards
interface PaginatedFlashcardsResponse {
  flashcards: Flashcard[];
  hasMore: boolean;
  page: number;
  limit: number;
  totalCount: number;
}

// Helper to build query string from filters
function buildQueryString(
    filters: FlashcardFilters,
    page?: number,
    limit?: number
): string {
  const params = new URLSearchParams();
  if (filters.tech) params.append('tech', filters.tech);
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  return params.toString();
}

// Get all flashcards with optional filters and pagination
export async function getFlashcards(
    filters: FlashcardFilters = {},
    page?: number,
    limit?: number
): Promise<PaginatedFlashcardsResponse> {
  const queryString = buildQueryString(filters, page, limit);
  const url = `${API_BASE_URL}/flashcards${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    credentials: 'include', // Include cookies for auth
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch flashcards: ${response.statusText}`);
  }
  return response.json();
}

// Get single flashcard by ID
export async function getFlashcard(id: string): Promise<Flashcard> {
  const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Flashcard not found');
    }
    throw new Error(`Failed to fetch flashcard: ${response.statusText}`);
  }
  return response.json();
}

// Create new flashcard
export async function createFlashcard(
  flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Flashcard> {
  const response = await fetch(`${API_BASE_URL}/flashcards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(flashcard),
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Please log in to create flashcards');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Failed to create flashcard: ${response.statusText}`);
  }
  return response.json();
}

// Update flashcard
export async function updateFlashcard(
  id: string,
  updates: Partial<Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Flashcard> {
  const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Please log in to update flashcards');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Failed to update flashcard: ${response.statusText}`);
  }
  return response.json();
}

// Delete flashcard
export async function deleteFlashcard(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Please log in to delete flashcards');
    }
    if (response.status === 404) {
      throw new Error('Flashcard not found');
    }
    throw new Error(`Failed to delete flashcard: ${response.statusText}`);
  }
}