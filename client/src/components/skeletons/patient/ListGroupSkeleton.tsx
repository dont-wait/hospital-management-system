import Skeleton from "react-loading-skeleton";
import { cn } from "@/lib/client";
import patientStyles from "@/styles/patient.module.css";
import cardStyles from "@/styles/card.module.css";

export function ListGroupSkeleton() {
  return (
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
  );
}
