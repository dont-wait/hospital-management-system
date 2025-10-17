"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import PatientService from "@/services/patient.service";
import TokenService from "@/services/token.service";
import type { PatientUpdateDto } from "@/schemas/patient";
import { Patient } from "@/types";

export function useUpdatePatient() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, user } = useUserAuthContext();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (id: string, patientUpdateDto: PatientUpdateDto) => {
      try {
        setIsLoading(true);
        const updateUser = await PatientService.updatePatient(
          id,
          patientUpdateDto,
        );
        if (updateUser && "patientId" in updateUser) {
          setUser({
            ...user,
            ...updateUser,
          } as Patient);

          TokenService.saveUser<Patient>({
            ...user,
            ...updateUser,
          } as Patient);
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
    [router, user, setUser],
  );

  return {
    handleSubmit,
    isLoading,
  };
}
