import { lazy } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components";
import styles from "@/styles/patient.module.css";

const UpdateForm = lazy(() => import("@/components/patient/UpdateForm"));
const CardMotion = motion(Card);

function UpdateCard() {
  return (
    <CardMotion
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={styles["patient-update-card"]}
    >
      <CardContent>
        <UpdateForm />
      </CardContent>
    </CardMotion>
  );
}

export default UpdateCard;
