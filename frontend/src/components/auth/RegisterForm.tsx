"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { validators } from "@/lib/auth/validation";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

interface FieldState {
  value: string;
  error: string;
  isValid: boolean;
  isTouched: boolean;
}

export function RegisterForm() {
  const router = useRouter();
  const { register, error, clearError, isLoading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({
    username: { value: "", error: "", isValid: false, isTouched: false },
    email: { value: "", error: "", isValid: false, isTouched: false },
    password: { value: "", error: "", isValid: false, isTouched: false },
    confirmPassword: { value: "", error: "", isValid: false, isTouched: false },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Clear auth errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.username, formData.email, formData.password, formData.confirmPassword]);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      validateAllFields();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData]);

  const validateAllFields = useCallback(() => {
    const newFieldStates = { ...fieldStates };

    // Validate username
    if (fieldStates.username.isTouched || formData.username) {
      const usernameResult = validators.validateUsername(formData.username);
      newFieldStates.username = {
        value: formData.username,
        error: usernameResult.error || "",
        isValid: usernameResult.isValid,
        isTouched: fieldStates.username.isTouched,
      };
    }

    // Validate email
    if (fieldStates.email.isTouched || formData.email) {
      const emailResult = validators.validateEmail(formData.email);
      newFieldStates.email = {
        value: formData.email,
        error: emailResult.error || "",
        isValid: emailResult.isValid,
        isTouched: fieldStates.email.isTouched,
      };
    }

    // Validate password
    if (fieldStates.password.isTouched || formData.password) {
      const passwordResult = validators.validatePassword(formData.password);
      newFieldStates.password = {
        value: formData.password,
        error: passwordResult.error || "",
        isValid: passwordResult.isValid,
        isTouched: fieldStates.password.isTouched,
      };
    }

    // Validate confirm password
    if (fieldStates.confirmPassword.isTouched || formData.confirmPassword) {
      const matchResult = validators.validatePasswordMatch(
        formData.password,
        formData.confirmPassword
      );
      newFieldStates.confirmPassword = {
        value: formData.confirmPassword,
        error: matchResult.error || "",
        isValid: matchResult.isValid,
        isTouched: fieldStates.confirmPassword.isTouched,
      };
    }

    setFieldStates(newFieldStates);
  }, [formData, fieldStates]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldStates((prev) => ({
      ...prev,
      [field]: { ...prev[field], isTouched: true },
    }));
  };

  const isFormValid = () => {
    return (
      fieldStates.username.isValid &&
      fieldStates.email.isValid &&
      fieldStates.password.isValid &&
      fieldStates.confirmPassword.isValid
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setFieldStates((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key].isTouched = true;
      });
      return updated;
    });

    // Validate all fields
    validateAllFields();

    if (!isFormValid()) {
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      
      // Redirect to login on success
      router.push("/login?message=registration_success");
    } catch (err) {
      // Error is handled by AuthContext and displayed via error state
      console.error("Registration failed:", err);
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
                fieldStates.username.isTouched && fieldStates.username.error
                  ? "border-red-500 focus:ring-red-500"
                  : fieldStates.username.isTouched && fieldStates.username.isValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-border focus:ring-ring"
              } glass pl-12 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-invalid={fieldStates.username.isTouched && !fieldStates.username.isValid}
              aria-describedby={
                fieldStates.username.isTouched && fieldStates.username.error
                  ? "username-error"
                  : undefined
              }
              required
            />
            {fieldStates.username.isTouched && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {fieldStates.username.isValid ? (
                  <Check className="h-5 w-5 text-green-500" aria-hidden="true" />
                ) : (
                  <X className="h-5 w-5 text-red-500" aria-hidden="true" />
                )}
              </div>
            )}
          </div>
          {fieldStates.username.isTouched && fieldStates.username.error && (
            <p id="username-error" className="mt-1.5 text-xs text-red-500" role="alert">
              {fieldStates.username.error}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              className={`h-12 w-full rounded-xl border ${
                fieldStates.email.isTouched && fieldStates.email.error
                  ? "border-red-500 focus:ring-red-500"
                  : fieldStates.email.isTouched && fieldStates.email.isValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-border focus:ring-ring"
              } glass pl-12 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-invalid={fieldStates.email.isTouched && !fieldStates.email.isValid}
              aria-describedby={
                fieldStates.email.isTouched && fieldStates.email.error
                  ? "email-error"
                  : undefined
              }
              required
            />
            {fieldStates.email.isTouched && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {fieldStates.email.isValid ? (
                  <Check className="h-5 w-5 text-green-500" aria-hidden="true" />
                ) : (
                  <X className="h-5 w-5 text-red-500" aria-hidden="true" />
                )}
              </div>
            )}
          </div>
          {fieldStates.email.isTouched && fieldStates.email.error && (
            <p id="email-error" className="mt-1.5 text-xs text-red-500" role="alert">
              {fieldStates.email.error}
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
                fieldStates.password.isTouched && fieldStates.password.error
                  ? "border-red-500 focus:ring-red-500"
                  : fieldStates.password.isTouched && fieldStates.password.isValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-border focus:ring-ring"
              } glass pl-12 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-invalid={fieldStates.password.isTouched && !fieldStates.password.isValid}
              aria-describedby={
                fieldStates.password.isTouched && fieldStates.password.error
                  ? "password-error"
                  : undefined
              }
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
          {fieldStates.password.isTouched && fieldStates.password.error && (
            <p id="password-error" className="mt-1.5 text-xs text-red-500" role="alert">
              {fieldStates.password.error}
            </p>
          )}
        </div>

        {/* Password strength meter */}
        {formData.password && (
          <div className="rounded-xl border border-border glass p-4">
            <PasswordStrengthMeter password={formData.password} />
          </div>
        )}

        {/* Confirm password field */}
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              disabled={isLoading}
              className={`h-12 w-full rounded-xl border ${
                fieldStates.confirmPassword.isTouched && fieldStates.confirmPassword.error
                  ? "border-red-500 focus:ring-red-500"
                  : fieldStates.confirmPassword.isTouched && fieldStates.confirmPassword.isValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-border focus:ring-ring"
              } glass pl-12 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-invalid={
                fieldStates.confirmPassword.isTouched && !fieldStates.confirmPassword.isValid
              }
              aria-describedby={
                fieldStates.confirmPassword.isTouched && fieldStates.confirmPassword.error
                  ? "confirmPassword-error"
                  : undefined
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldStates.confirmPassword.isTouched && fieldStates.confirmPassword.error && (
            <p id="confirmPassword-error" className="mt-1.5 text-xs text-red-500" role="alert">
              {fieldStates.confirmPassword.error}
            </p>
          )}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid()}
        className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-cta to-primary text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-cta/30 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading" />
        ) : (
          <>
            <span>Đăng ký ngay</span>
            <ArrowRight
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </button>
    </form>
  );
}
