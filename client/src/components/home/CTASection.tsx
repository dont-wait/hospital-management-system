"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/shared/Button";
import { ArrowRight } from "@/lib/client";
import styles from "@/styles/home.module.css";

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={styles["banner-card"]}
    >
      <div className={styles["banner-content"]}>
        <h2 className={styles["banner-header"]}>
          Sẵn sàng trải nghiệm dịch vụ chăm sóc sức khỏe chất lượng?
        </h2>
        <p className={styles["banner-description"]}>
          Tham gia cùng hàng nghìn bệnh nhân tin tưởng Bệnh viện MediCare cho
          nhu cầu chăm sóc sức khỏe của họ.
        </p>
        <Link href="/register">
          <Button size="lg">
            Đăng ký ngay hôm nay
            <ArrowRight className={styles["icon"]} />
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
