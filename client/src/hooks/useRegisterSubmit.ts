"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterPatientDto } from "@/schemas/auth";

export function useRegisterSubmit() {
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (patientDto: RegisterPatientDto) => {
      const success = await register(patientDto);

      if (success) {
        router.push("/login");
      }
    },
    [register, router],
  );

  return {
    handleSubmit,
    isLoading,
  };
}
