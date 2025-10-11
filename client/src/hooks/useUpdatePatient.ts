"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { patientService } from "@/services/patient.service";
import { tokenService } from "@/services/token.service";
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
          await patientService.updatePatient(id, patientUpdateDto);
        if (patientInfo && avatarUrl && authUser) {
          const newAuthUser = {
            ...authUser,
            avatarUrl,
            patient: patientInfo as Patient,
          };
          setAuthUser(newAuthUser);
          tokenService.saveUser(newAuthUser);
          router.push("/patient");
        }
        return true;
      } catch {
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
