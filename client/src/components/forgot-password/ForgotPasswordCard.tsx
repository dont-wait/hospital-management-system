"use client";

import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components";
import {
  StepHeader,
  EmailStep,
  OtpStep,
  PasswordStep,
} from "@/components/forgot-password";
import { useForgotPassword } from "@/hooks";
import styles from "@/styles/auth.module.css";

function ForgotPasswordCard() {
  const { state, sendOtp, verifyOtp, resetPassword } = useForgotPassword();
  const stepComponent = useMemo(() => {
    switch (state.step) {
      case "send":
        return <EmailStep state={state} sendOtp={sendOtp} />;
      case "verify":
        return <OtpStep verifyOtp={verifyOtp} />;
      case "reset":
        return <PasswordStep resetPassword={resetPassword} />;
      default:
        return null;
    }
  }, [state, sendOtp, verifyOtp, resetPassword]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.step}
        initial={{ y: -10, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className={styles["fp-page"]}>
          <Card className={styles["fp-card"]}>
            <CardHeader className={styles["fp-card-header"]}>
              <StepHeader step={state.step} />
            </CardHeader>
            <CardContent className={styles["fp-card-content"]}>
              {stepComponent}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(ForgotPasswordCard);
