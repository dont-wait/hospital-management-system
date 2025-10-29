import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components";
import { Calendar, FileText, Pencil } from "@/lib/client";
import styles from "@/styles/patient.module.css";

const CardMotion = motion(Card);

function PatientListGroup() {
  return (
    <CardMotion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <CardHeader>
        <CardTitle>Chức năng</CardTitle>
      </CardHeader>
      <CardContent className={styles["patient-content"]}>
        <Button className={styles["patient-helper-btn"]} variant="outline">
          <Calendar className={styles["patient-helper-icon"]} />
          Lịch khám
        </Button>
        <Link href="/forgot-password" className={styles["patient-link"]}>
          <Button className={styles["patient-helper-btn"]} variant="outline">
            <FileText className={styles["patient-helper-icon"]} />
            Đổi mật khẩu
          </Button>
        </Link>
        <Link href="/patient/update" className={styles["patient-link"]}>
          <Button className={styles["patient-helper-btn"]} variant="outline">
            <Pencil className={styles["patient-helper-icon"]} />
            Cập nhật hồ sơ
          </Button>
        </Link>
      </CardContent>
    </CardMotion>
  );
}

export default PatientListGroup;
