"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { validators } from "@/lib/auth/validation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, error, clearError, isLoading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
  });

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.username, formData.password]);

  const handleInputChange = (field: "username" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear field-specific validation error
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      username: "",
      password: "",
    };

    // Validate username
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.username, formData.password);
      
      // Redirect will happen via useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error is handled by AuthContext and displayed via error state
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Display auth error */}
      {error && (
        <div 
          className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-500"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <div className="relative">
            <User 
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" 
              aria-hidden="true"
            />
            <input
              id="username"
              type="text"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={isLoading}
              className={`h-12 w-full rounded-xl border ${
                validationErrors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border focus:ring-ring"
              } glass pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-invalid={!!validationErrors.username}
              aria-describedby={validationErrors.username ? "username-error" : undefined}
              required
            />
          </div>
          {validationErrors.username && (
            <p 
              id="username-error" 
              className="mt-1.5 text-xs text-red-500"
              role="alert"
            >
              {validationErrors.username}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <Lock 
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" 
              aria-hidden="true"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isLoading}
              className={`h-12 w-full rounded-xl border ${
                validationErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border focus:ring-ring"
              } glass pl-12 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-invalid={!!validationErrors.password}
              aria-describedby={validationErrors.password ? "password-error" : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p 
              id="password-error" 
              className="mt-1.5 text-xs text-red-500"
              role="alert"
            >
              {validationErrors.password}
            </p>
          )}
        </div>
      </div>

      {/* Remember me and forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            disabled={isLoading}
            className="h-4 w-4 rounded border-border text-cta focus:ring-cta cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label 
            htmlFor="remember" 
            className="ml-2 text-sm text-muted-foreground cursor-pointer"
          >
            Ghi nhớ đăng nhập
          </label>
        </div>
        <a 
          href="#" 
          className="text-sm font-semibold text-cta hover:text-cta/80 cursor-pointer"
          tabIndex={isLoading ? -1 : 0}
        >
          Quên mật khẩu?
        </a>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cta to-primary text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading" />
        ) : (
          <>
            <span>Đăng nhập ngay</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
