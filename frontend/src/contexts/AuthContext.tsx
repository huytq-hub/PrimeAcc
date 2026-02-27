"use client";

/**
 * Authentication Context
 * 
 * Provides centralized authentication state management for the application.
 * Handles user login, registration, logout, session persistence, and role-based access control.
 * 
 * Features:
 * - JWT token-based authentication
 * - Automatic session restoration on page load
 * - Token expiration handling
 * - Role-based access control (MEMBER, AGENT, ADMIN)
 * - Error state management
 * 
 * Requirements: 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.5, 6.2, 6.3, 6.4, 6.5, 7.1-7.7, 12.1
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/auth/token";
import type { AuthContextType, User, UserRole } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Wraps the application to provide authentication context to all child components.
 * Automatically verifies stored tokens on mount and restores user sessions.
 * 
 * @param children - Child components that will have access to auth context
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify token and restore session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = tokenStorage.getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Check if token is expired
      if (tokenStorage.isTokenExpired(token)) {
        tokenStorage.removeToken();
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      try {
        const userData = await authApi.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        // Token invalid or expired, clear it
        tokenStorage.removeToken();
        console.error("Session verification failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  /**
   * Authenticates a user with username and password
   * 
   * @param username - User's username
   * @param password - User's password
   * @throws Error if login fails or credentials are invalid
   * @example
   * try {
   *   await login('john', 'password123');
   *   // User is now authenticated
   * } catch (error) {
   *   console.error('Login failed:', error);
   * }
   */
  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ username, password });
      
      // Store token
      tokenStorage.setToken(response.access_token);
      
      // Set user data
      const userData: User = {
        id: response.user.id,
        username: response.user.username,
        email: "", // Backend doesn't return email in login response
        role: response.user.role,
        balance: response.user.balance,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registers a new user account
   * 
   * @param username - Desired username (3-20 alphanumeric characters)
   * @param email - Valid email address
   * @param password - Strong password (8+ chars, uppercase, lowercase, number, special char)
   * @throws Error if registration fails or validation errors occur
   * @example
   * try {
   *   await register('john', 'john@example.com', 'Password123!');
   *   // Registration successful, redirect to login
   * } catch (error) {
   *   console.error('Registration failed:', error);
   * }
   */
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register({ username, email, password });
      
      // Registration successful, but user needs to login
      // Don't automatically authenticate after registration
      console.log("Registration successful:", response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the current user
   * 
   * Clears JWT token from storage, resets user state, and optionally calls backend logout endpoint.
   * 
   * @example
   * logout();
   * // User is now logged out and redirected to login page
   */
  const logout = (): void => {
    // Clear token
    tokenStorage.removeToken();
    
    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    
    // Optional: Call backend logout endpoint
    authApi.logout().catch(err => {
      console.error("Logout API call failed:", err);
    });
  };

  /**
   * Clears the current error state
   * 
   * Should be called when user starts typing in form fields to clear previous errors.
   * 
   * @example
   * clearError();
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * Checks if the current user has a specific role
   * 
   * @param role - Role to check (MEMBER, AGENT, or ADMIN)
   * @returns true if user has the specified role, false otherwise
   * @example
   * if (hasRole('ADMIN')) {
   *   // Show admin-only features
   * }
   */
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // Role boolean properties for convenient access
  const isAdmin = user?.role === "ADMIN";
  const isAgent = user?.role === "AGENT";
  const isMember = user?.role === "MEMBER";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        hasRole,
        isAdmin,
        isAgent,
        isMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context in components.
 * Must be used within an AuthProvider.
 * 
 * @returns AuthContextType with user state and authentication methods
 * @throws Error if used outside of AuthProvider
 * @example
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <LoginButton onClick={() => login('user', 'pass')} />;
 *   }
 *   
 *   return <div>Welcome, {user.username}!</div>;
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
