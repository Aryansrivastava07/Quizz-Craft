"use client";

import React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import NotFoundContent from "@/components/ui/NotFoundContent";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-surface text-on-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary animate-pulse">
            <span className="material-symbols-outlined text-2xl animate-spin">
              progress_activity
            </span>
          </div>
          <span className="font-label-code text-xs text-on-surface-variant animate-pulse">
            Verifying orbital authorization clearance...
          </span>
        </div>
      </div>
    );
  }

  // If user is not authenticated or has logged out, display Page Not Found
  if (!user) {
    return <NotFoundContent />;
  }

  return <>{children}</>;
}
