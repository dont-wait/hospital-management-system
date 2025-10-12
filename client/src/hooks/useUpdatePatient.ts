"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PatientService from "@/services/patient.service";
import TokenService from "@/services/token.service";
import type { PatientUpdateDto } from "@/schemas/patient";
import { Patient } from "@/types";

export function useUpdatePatient() {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser, authUser } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (id: string, patientUpdateDto: PatientUpdateDto) => {
      try {
        setIsLoading(true);
        const { avatarUrl, ...patientInfo } =
          await PatientService.updatePatient(id, patientUpdateDto);
        if (patientInfo && avatarUrl && authUser) {
          const newAuthUser = {
            ...authUser,
            avatarUrl,
            patient: patientInfo as Patient,
          };
          setAuthUser(newAuthUser);
          TokenService.saveUser(newAuthUser);
          router.push("/patient");
        }
        return true;
      } catch (error) {
        console.error("Failed to update patient:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [router, authUser, setAuthUser],
  );

  return {
    handleSubmit,
    isLoading,
  };
}
