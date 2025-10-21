import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components";
import { PatientInfoField, PatientDetail } from "@/components/patient";
import { FileText, User, Mail, Phone } from "@/lib/client";
import { useUserAuthContext, useModal } from "@/contexts";
import { Patient } from "@/types";
import styles from "@/styles/patient.module.css";

const CardMotion = motion(Card);

function PatientInfo() {
  const { user } = useUserAuthContext();
  const { isOpen, toggleModal } = useModal();

  return (
    <>
      {user && "patientId" in user && (
        <PatientDetail
          isOpen={isOpen}
          setIsOpen={toggleModal}
          patient={user as Patient}
        />
      )}
      <CardMotion
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <CardHeader>
          <CardTitle>Thông tin bệnh nhân</CardTitle>
        </CardHeader>
        {user && "patientId" in user && (
          <CardContent className={styles["patient-content"]}>
            <div className={styles["info-section"]}>
              <PatientInfoField
                icon={User}
                label={"Tên bệnh nhân"}
                content={`${user.firstName} ${user.lastName}`}
              />

              <PatientInfoField
                icon={Mail}
                label={"Email"}
                content={user.email}
              />

              <PatientInfoField
                icon={Phone}
                label={"Số điện thoại"}
                content={user.phoneNumber}
              />
            </div>

            <Button
              onClick={toggleModal}
              className={styles["patient-helper-btn"]}
              variant="outline"
            >
              <FileText className={styles["patient-helper-icon"]} />
              Hồ sơ chi tiết
            </Button>
          </CardContent>
        )}
      </CardMotion>
    </>
  );
}

export default PatientInfo;
