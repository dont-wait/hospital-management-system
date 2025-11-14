import { motion } from "motion/react";
import { Label, Modal } from "@/components";
import { PatientUtils, parseDateString } from "@/lib/client";
import { AuthUserWithoutTokens } from "@/types";
import styles from "@/styles/patient.module.css";
import { getUserRole } from "@/lib/helper";
import PatientDetail from "@/components/patient/PatientDetail";

type UserDetailProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: AuthUserWithoutTokens;
};

export function UserDetail({ user, isOpen, setIsOpen }: UserDetailProps) {
  const formatHireDate = parseDateString(user.employee?.hireDate || "");

  const employeeInfo = [
    {
      label: `Tên ${getUserRole(user)}`,
      value: `${user.employee?.firstName} ${user.employee?.lastName}`,
    },
    {
      label: "Giới tính",
      value: PatientUtils.formatGender(user.employee?.gender || ""),
    },
    {
      label: "Ngày sinh",
      value: PatientUtils.formatDOB(user.employee?.dateOfBirth || ""),
    },
    {
      label: "Số điện thoại",
      value: user.employee?.phoneNumber || "",
    },
    {
      label: "Email",
      value: user.employee?.email || "",
    },
    {
      label: "Chuyên khoa",
      value: user.employee?.specialization || "",
    },
    {
      label: "Chứng chỉ hành nghề",
      value: user.employee?.certificateNumber || "",
    },
    {
      label: "Ngày vào làm",
      value: `${formatHireDate.day}/${formatHireDate.month}/${formatHireDate.year}`,
    },
  ];

  return (
    <>
      {user.patient ? (
        <PatientDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          patient={user.patient}
        />
      ) : (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          title={`Thông tin ${getUserRole(user)}`}
          maxWidth="md"
        >
          <ul className={styles["patient-modal-list"]}>
            {employeeInfo.map((info, index) => (
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
      )}
    </>
  );
}
