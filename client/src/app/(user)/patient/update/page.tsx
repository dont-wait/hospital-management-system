"use client";

import LazySection from "@/components/shared/LazySection";
import { PatientUpdateSkeleton } from "@/components/skeletons";
import patientStyles from "@/styles/patient.module.css";

function UpdatePatientPage() {
  return (
    <LazySection
      importFunc={() => import("@/components/patient/UpdateCard")}
      skeleton={<PatientUpdateSkeleton />}
      className={patientStyles["patient-update-form-skeleton"]}
    />
  );
}

export default UpdatePatientPage;
