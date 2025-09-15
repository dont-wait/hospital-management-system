"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginPatientDto} from "@/types/index";

export function useLoginSubmit() {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (patientDto: LoginPatientDto) => {
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
