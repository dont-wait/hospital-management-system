"use client";

import LazySection from "@/components/shared/LazySection";
import { ModalProvider } from "@/contexts";
import { ListGroupSkeleton, PatientInfoSkeleton } from "@/components/skeletons";
import patientStyles from "@/styles/patient.module.css";

export default function PatientPage() {
  return (
    <ModalProvider>
      <div className={patientStyles["patient-page"]}>
        <div className={patientStyles["info-section"]}>
          <LazySection
            importFunc={() => import("@/components/patient/PatientListGroup")}
            skeleton={<ListGroupSkeleton />}
          />

          <LazySection
            importFunc={() => import("@/components/patient/PatientInfo")}
            skeleton={<PatientInfoSkeleton />}
          />
        </div>
      </div>
    </ModalProvider>
  );
}
