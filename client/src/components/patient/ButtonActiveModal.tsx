"use client";

import dynamic from "next/dynamic";
import { Button, Icon } from "@/components";
import { useModal } from "@/contexts";
import { Patient } from "@/types";
import styles from "@/styles/patient.module.css";

const PatientDetail = dynamic(() => import("./PatientDetail"), {
  ssr: false,
  loading: () => null,
});

interface ButtonActiveModalProps {
  patient: Patient;
}

export function ButtonActiveModal({ patient }: ButtonActiveModalProps) {
  const { isOpen, toggleModal } = useModal();

  return (
    <>
      {isOpen && patient && (
        <PatientDetail
          isOpen={isOpen}
          setIsOpen={toggleModal}
          patient={patient}
        />
      )}

      <Button
        onClick={toggleModal}
        className={styles["patient-helper-btn"]}
        variant="outline"
      >
        <Icon name="FileText" className={styles["patient-helper-icon"]} />
        Hồ sơ chi tiết
      </Button>
    </>
  );
}
