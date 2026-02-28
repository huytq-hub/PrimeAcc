/**
 * HTTP API Client
 * 
 * Provides a centralized HTTP client with automatic JWT token injection,
 * comprehensive error handling, timeout management, and HTTP status code handling.
 * 
 * Features:
 * - Automatic Authorization header injection
 * - Request timeout handling (10 seconds default)
 * - Comprehensive HTTP status code handling (400, 401, 403, 404, 429, 500)
 * - User-friendly Vietnamese error messages
 * - Detailed error logging for debugging
 * - TypeScript generics for type-safe responses
 * - Environment-based base URL configuration
 * 
 * Requirements: 2.7, 2.8, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3, 8.4, 8.5, 15.4, 15.5, 15.6
 */

import { tokenStorage } from '@/lib/auth/token';
import type { ApiError } from '@/types/auth';

/**
 * User-friendly error messages in Vietnamese for different HTTP status codes
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  403: 'Bạn không có quyền truy cập.',
  404: 'Không tìm thấy tài nguyên.',
  429: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
  500: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  502: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  503: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
};

/**
 * Extended request configuration with timeout support
 */
interface RequestConfig extends RequestInit {
  timeout?: number;
}

/**
 * HTTP API Client class
 * Handles all HTTP requests with automatic token injection and error handling
 */
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000; // 10 seconds

  constructor() {
    // Get base URL from environment variable or use default
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  /**
   * Internal request method that handles all HTTP operations
   * 
   * @param endpoint - API endpoint path (e.g., '/auth/login')
   * @param config - Request configuration including method, headers, body, timeout
   * @returns Promise resolving to typed response data
   * @throws Error for network issues, timeouts, or HTTP errors with user-friendly messages
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, ...fetchConfig } = config;

    // Build headers with automatic token injection
    const token = tokenStorage.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Create abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
        credentials: 'include', // Include cookies for CORS
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - clear auth and redirect
      if (response.status === 401) {
        console.warn('[API Client] 401 Unauthorized - clearing auth state', {
          endpoint,
          timestamp: new Date().toISOString(),
        });
        
        tokenStorage.removeToken();
        
        // Only redirect if we're in a browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=session_expired';
        }
        
        const error = new Error(ERROR_MESSAGES[401]) as Error & { statusCode?: number };
        error.statusCode = 401;
        throw error;
      }

      // Handle other HTTP errors
      if (!response.ok) {
        // Try to parse error response from backend
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          // If JSON parsing fails, use default error message
          errorData = {
            message: ERROR_MESSAGES[response.status] || `HTTP ${response.status}`,
            statusCode: response.status,
          };
        }

        // Log error details for debugging
        console.error('[API Client] HTTP Error', {
          status: response.status,
          statusText: response.statusText,
          endpoint,
          method: fetchConfig.method || 'GET',
          errorData,
          timestamp: new Date().toISOString(),
        });

        // Create detailed error with user-friendly message
        const userMessage = ERROR_MESSAGES[response.status] || errorData.message || `HTTP ${response.status}`;
        const error = new Error(userMessage) as Error & { 
          statusCode?: number; 
          errors?: Record<string, string[]>;
          originalMessage?: string;
        };
        
        error.statusCode = errorData.statusCode || response.status;
        error.errors = errorData.errors; // Field-specific validation errors for 400
        error.originalMessage = errorData.message; // Preserve original backend message

        throw error;
      }

      // Parse and return JSON response
      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle timeout errors
      if (error.name === 'AbortError') {
        console.error('[API Client] Request Timeout', {
          endpoint,
          timeout,
          timestamp: new Date().toISOString(),
        });
        
        const timeoutError = new Error('Yêu cầu hết thời gian chờ. Vui lòng thử lại.') as Error & { statusCode?: number };
        timeoutError.statusCode = 408;
        throw timeoutError;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[API Client] Network Error', {
          endpoint,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        
        const networkError = new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.') as Error & { statusCode?: number };
        networkError.statusCode = 0;
        throw networkError;
      }

      // Re-throw errors that already have statusCode (from HTTP error handling above)
      if (error.statusCode) {
        throw error;
      }

      // Handle unexpected errors
      console.error('[API Client] Unexpected Error', {
        endpoint,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      
      throw error;
    }
  }

  /**
   * Performs a GET request
   * 
   * @param endpoint - API endpoint path
   * @param config - Optional request configuration
   * @returns Promise resolving to typed response data
   * @example
   * const user = await apiClient.get<User>('/auth/profile');
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * Performs a POST request
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body data (will be JSON stringified)
   * @param config - Optional request configuration
   * @returns Promise resolving to typed response data
   * @example
   * const response = await apiClient.post<AuthResponse>('/auth/login', {
   *   username: 'john',
   *   password: 'secret'
   * });
   */
  async post<T>(endpoint: string, data: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Performs a PUT request
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body data (will be JSON stringified)
   * @param config - Optional request configuration
   * @returns Promise resolving to typed response data
   * @example
   * const updated = await apiClient.put<User>('/user/profile', {
   *   email: 'newemail@example.com'
   * });
   */
  async put<T>(endpoint: string, data: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Performs a DELETE request
   * 
   * @param endpoint - API endpoint path
   * @param config - Optional request configuration
   * @returns Promise resolving to typed response data
   * @example
   * await apiClient.delete('/user/account');
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Gets the configured base URL
   * Useful for debugging and testing
   * 
   * @returns Base URL string
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

/**
 * Singleton API client instance
 * Import and use this instance throughout the application
 * 
 * @example
 * import { apiClient } from '@/lib/api/client';
 * const data = await apiClient.get('/endpoint');
 */
export const apiClient = new ApiClient();
