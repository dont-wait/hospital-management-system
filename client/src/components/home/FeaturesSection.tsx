"use client";

import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { features } from "@/config";
import styles from "@/styles/home.module.css";

export default function FeaturesSection() {
  return (
    <motion.section
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={styles["feature-section"]}
    >
      <div className={styles["feature-content"]}>
        <h2 className={styles["feature-header"]}>
          Tại sao chọn bệnh viện MediCare?
        </h2>

        <div className={styles["feature-body"]}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className={styles["feature-title"]}>
                <CardHeader>
                  <Icon
                    className={`${feature.color} ${styles["feature-icon"]}`}
                  />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
