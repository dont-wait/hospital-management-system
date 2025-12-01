"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useUserAuthContext } from "@/contexts";
import { Button } from "@/components";
import { ArrowRight } from "@/lib/client";
import styles from "@/styles/home.module.css";

function Banner() {
  const { isAuthenticated, user } = useUserAuthContext();
  return (
    <motion.section
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={styles["banner-card"]}
    >
      <div className={styles["banner-content"]}>
        <h1 className={styles["banner-header"]}>
          Chào mừng đến với bệnh viện MediCare
        </h1>
        <p className={styles["banner-description"]}>
          Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.
          <br /> Trải nghiệm dịch vụ chăm sóc y tế đẳng cấp thế giới với đội ngũ
          chuyên gia tận tâm, cơ sở vật chất hiện đại và các dịch vụ chăm sóc
          sức khỏe toàn diện.
        </p>

        {!isAuthenticated ? (
          <div className={styles["banner-buttons"]}>
            <Link href="/register">
              <Button size="lg">
                Bắt đầu ngay
                <ArrowRight className={styles["icon"]} />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Đăng nhập
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={styles["banner-buttons-wrap"]}>
              {user && "employeeId" in user && (
                <Link href="/doctor">
                  <Button size="lg">
                    Đi tới Bảng điều khiển Bác sĩ
                    <ArrowRight className={styles["icon"]} />
                  </Button>
                </Link>
              )}
              {user && "patientId" in user && (
                <Link href="/patient">
                  <Button size="lg">
                    Đi tới Cổng thông tin Bệnh nhân
                    <ArrowRight className={styles["icon"]} />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default Banner;
