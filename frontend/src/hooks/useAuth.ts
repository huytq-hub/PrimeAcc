/**
 * useAuth Hook Export
 * 
 * Convenience re-export of the useAuth hook from AuthContext.
 * This allows consumers to import from @/hooks/useAuth instead of
 * @/contexts/AuthContext, providing a cleaner API.
 * 
 * Requirements: 7.8
 * 
 * @example
 * import { useAuth } from '@/hooks/useAuth';
 * 
 * function MyComponent() {
 *   const { user, login, logout } = useAuth();
 *   // ...
 * }
 */

export { useAuth } from "@/contexts/AuthContext";
