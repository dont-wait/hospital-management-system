"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useUserAuthContext } from "@/contexts";
import { LogOut, LogIn } from "@/lib/client";
import { DoctorSidebarItems, patientSidebarVariants } from "@/config";
import styles from "@/styles/admin.module.css";

export function DoctorSidebar() {
  const { logout, isAuthenticated } = useUserAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleItemClick = (route: string) => {
    if (route === "/logout") {
      logout();
    } else {
      router.push(route);
    }
  };

  return (
    <div className={styles["admin-sidebar-body"]}>
      <nav className={styles["admin-sidebar-content"]}>
        {DoctorSidebarItems.map((item, index) => {
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
              className={styles["admin-sidebar-items"] + `${item.route === pathname ? ` ${styles["active"]}` : ""}`}
            >
              <div className={styles["admin-sidebar-item"]}>
                <Icon
                  size={20}
                  className={styles["admin-sidebar-item-icon"]}
                />
              </div>
              <span className={styles["admin-sidebar-item-title"]}>{item.title}</span>
            </motion.button>
          );
        })}
      </nav>
      <div className={styles["admin-sidebar-footer"]}>
        {!isAuthenticated ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              handleItemClick("/login");
            }}
            className={styles["admin-sidebar-items"]}
          >
            <div className={styles["admin-sidebar-item"]}>
              <LogIn
                size={20}
                className={styles["admin-sidebar-item-icon"]}
              />
            </div>
            <span className={styles["admin-sidebar-item-title"]}>Đăng Nhập</span>
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
                className={styles["admin-sidebar-item-icon"]}
              />
            </div>
            <span className={styles["admin-sidebar-item-title"]}>
              Đăng Xuất
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
