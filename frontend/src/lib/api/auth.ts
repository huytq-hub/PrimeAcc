/**
 * Authentication API Functions
 * 
 * Provides typed API functions for authentication operations:
 * - User registration
 * - User login
 * - Profile retrieval
 * - Logout (client-side only, no backend endpoint)
 * 
 * All functions use the centralized API client for consistent
 * error handling, token injection, and timeout management.
 * 
 * Requirements: 1.5, 2.3, 15.1, 15.2
 */

import { apiClient } from './client';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  RegisterResponse,
  User 
} from '@/types/auth';

/**
 * Authentication API interface
 */
export const authApi = {
  /**
   * Authenticates a user with username and password
   * 
   * @param credentials - Login credentials (username, password)
   * @returns Promise resolving to AuthResponse with access_token and user data
   * @throws Error if credentials are invalid or network error occurs
   * @example
   * try {
   *   const response = await authApi.login({
   *     username: 'john',
   *     password: 'Test123!@#'
   *   });
   *   console.log('Token:', response.access_token);
   *   console.log('User:', response.user);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Registers a new user account
   * 
   * @param data - Registration data (username, email, password)
   * @returns Promise resolving to RegisterResponse with user data
   * @throws Error if username/email already exists or validation fails
   * @example
   * try {
   *   const response = await authApi.register({
   *     username: 'john',
   *     email: 'john@example.com',
   *     password: 'Test123!@#'
   *   });
   *   console.log('User created:', response);
   * } catch (error) {
   *   console.error('Registration failed:', error.message);
   * }
   */
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  /**
   * Retrieves the authenticated user's profile
   * Requires valid JWT token in storage
   * 
   * @returns Promise resolving to User object
   * @throws Error if token is invalid or expired (401)
   * @example
   * try {
   *   const user = await authApi.getProfile();
   *   console.log('Current user:', user);
   * } catch (error) {
   *   console.error('Failed to get profile:', error.message);
   *   // Token likely expired, redirect to login
   * }
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/auth/profile');
  },

  /**
   * Logs out the current user
   * Currently client-side only - clears token from storage
   * 
   * Note: Backend doesn't have a logout endpoint yet.
   * This function is provided for future compatibility.
   * 
   * @returns Promise resolving when logout is complete
   * @example
   * await authApi.logout();
   * // Token is cleared, user is logged out
   */
  logout: async (): Promise<void> => {
    // Future: Call backend logout endpoint if implemented
    // await apiClient.post('/auth/logout', {});
    
    // For now, logout is handled client-side by clearing token
    return Promise.resolve();
  },
};
