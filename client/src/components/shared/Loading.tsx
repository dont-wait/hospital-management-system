"use client";

import { motion } from "motion/react";
import styles from "@/styles/loading.module.css";

export function Loading() {
  return (
    <div className={styles["loading-page"]}>
      <motion.div
        className={styles["loading-page-content"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className={styles["loading-page-spin"]}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 360,
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
        >
          <div className={styles["loading-page-spin-a"]}></div>
          <div className={styles["loading-page-spin-b"]}></div>
        </motion.div>

        <motion.div
          className={styles["loading-paeg-dots"]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={styles["loading-page-dot"]}
              initial={{ y: 0, opacity: 0.6 }}
              animate={{
                y: -20,
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        <motion.p
          className={styles["loading-page-text"]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}
