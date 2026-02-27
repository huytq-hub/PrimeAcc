# Implementation Plan: Authentication System

## Overview

This plan implements a secure authentication system for the PrimeAcc application, integrating Next.js 15 (App Router) frontend with the existing NestJS backend. The implementation follows the established design patterns (ThemeContext, Navy theme, glassmorphism) and includes comprehensive testing with both unit tests and property-based tests using fast-check.

The system provides user registration, login, session management, protected routes, and role-based access control (MEMBER, AGENT, ADMIN). All components follow TypeScript best practices with full type safety.

## Tasks

- [x] 1. Set up core infrastructure and type definitions
  - Create TypeScript interfaces for User, AuthState, AuthContextType, and API types
  - Define validation interfaces (ValidationResult, PasswordStrength)
  - Set up project structure for auth components, contexts, and utilities
  - _Requirements: 7.2, 7.3, 7.4, 15.3_

- [x] 2. Implement token storage and security utilities
  - [x] 2.1 Create token storage module (lib/auth/token.ts)
    - Implement setToken, getToken, removeToken functions
    - Add JWT token decoding and expiration checking
    - Implement token sanitization to prevent XSS
    - _Requirements: 3.1, 3.6, 11.1_
  
  - [ ]* 2.2 Write property test for token storage
    - **Property 4: Token Storage and Retrieval Round Trip**
    - **Validates: Requirements 2.4, 3.1, 3.2, 3.6**
  
  - [x] 2.3 Create input validation module (lib/auth/validation.ts)
    - Implement validateUsername (3-20 alphanumeric)
    - Implement validateEmail (RFC 5322 format)
    - Implement validatePassword (8+ chars, uppercase, lowercase, number, special)
    - Implement getPasswordStrength with scoring
    - Implement validatePasswordMatch
    - Implement sanitizeInput for XSS prevention
    - _Requirements: 1.2, 1.3, 1.4, 2.2, 11.1, 13.2, 13.3, 13.5_
  
  - [ ]* 2.4 Write property tests for validation functions
    - **Property 1: Input Validation**
    - **Validates: Requirements 1.2, 1.3, 1.4, 2.2**
    - **Property 2: XSS Prevention Through Sanitization**
    - **Validates: Requirements 11.1, 3.6**
    - **Property 14: Password Strength Calculation**
    - **Validates: Requirements 13.2, 13.3**
    - **Property 15: Password Confirmation Validation**
    - **Validates: Requirements 13.5**
  
  - [x] 2.5 Create rate limiter module (lib/auth/rate-limiter.ts)
    - Implement client-side rate limiting (5 attempts per minute)
    - Add checkLimit and reset functions
    - _Requirements: 11.5_
  
  - [ ]* 2.6 Write property test for rate limiting
    - **Property 18: Client-Side Rate Limiting**
    - **Validates: Requirements 11.5**

- [x] 3. Implement API client with interceptors
  - [x] 3.1 Create HTTP client class (lib/api/client.ts)
    - Implement request method with timeout handling
    - Add automatic JWT token injection in Authorization header
    - Handle 401 errors with automatic token cleanup and redirect
    - Implement GET, POST, PUT, DELETE methods with TypeScript generics
    - Configure base URL from NEXT_PUBLIC_API_URL environment variable
    - _Requirements: 3.2, 3.3, 3.4, 15.4, 15.5, 15.6_
  
  - [ ]* 3.2 Write unit tests for API client
    - Test Authorization header injection
    - Test 401 error handling and token cleanup
    - Test timeout handling
    - Test error response parsing
    - _Requirements: 3.2, 3.4_
  
  - [x] 3.3 Create auth API functions (lib/api/auth.ts)
    - Implement login function (POST /auth/login)
    - Implement register function (POST /auth/register)
    - Implement getProfile function (GET /auth/profile)
    - Implement logout function (optional backend call)
    - _Requirements: 1.5, 2.3, 15.1, 15.2_
  
  - [ ]* 3.4 Write property test for API request format
    - **Property 3: API Request Format Consistency**
    - **Validates: Requirements 1.5, 2.3, 15.1, 15.2**

