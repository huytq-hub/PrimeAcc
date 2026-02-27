/**
 * Authentication Type Definitions
 * 
 * Core TypeScript interfaces for the authentication system.
 * Defines User, AuthState, AuthContext, API request/response types,
 * and form validation interfaces.
 */

// ============================================================================
// User and Role Types
// ============================================================================

/**
 * User role enumeration
 * - MEMBER: Standard user with basic access
 * - AGENT: User with elevated permissions
 * - ADMIN: Administrator with full access
 */
export type UserRole = 'MEMBER' | 'AGENT' | 'ADMIN';

/**
 * User model representing an authenticated user
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Authentication State
// ============================================================================

/**
 * Authentication state structure
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Authentication context type with state and actions
 */
export interface AuthContextType extends AuthState {
  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  // Role helpers
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isAgent: boolean;
  isMember: boolean;
}

// ============================================================================
// JWT Token Types
// ============================================================================

/**
 * Decoded JWT token payload
 */
export interface DecodedToken {
  sub: string;        // user id
  username: string;
  email?: string;
  role: UserRole;
  iat: number;        // issued at (Unix timestamp)
  exp: number;        // expiration (Unix timestamp)
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Login request credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration request data
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

/**
 * Authentication response from backend
 * Note: Backend returns 'access_token' not 'token'
 */
export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
    balance?: number;
  };
}

/**
 * Registration response from backend
 */
export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  errors?: Record<string, string[]>; // Field-specific validation errors
}

// ============================================================================
// Form State Types
// ============================================================================

/**
 * Login form state
 */
export interface LoginFormState {
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Registration form state
 */
export interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation result for a single field
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Password strength analysis result
 */
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3; // 0=weak, 1=fair, 2=good, 3=strong
  feedback: string[];
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  meetsLength: boolean;
}

/**
 * Field validation state for forms
 */
export interface FieldValidation {
  value: string;
  isValid: boolean;
  error: string | null;
  isTouched: boolean;
}

/**
 * Form validation state (key-value pairs of field validations)
 */
export interface FormValidation {
  [key: string]: FieldValidation;
}
