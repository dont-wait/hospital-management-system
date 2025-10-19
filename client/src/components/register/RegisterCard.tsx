import { motion } from "motion/react";
import { Card, CardContent } from "@/components";
import {
  RegisterHeader,
  RegisterForm,
  RegisterFooterLink,
} from "@/components/register";
import styles from "@/styles/auth.module.css";

function RegisterCard() {
  return (
    <motion.section
      initial={{ y: -10, opacity: 0.6 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className={styles["register-card"]}>
        <RegisterHeader />
        <CardContent className={styles["register-content"]}>
          <RegisterForm />
          <RegisterFooterLink />
        </CardContent>
      </Card>
    </motion.section>
  );
}

export default RegisterCard;
