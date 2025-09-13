"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginCredentials } from "@/types/index";

export function useLoginSubmit() {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: LoginCredentials) => {
      const success = await login({
        username: data.username,
        password: data.password,
      });

      if (success) {
        router.push("/");
      }
    },
    [login, router],
  );

  return {
    handleSubmit,
    isLoading,
  };
}