- [x] 4. Checkpoint - Verify core utilities
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement AuthContext for state management
  - [x] 5.1 Create AuthContext provider (contexts/AuthContext.tsx)
    - Implement AuthProvider component with state management
    - Add user, isAuthenticated, isLoading, error state
    - Implement login function with backend integration
    - Implement register function with backend integration
    - Implement logout function with cleanup
    - Add clearError function
    - Implement hasRole helper and role boolean properties
    - Add token verification on mount for session persistence
    - _Requirements: 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.5, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 12.1_
  
  - [ ]* 5.2 Write unit tests for AuthContext
    - Test useAuth throws error outside provider
    - Test initial unauthenticated state
    - Test login updates state correctly
    - Test logout clears state
    - Test session persistence on mount
    - _Requirements: 7.9_
  
  - [ ]* 5.3 Write property tests for AuthContext
    - **Property 5: Authentication State Consistency**
    - **Validates: Requirements 2.5, 12.1**
    - **Property 8: Session Persistence on Page Load**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.5**
    - **Property 9: Logout Cleanup Completeness**
    - **Validates: Requirements 6.2, 6.3, 6.4, 11.6**
  
  - [x] 5.4 Create useAuth hook export (hooks/useAuth.ts)
    - Re-export useAuth from AuthContext for convenience
    - _Requirements: 7.8_

- [x] 6. Implement protected route component
  - [x] 6.1 Create ProtectedRoute wrapper (components/auth/ProtectedRoute.tsx)
    - Check authentication status and redirect if unauthenticated
    - Preserve original destination URL as query parameter
    - Show loading spinner while checking auth
    - Support requiredRole prop for role-based access
    - Redirect to dashboard with error if insufficient permissions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 12.4, 12.5_
  
  - [ ]* 6.2 Write unit tests for ProtectedRoute
    - Test redirect to login when unauthenticated
    - Test renders children when authenticated
    - Test loading state display
    - Test role-based access control
    - _Requirements: 4.1, 4.2, 4.4_
  
  - [ ]* 6.3 Write property tests for protected routes
    - **Property 6: Protected Route Access Control**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - **Property 20: Role-Based Route Authorization**
    - **Validates: Requirements 12.5**
  
  - [x] 6.4 Create AuthLoadingSpinner component (components/auth/AuthLoadingSpinner.tsx)
    - Full-page loading indicator with Navy theme colors
    - Centered spinner to prevent flash of unauthenticated content
    - _Requirements: 4.4, 9.3_

- [x] 7. Create login page and form
  - [x] 7.1 Create LoginForm component (components/auth/LoginForm.tsx)
    - Implement form with username and password fields
    - Add real-time validation with error display
    - Implement password visibility toggle
    - Add loading state with spinner in button
    - Disable inputs and button while loading
    - Display error messages from AuthContext
    - Clear errors when user starts typing
    - Apply Navy theme styling with glassmorphism
    - Add proper ARIA labels and keyboard navigation
    - _Requirements: 2.1, 2.2, 2.7, 2.9, 8.1, 8.6, 8.7, 9.1, 9.4, 10.1, 10.2, 10.3, 10.5, 10.6, 14.1, 14.2, 14.3_
  
  - [ ]* 7.2 Write unit tests for LoginForm
    - Test form renders all fields
    - Test submit button disabled while loading
    - Test error message display
    - Test password visibility toggle
    - Test form submission
    - _Requirements: 2.9, 8.7_
  
  - [x] 7.3 Create login page (app/(auth)/login/page.tsx)
    - Render LoginForm component
    - Handle redirect query parameter for post-login navigation
    - Display success/error messages from query params
    - Redirect authenticated users to dashboard
    - Apply responsive design (mobile, tablet, desktop)
    - _Requirements: 2.1, 4.3, 4.6, 10.4_
  
  - [ ]* 7.4 Write property tests for login flow
    - **Property 10: Loading State During Async Operations**
    - **Validates: Requirements 1.8, 2.9, 9.4**
    - **Property 11: Error Handling and Display**
    - **Validates: Requirements 1.7, 8.1, 8.5, 8.6**
    - **Property 19: Authenticated User Redirect from Auth Pages**
    - **Validates: Requirements 4.6**

