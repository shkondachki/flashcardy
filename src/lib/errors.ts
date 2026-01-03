/**
 * Error response utilities
 * 
 * Provides consistent error message formatting across the API.
 * This ensures all error responses follow the same structure.
 */

export interface ErrorResponse {
  error: string;
  code?: string;
}

/**
 * Creates a standardized error response object
 * 
 * @param {string} message - Human-readable error message
 * @param {string} code - Optional error code for programmatic handling
 * @returns {ErrorResponse} Standardized error response object
 */
export function createErrorResponse(message: string, code?: string): ErrorResponse {
  const response: ErrorResponse = { error: message };
  if (code) {
    response.code = code;
  }
  return response;
}

