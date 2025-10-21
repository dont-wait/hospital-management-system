import { motion } from "motion/react";
import { Card, CardContent } from "@/components";
import {
  RegisterHeader,
  RegisterForm,
  RegisterFooterLink,
} from "@/components/register";
import styles from "@/styles/auth.module.css";

const CardMotion = motion(Card);

function RegisterCard() {
  return (
    <CardMotion
      initial={{ y: -10, opacity: 0.6 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={styles["register-card"]}
    >
      <RegisterHeader />
      <CardContent className={styles["register-content"]}>
        <RegisterForm />
        <RegisterFooterLink />
      </CardContent>
    </CardMotion>
  );
}

export default RegisterCard;
