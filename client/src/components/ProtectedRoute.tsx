"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { authUser, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated && allowedRoles && authUser) {
      const userRole = "doctorId" in authUser.user ? "Doctor" : "Patient";
      if (!allowedRoles.includes(userRole)) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [isLoading, isAuthenticated, authUser, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && authUser) {
    const userRole = "doctorId" in authUser.user ? "doctor" : "patient";
    if (!allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}
