import PatientListGroup from "@/components/patient/PatientListGroup";
import PatientInfo from "@/components/patient/PatientInfo";
import patientStyles from "@/styles/patient.module.css";

export default function PatientPage() {
  return (
    <div className={patientStyles["patient-page"]}>
      <div className={patientStyles["info-section"]}>
        <PatientListGroup />
        <PatientInfo />
      </div>
    </div>
  );
}
