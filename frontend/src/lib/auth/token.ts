/**
 * Token Storage Utilities
 * 
 * Provides secure JWT token storage, retrieval, and management.
 * Implements XSS prevention through token sanitization.
 * 
 * Requirements: 3.1, 3.6, 11.1
 */

import type { DecodedToken } from '@/types/auth';

// Storage key for JWT token
const TOKEN_KEY = 'primeacc_auth_token';

/**
 * Sanitizes a token string to prevent XSS attacks
 * Removes HTML tags and trims whitespace
 * 
 * @param token - Raw token string
 * @returns Sanitized token string
 */
function sanitizeToken(token: string): string {
  // Remove any HTML tags or script content
  return token.replace(/<[^>]*>/g, '').trim();
}

/**
 * Token storage interface for managing JWT tokens
 */
export const tokenStorage = {
  /**
   * Stores a JWT token in localStorage after sanitization
   * 
   * @param token - JWT token to store
   * @example
   * tokenStorage.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   */
  setToken: (token: string): void => {
    const sanitized = sanitizeToken(token);
    localStorage.setItem(TOKEN_KEY, sanitized);
  },

  /**
   * Retrieves the stored JWT token from localStorage
   * 
   * @returns JWT token string or null if not found
   * @example
   * const token = tokenStorage.getToken();
   * if (token) {
   *   // Use token for authenticated requests
   * }
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Removes the JWT token from localStorage
   * Should be called on logout or when token is invalid
   * 
   * @example
   * tokenStorage.removeToken();
   */
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Decodes a JWT token to extract payload data
   * Does NOT verify the token signature - only decodes the payload
   * 
   * @param token - JWT token string
   * @returns Decoded token payload or null if decode fails
   * @example
   * const decoded = tokenStorage.decodeToken(token);
   * if (decoded) {
   *   console.log('User ID:', decoded.sub);
   *   console.log('Role:', decoded.role);
   * }
   */
  decodeToken: (token: string): DecodedToken | null => {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format: expected 3 parts');
        return null;
      }

      // Decode the payload (second part)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode base64 and parse JSON
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload) as DecodedToken;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },

  /**
   * Checks if a JWT token is expired
   * 
   * @param token - JWT token string
   * @returns true if token is expired or invalid, false otherwise
   * @example
   * const token = tokenStorage.getToken();
   * if (token && tokenStorage.isTokenExpired(token)) {
   *   tokenStorage.removeToken();
   *   // Redirect to login
   * }
   */
  isTokenExpired: (token: string): boolean => {
    const decoded = tokenStorage.decodeToken(token);
    
    // If decode fails or no expiration, consider expired
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    // Convert exp from seconds to milliseconds and compare with current time
    const expirationTime = decoded.exp * 1000;
    return Date.now() >= expirationTime;
  },

  /**
   * Sanitizes a token string (exposed for testing)
   * 
   * @param token - Token string to sanitize
   * @returns Sanitized token string
   */
  sanitizeToken,
};
