/**
 * Form Validation Utilities
 * 
 * Provides validation functions for authentication forms including
 * username, email, password validation, password strength analysis,
 * and XSS prevention through input sanitization.
 * 
 * Requirements: 1.2, 1.3, 1.4, 2.2, 11.1, 13.2, 13.3, 13.5
 */

import type { ValidationResult, PasswordStrength } from '@/types/auth';

/**
 * Validates username according to requirements:
 * - 3-20 characters
 * - Alphanumeric only (a-z, A-Z, 0-9)
 * 
 * @param username - Username string to validate
 * @returns ValidationResult with isValid flag and optional error message
 * @example
 * const result = validators.validateUsername('john123');
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.length === 0) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be at most 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { isValid: false, error: 'Username must contain only letters and numbers' };
  }
  
  return { isValid: true };
}

/**
 * Validates email address according to RFC 5322 format
 * 
 * @param email - Email address to validate
 * @returns ValidationResult with isValid flag and optional error message
 * @example
 * const result = validators.validateEmail('user@example.com');
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

/**
 * Validates password according to security requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*(),.?":{}|<>)
 * 
 * @param password - Password string to validate
 * @returns ValidationResult with isValid flag and detailed error message
 * @example
 * const result = validators.validatePassword('Test123!');
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('one special character');
  }
  
  if (errors.length > 0) {
    return { 
      isValid: false, 
      error: `Password must contain ${errors.join(', ')}` 
    };
  }
  
  return { isValid: true };
}

/**
 * Analyzes password strength and provides detailed feedback
 * 
 * @param password - Password string to analyze
 * @returns PasswordStrength object with score (0-3) and detailed feedback
 * @example
 * const strength = validators.getPasswordStrength('Test123!');
 * console.log(`Strength: ${strength.score}/3`);
 * strength.feedback.forEach(tip => console.log(tip));
 */
export function getPasswordStrength(password: string): PasswordStrength {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const meetsLength = password.length >= 8;
  
  const feedback: string[] = [];
  let criteriaCount = 0;
  
  // Count how many criteria are met
  if (meetsLength) {
    criteriaCount++;
  } else {
    feedback.push('Add more characters (minimum 8)');
  }
  
  if (hasUppercase) {
    criteriaCount++;
  } else {
    feedback.push('Add uppercase letter');
  }
  
  if (hasLowercase) {
    criteriaCount++;
  } else {
    feedback.push('Add lowercase letter');
  }
  
  if (hasNumber) {
    criteriaCount++;
  } else {
    feedback.push('Add number');
  }
  
  if (hasSpecial) {
    criteriaCount++;
  } else {
    feedback.push('Add special character');
  }
  
  // Calculate score based on criteria met
  // 0-1 criteria: weak (0)
  // 2-3 criteria: fair (1)
  // 4 criteria: good (2)
  // 5 criteria: strong (3)
  let score: 0 | 1 | 2 | 3;
  if (criteriaCount <= 1) {
    score = 0;
  } else if (criteriaCount <= 3) {
    score = 1;
  } else if (criteriaCount === 4) {
    score = 2;
  } else {
    score = 3;
  }
  
  return {
    score,
    feedback,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    meetsLength,
  };
}

/**
 * Validates that password and confirmation password match
 * 
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns ValidationResult indicating if passwords match
 * @example
 * const result = validators.validatePasswordMatch('Test123!', 'Test123!');
 */
export function validatePasswordMatch(
  password: string, 
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true };
}

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes HTML tags and escapes special characters
 * 
 * @param input - Raw user input string
 * @returns Sanitized string safe for storage and display
 * @example
 * const safe = validators.sanitizeInput('<script>alert("xss")</script>');
 * // Returns: 'alert(&quot;xss&quot;)'
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
}

/**
 * Validators object exposing all validation functions
 */
export const validators = {
  validateUsername,
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validatePasswordMatch,
  sanitizeInput,
};
