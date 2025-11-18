import Link from "next/link";
import PatientListGroup from "@/components/patient/dashboard/PatientListGroup";
import PatientInfo from "@/components/patient/dashboard/PatientInfo";
import { cn } from "@/lib/client";
import patientStyles from "@/styles/patient.module.css";
import buttonStyles from "@/styles/button.module.css";

export default function PatientPage() {
  return (
    <div className={patientStyles["patient-page"]}>
      <div className={patientStyles["info-section"]}>
        <PatientListGroup />
        <PatientInfo />
      </div>
      <div className={patientStyles["info-section"]}>
        <Link href="patient/booking">
          <div
            className={cn(
              buttonStyles["button"],
              patientStyles["patient-re-btn"],
            )}
          >
            Đăng ký khám bệnh
          </div>
        </Link>
      </div>
    </div>
  );
}
