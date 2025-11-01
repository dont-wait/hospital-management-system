import { ElementType } from "react";
import { Button, Label } from "@/components";
import styles from "@/styles/patient.module.css";

type PatientInfoFieldProps = {
  icon: ElementType;
  label: string;
  content: string;
};
export function PatientInfoField({
  icon: Icon,
  label,
  content,
}: PatientInfoFieldProps) {
  return (
    <Button className={styles["patient-helper-btn"]} variant="outline">
      <Icon className={styles["patient-helper-icon"]} />
      <Label className={styles["patient-info-label"]}>
        {label}: <span>{content}</span>
      </Label>
    </Button>
  );
}
