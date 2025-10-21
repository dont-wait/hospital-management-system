"use client";

import { Progress, CardTitle, CardDescription } from "@/components";
import {
  getStepIcon,
  getStepTitle,
  getStepDescription,
  getStepNumber,
} from "@/hooks";
import { forgotPasswordStep } from "@/types";
import styles from "@/styles/auth.module.css";

interface StepHeaderProps {
  step: forgotPasswordStep;
}

export function StepHeader({ step }: StepHeaderProps) {
  return (
    <>
      <Progress value={getStepNumber(step)} className={styles["progress"]} />
      <div className={styles["fp-header"]}>
        <div className={styles["fp-header-wrap"]}>
          <div className={styles["fp-header-icon-wrap"]}>
            {getStepIcon(step)}
          </div>
        </div>
        <div>
          <CardTitle className={styles["fp-header-title"]}>
            {getStepTitle(step)}
          </CardTitle>
          <CardDescription className={styles["fp-desc"]}>
            {getStepDescription(step)}
          </CardDescription>
        </div>
      </div>
    </>
  );
}
