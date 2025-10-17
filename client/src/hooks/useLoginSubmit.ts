"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import type { LoginAccountDto } from "@/schemas/auth";

export function useLoginSubmit() {
  const { login, isLoading } = useUserAuthContext();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (patientDto: LoginAccountDto) => {
      const success = await login(patientDto);

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
