/**
 * Application constants
 * 
 * Centralized constants to avoid magic numbers throughout the codebase.
 * Makes values easier to maintain and understand.
 */

// Authentication constants
export const JWT_EXPIRES_IN = '7d'; // JWT token expiration time
export const JWT_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Password hashing
export const BCRYPT_ROUNDS = 10; // bcrypt salt rounds (balanced between security and performance)

// Server configuration
export const DEFAULT_PORT = 3000;
export const DEFAULT_PAGE_SIZE = 20; // Default pagination limit for flashcards

// Request limits
export const MAX_JSON_REQUEST_SIZE = '10mb'; // Maximum size for JSON request bodies

