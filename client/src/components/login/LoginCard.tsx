import { motion } from "motion/react";
import { Card, CardContent } from "@/components";
import { LoginHeader, LoginForm, LoginFooterLink } from "@/components/login";
import styles from "@/styles/auth.module.css";

function LoginCard() {
  return (
    <motion.section
      initial={{ y: -10, opacity: 0.6 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className={styles["login-card"]}>
        <LoginHeader />
        <CardContent className={styles["login-content"]}>
          <LoginForm />
          <LoginFooterLink />
        </CardContent>
      </Card>
    </motion.section>
  );
}

export default LoginCard;
