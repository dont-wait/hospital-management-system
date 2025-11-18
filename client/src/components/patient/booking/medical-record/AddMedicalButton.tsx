"use client";

import Link from "next/link";
import { useBookingExamContext } from "@/contexts";
import { Patient } from "@/types";
import styles from "@/styles/booking.module.css";

interface AddMedicalButtonProps {
  patient: Patient;
}

export default function AddMedicalButton({ patient }: AddMedicalButtonProps) {
  const { changeToStepOne } = useBookingExamContext();
  return (
    <div className={styles["medical-record-buttons"]}>
      <Link href="/patient" className={styles["medical-record-button"]}>
        Quay lại trang bệnh nhân
      </Link>

      <button
        className={styles["medical-record-button"]}
        onClick={() => {
          changeToStepOne(patient);
        }}
      >
        Tiếp tục
      </button>
    </div>
  );
}
