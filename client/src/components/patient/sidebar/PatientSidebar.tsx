"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useUserAuthContext, useSidebar } from "@/contexts";
import { LogOut, LogIn } from "@/lib/client";
import { PatientSidebarItems, patientSidebarVariants } from "@/config";
import styles from "@/styles/patient.module.css";

export function PatientSidebar() {
  const { logout, isAuthenticated } = useUserAuthContext();
  const { closeSidebar } = useSidebar();
  const router = useRouter();
  const handleItemClick = (route: string) => {
    if (route === "/logout") {
      logout();
    } else {
      router.push(route);
    }
    closeSidebar();
  };

  return (
    <div className={styles["patient-sidebar-body"]}>
      <nav className={styles["patient-sidebar-content"]}>
        {PatientSidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={index}
              custom={index}
              variants={patientSidebarVariants}
              initial="hidden"
              animate="visible"
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleItemClick(item.route);
              }}
              className={styles["patient-sidebar-items"]}
            >
              <div className={styles["patient-sidebar-item"]}>
                <Icon
                  size={20}
                  className={styles["patient-sidebar-item-icon"]}
                />
              </div>
              <span className="flex-1 text-left font-medium">{item.title}</span>
            </motion.button>
          );
        })}
      </nav>
      <div className={styles["patient-sidebar-footer"]}>
        {!isAuthenticated ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              handleItemClick("/login");
            }}
            className={styles["patient-sidebar-items"]}
          >
            <div className={styles["patient-sidebar-item"]}>
              <LogIn
                size={20}
                className={styles["patient-sidebar-item-icon"]}
              />
            </div>
            <span className="flex-1 text-left font-medium">Đăng Nhập</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              handleItemClick("/logout");
            }}
            className={styles["logout-btn"]}
          >
            <div className={styles["logout-btn-wrap"]}>
              <LogOut
                size={20}
                className={styles["patient-sidebar-item-icon"]}
              />
            </div>
            <span className={styles["patient-sidebar-item-title"]}>
              Đăng Xuất
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
