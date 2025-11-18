import { motion } from "motion/react";
import { Label, Modal } from "@/components";
import { PatientUtils } from "@/lib/client";
import { Patient } from "@/types";
import styles from "@/styles/patient.module.css";

type PatientDetailProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  patient: Patient;
};

export default function PatientDetail({
  patient,
  isOpen,
  setIsOpen,
}: PatientDetailProps) {
  const patientInfo = [
    {
      label: "Tên bệnh nhân",
      value: `${patient.firstName} ${patient.lastName}`,
    },
    { label: "Quốc tịch", value: patient.nationality },
    { label: "Giới tính", value: PatientUtils.formatGender(patient.gender) },
    { label: "Ngày sinh", value: PatientUtils.formatDOB(patient.dateOfBirth) },
    { label: "Số điện thoại", value: patient.phoneNumber },
    { label: "Nơi sinh", value: patient.placeOfResidence },
    { label: "Địa chỉ", value: patient.address },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Thông tin bệnh nhân"
      maxWidth="md"
    >
      <ul className={styles["patient-modal-list"]}>
        {patientInfo.map((info, index) => (
          <motion.li
            key={info.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={styles["patient-modal-list-item"]}
          >
            <Label className={styles["modal-label"]}>
              {info.label}:{" "}
              <span className={styles["modal-content"]}>{info.value}</span>
            </Label>
          </motion.li>
        ))}
      </ul>
    </Modal>
  );
}
