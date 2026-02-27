"use client";

import { Loader2 } from "lucide-react";

export function AuthLoadingSpinner() {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      role="status"
      aria-live="polite"
      aria-label="Loading authentication status"
    >
      {/* Glass card container */}
      <div className="glass-card p-8 rounded-2xl flex flex-col items-center gap-4">
        {/* Spinner icon */}
        <Loader2 
          className="w-12 h-12 text-purple-400 animate-spin" 
          aria-hidden="true"
        />
        
        {/* Loading text */}
        <p className="text-slate-300 text-lg font-medium">
          Verifying authentication...
        </p>
      </div>
    </div>
  );
}
