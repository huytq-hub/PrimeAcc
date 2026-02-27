/**
 * Client-Side Rate Limiter
 * 
 * Implements rate limiting for authentication operations to prevent
 * rapid-fire login attempts and brute force attacks.
 * 
 * Configuration: Maximum 5 attempts per 60 seconds (1 minute)
 * 
 * Requirements: 11.5
 */

/**
 * Rate limit state structure
 */
interface RateLimitState {
  attempts: number;
  windowStart: number; // Unix timestamp in milliseconds
}

/**
 * Rate limiter configuration
 */
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,           // Maximum attempts allowed
  windowDuration: 60000,    // Time window in milliseconds (60 seconds)
};

/**
 * Internal state for rate limiting
 * Tracks attempts and window start time
 */
let rateLimitState: RateLimitState = {
  attempts: 0,
  windowStart: Date.now(),
};

/**
 * Rate limiter interface for managing login attempt limits
 */
export const rateLimiter = {
  /**
   * Checks if a new attempt is allowed under the rate limit
   * Automatically resets the window if expired
   * 
   * @returns true if attempt is allowed, false if rate limit exceeded
   * @example
   * if (!rateLimiter.checkLimit()) {
   *   setError('Too many login attempts. Please try again later.');
   *   return;
   * }
   * // Proceed with login attempt
   */
  checkLimit: (): boolean => {
    const now = Date.now();
    const timeSinceWindowStart = now - rateLimitState.windowStart;
    
    // Reset window if expired
    if (timeSinceWindowStart > RATE_LIMIT_CONFIG.windowDuration) {
      rateLimitState = {
        attempts: 0,
        windowStart: now,
      };
    }
    
    // Check if limit exceeded
    if (rateLimitState.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Increment attempt counter
    rateLimitState.attempts++;
    return true; // Attempt allowed
  },

  /**
   * Resets the rate limiter state
   * Should be called after successful login or when user needs a fresh start
   * 
   * @example
   * // After successful login
   * rateLimiter.reset();
   */
  reset: (): void => {
    rateLimitState = {
      attempts: 0,
      windowStart: Date.now(),
    };
  },

  /**
   * Gets the current number of attempts in the current window
   * Useful for displaying feedback to users
   * 
   * @returns Current attempt count
   * @example
   * const attempts = rateLimiter.getAttempts();
   * console.log(`${attempts} of ${5} attempts used`);
   */
  getAttempts: (): number => {
    const now = Date.now();
    const timeSinceWindowStart = now - rateLimitState.windowStart;
    
    // Return 0 if window expired
    if (timeSinceWindowStart > RATE_LIMIT_CONFIG.windowDuration) {
      return 0;
    }
    
    return rateLimitState.attempts;
  },

  /**
   * Gets the remaining time in seconds until the rate limit window resets
   * 
   * @returns Seconds remaining until reset, or 0 if window expired
   * @example
   * const remaining = rateLimiter.getRemainingTime();
   * if (remaining > 0) {
   *   setError(`Too many attempts. Try again in ${remaining} seconds.`);
   * }
   */
  getRemainingTime: (): number => {
    const now = Date.now();
    const timeSinceWindowStart = now - rateLimitState.windowStart;
    
    // Return 0 if window expired
    if (timeSinceWindowStart > RATE_LIMIT_CONFIG.windowDuration) {
      return 0;
    }
    
    const remainingMs = RATE_LIMIT_CONFIG.windowDuration - timeSinceWindowStart;
    return Math.ceil(remainingMs / 1000); // Convert to seconds and round up
  },

  /**
   * Gets the rate limit configuration
   * Useful for displaying limits to users
   * 
   * @returns Configuration object with maxAttempts and windowDuration
   * @example
   * const config = rateLimiter.getConfig();
   * console.log(`Limit: ${config.maxAttempts} attempts per ${config.windowDuration / 1000} seconds`);
   */
  getConfig: () => ({
    maxAttempts: RATE_LIMIT_CONFIG.maxAttempts,
    windowDuration: RATE_LIMIT_CONFIG.windowDuration,
  }),
};