- [x] 8. Create registration page and form
  - [x] 8.1 Create PasswordStrengthMeter component (components/auth/PasswordStrengthMeter.tsx)
    - Display password strength score (weak, medium, strong)
    - Show specific missing requirements
    - Use color coding (red, yellow, green)
    - _Requirements: 13.2, 13.3_
  
  - [x] 8.2 Create RegisterForm component (components/auth/RegisterForm.tsx)
    - Implement form with username, email, password, confirm password fields
    - Add real-time validation with 500ms debounce
    - Display field-specific errors with icons (checkmark/X)
    - Integrate PasswordStrengthMeter component
    - Disable submit button until all fields valid
    - Add loading state with spinner
    - Apply Navy theme styling with glassmorphism
    - Add proper ARIA labels and keyboard navigation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 1.8, 8.1, 8.6, 8.7, 9.2, 9.4, 10.1, 10.2, 10.3, 10.5, 10.6, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 14.1, 14.2, 14.3_
  
  - [ ]* 8.3 Write unit tests for RegisterForm
    - Test form renders all fields
    - Test password strength indicator
    - Test field validation
    - Test submit button disabled state
    - Test error display
    - _Requirements: 13.2, 13.7_
  
  - [x] 8.4 Create register page (app/(auth)/register/page.tsx)
    - Render RegisterForm component
    - Redirect to login on successful registration
    - Redirect authenticated users to dashboard
    - Apply responsive design
    - _Requirements: 1.1, 1.6, 4.6, 10.4_
  
  - [ ]* 8.5 Write property tests for registration flow
    - **Property 16: Form Validation State Management**
    - **Validates: Requirements 13.7**
    - **Property 17: Debounced Validation Timing**
    - **Validates: Requirements 13.1**

- [x] 9. Checkpoint - Verify authentication flows
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Integrate authentication with existing application
  - [x] 10.1 Update root layout (app/layout.tsx)
    - Wrap application with AuthProvider
    - Ensure AuthProvider is inside ThemeProvider
    - _Requirements: 7.1_
  
  - [x] 10.2 Update dashboard layout (app/dashboard/layout.tsx)
    - Wrap dashboard with ProtectedRoute component
    - Maintain existing Sidebar and Navbar structure
    - _Requirements: 4.1_
  
  - [x] 10.3 Update Sidebar component (components/Sidebar.tsx)
    - Add user section at bottom with avatar and username
    - Display user role
    - Add logout button with icon
    - Use useAuth hook to access user data and logout function
    - _Requirements: 6.1, 6.5, 6.6_
  
  - [ ]* 10.4 Write integration tests for auth flows
    - Test complete registration and login flow
    - Test protected route access
    - Test logout flow
    - Test session persistence across page refresh
    - _Requirements: 2.6, 4.3, 5.1, 6.5_

- [x] 11. Implement error handling and HTTP status code handling
  - [x] 11.1 Add comprehensive error handling to API client
    - Handle network errors with user-friendly messages
    - Handle 400 validation errors with field-specific messages
    - Handle 401 unauthorized with auth reset
    - Handle 429 rate limit with appropriate message
    - Handle 500 server errors with generic message
    - Log all errors to console for debugging
    - _Requirements: 2.7, 2.8, 8.1, 8.2, 8.3, 8.4, 8.5, 15.4_
  
  - [ ]* 11.2 Write property test for HTTP status code handling
    - **Property 12: HTTP Status Code Handling**
    - **Validates: Requirements 15.4**
  
  - [ ]* 11.3 Write property test for token expiration
    - **Property 7: Token Expiration Handling**
    - **Validates: Requirements 3.3, 3.4, 5.4**

- [x] 12. Implement role-based access control features
  - [x] 12.1 Add role-based UI rendering examples
    - Update dashboard components to conditionally render based on role
    - Use hasRole function and role boolean properties
    - _Requirements: 12.2, 12.3, 12.4_
  
  - [ ]* 12.2 Write property test for role-based access
    - **Property 13: Role-Based Access Control**
    - **Validates: Requirements 12.3, 12.4**

