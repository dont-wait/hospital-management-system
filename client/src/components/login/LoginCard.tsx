"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/shared/Card";
import { LoginHeader } from "./LoginHeader";
import { LoginForm } from "./LoginForm";
import { LoginFooterLink } from "./LoginFooterLink";
import styles from "@/styles/auth.module.css";

const CardMotion = motion(Card);

function LoginCard() {
  return (
    <CardMotion
      initial={{ y: -10, opacity: 0.6 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={styles["login-card"]}
    >
      <LoginHeader />
      <CardContent className={styles["login-content"]}>
        <LoginForm />
        <LoginFooterLink />
      </CardContent>
    </CardMotion>
  );
}

export default LoginCard;
