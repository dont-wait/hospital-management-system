"use client";

import LazySection from "@/components/shared/LazySection";
import Skeleton from "react-loading-skeleton";
import { ModalProvider } from "@/contexts";
import { cn } from "@/lib/client";
import patientStyles from "@/styles/patient.module.css";
import cardStyles from "@/styles/card.module.css";

export default function PatientPage() {
  return (
    <ModalProvider>
      <div className={patientStyles["patient-page"]}>
        <div className={patientStyles["info-section"]}>
          <LazySection
            importFunc={() => import("@/components/patient/PatientListGroup")}
            skeleton={
              <div className={cardStyles["card"]}>
                <div className={cardStyles["card-header"]}>
                  <div className={cardStyles["card-title"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>
                </div>
                <div
                  className={cn(
                    cardStyles["card-content"],
                    patientStyles["patient-content"],
                  )}
                >
                  <div className={patientStyles["patient-helper-btn"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>

                  <div className={patientStyles["patient-helper-btn"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>

                  <div className={patientStyles["patient-helper-btn"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>
                </div>
              </div>
            }
          />

          <LazySection
            importFunc={() => import("@/components/patient/PatientInfo")}
            skeleton={
              <div className={cardStyles["card"]}>
                <div className={cardStyles["card-header"]}>
                  <div className={cardStyles["card-title"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>
                </div>
                <div
                  className={cn(
                    cardStyles["card-content"],
                    patientStyles["patient-content"],
                  )}
                >
                  <div className={patientStyles["info-section"]}>
                    <div className={patientStyles["patient-helper-btn"]}>
                      <Skeleton width="100%" height="100%" />
                    </div>

                    <div className={patientStyles["patient-helper-btn"]}>
                      <Skeleton width="100%" height="100%" />
                    </div>

                    <div className={patientStyles["patient-helper-btn"]}>
                      <Skeleton width="100%" height="100%" />
                    </div>
                  </div>

                  <div className={patientStyles["patient-helper-btn"]}>
                    <Skeleton width="100%" height="100%" />
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </ModalProvider>
  );
}
