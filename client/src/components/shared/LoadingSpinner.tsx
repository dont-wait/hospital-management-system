"use client";

import { motion } from "motion/react";
import styles from "@/styles/loading.module.css";

interface LoadingSpinnerProps {
  text: string;
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps) => (
  <div className={styles["loading-section"]}>
    <motion.div
      className={styles["loading-spin"]}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    <span>{text}</span>
  </div>
);
