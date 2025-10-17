"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import type { RegisterPatientDto } from "@/schemas/auth";

export function useRegisterSubmit() {
  const { register, isLoading } = useUserAuthContext();
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
