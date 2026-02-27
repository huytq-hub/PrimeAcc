"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoadingSpinner } from "./AuthLoadingSpinner";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    // Check role-based access if required
    if (requiredRole && !hasRole(requiredRole)) {
      // Redirect to dashboard with error message
      router.push("/dashboard?error=access_denied");
      return;
    }
  }, [isAuthenticated, isLoading, requiredRole, user, hasRole, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || <AuthLoadingSpinner />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return fallback || <AuthLoadingSpinner />;
  }

  // Don't render if role check fails (will redirect)
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || <AuthLoadingSpinner />;
  }

  // Render protected content
  return <>{children}</>;
}