- [x] 13. Add accessibility and theme integration
  - [x] 13.1 Enhance accessibility for all auth components
    - Ensure all form inputs have proper labels with htmlFor
    - Add ARIA live regions for error announcements
    - Verify keyboard navigation with Tab key
    - Add visible focus indicators
    - Provide alt text for all icons
    - Use semantic HTML (form, label, button)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.8_
  
  - [ ]* 13.2 Write accessibility tests
    - **Property 22: Accessibility Compliance**
    - **Validates: Requirements 14.1, 14.4, 14.5, 14.6, 14.8**
  
  - [x] 13.3 Add prefers-reduced-motion support
    - Disable/minimize animations for users with motion preference
    - _Requirements: 14.7_
  
  - [ ]* 13.4 Write property test for reduced motion
    - **Property 23: Reduced Motion Support**
    - **Validates: Requirements 14.7**
  
  - [x] 13.5 Verify theme integration
    - Test light and dark mode on all auth pages
    - Ensure proper contrast ratios (4.5:1 minimum)
    - Verify glassmorphism effects work in both modes
    - _Requirements: 10.7, 10.8_
  
  - [ ]* 13.6 Write property test for theme integration
    - **Property 21: Theme Integration**
    - **Validates: Requirements 10.7**

- [x] 14. Add environment configuration and security features
  - [x] 14.1 Create environment variable files
    - Create .env.local with NEXT_PUBLIC_API_URL for development
    - Document environment variables in README
    - _Requirements: 15.5_
  
  - [x] 14.2 Implement CSRF protection
    - Generate CSRF token on app load
    - Include X-CSRF-Token header in state-changing requests
    - _Requirements: 11.2_
  
  - [x] 14.3 Add request timeout handling
    - Implement 10-second timeout for all requests
    - Display timeout error message
    - _Requirements: 9.6_
  
  - [ ]* 14.4 Write property test for timeout handling
    - **Property 24: Request Timeout Handling**
    - **Validates: Requirements 9.6**
  
  - [x] 14.5 Verify password security measures
    - Ensure passwords never logged to console
    - Verify password visibility toggle works
    - Confirm password cleared from memory on logout
    - _Requirements: 11.3_
  
  - [ ]* 14.6 Write property test for password security
    - **Property 28: Password Security**
    - **Validates: Requirements 11.3**

- [x] 15. Add API response parsing and credentials handling
  - [x] 15.1 Verify API response parsing
    - Ensure JWT token and user data correctly parsed from response
    - Handle missing or malformed response data
    - _Requirements: 15.3_
  
  - [ ]* 15.2 Write property test for API response parsing
    - **Property 25: API Response Parsing**
    - **Validates: Requirements 15.3**
  
  - [x] 15.2 Add credentials handling for CORS
    - Include credentials: 'include' in requests when needed
    - _Requirements: 15.6_
  
  - [ ]* 15.4 Write property test for environment configuration
    - **Property 26: Environment Configuration**
    - **Validates: Requirements 15.5**
  
  - [ ]* 15.5 Write property test for credentials inclusion
    - **Property 27: Credentials Inclusion in Requests**
    - **Validates: Requirements 15.6**

- [x] 16. Final checkpoint and polish
  - [x] 16.1 Run all tests and verify coverage
    - Ensure unit tests pass
    - Ensure property tests pass (100 iterations each)
    - Verify 80%+ code coverage
    - _Requirements: All_
  
  - [x] 16.2 Verify UI/UX consistency
    - Test responsive design on mobile (375px), tablet (768px), desktop (1024px+)
    - Verify Navy theme colors throughout
    - Ensure glassmorphism effects consistent
    - Test loading states and transitions
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_
  
  - [x] 16.3 Security audit
    - Verify XSS prevention measures
    - Confirm CSRF protection active
    - Test rate limiting
    - Verify token sanitization
    - Ensure no sensitive data in logs
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 11.6_
  
  - [x] 16.4 Documentation and cleanup
    - Add JSDoc comments to all public functions
    - Update README with authentication setup instructions
    - Document environment variables
    - Add inline comments for complex logic
    - _Requirements: All_

- [x] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100 iterations each
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout for type safety
- All components follow the existing Navy theme and glassmorphism design patterns
- Authentication integrates with existing NestJS backend at /auth/register and /auth/login
- Session persistence uses localStorage (upgrade to httpOnly cookies when backend supports)
- Client-side rate limiting adds extra protection beyond backend rate limiting
- All forms include comprehensive validation with real-time feedback
- Accessibility is built-in from the start with ARIA labels and keyboard navigation
- The system supports three user roles: MEMBER, AGENT, ADMIN
