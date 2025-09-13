"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { PatientRegisterSchema } from "@/types/index";

export function useRegisterSubmit() {
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: PatientRegisterSchema) => {

      const success = await register({
        patientInfo: {
          pt_firstname: data.firstName,
          pt_lastname: data.lastName,
          pt_dob: data.dateOfBirth,
          pt_nationality: data.nationality,
          email: data.email,
          gender: data.gender,
          pt_place_of_residence: data.placeOfResidence,
          pt_address: data.address,
          pt_is_insurance: 0,
          pt_contact_number: data.contactNumber,
          role_id: "patient",
        },
        accountInfo: {
          ua_avatar: "",
          ua_username: data.username,
          ua_password: data.password,
          is_active: 1,
        }
      });

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
