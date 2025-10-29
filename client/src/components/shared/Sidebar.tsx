"use client";

import { useSidebar } from "@/contexts";
import { CircleX } from "@/lib/client";
import styles from "@/styles/sidebar.module.css";

export function Sidebar() {
  const { isOpen, closeSidebar, content } = useSidebar();

  return (
    <>
      {isOpen && <div className={styles["overlay"]} onClick={closeSidebar} />}
      <aside
        className={isOpen ? styles["sidebar-open"] : styles["sidebar-close"]}
      >
        <div className={styles["sidebar-content"]}>
          <div className={styles["sidebar-header"]}>
            <h2 className={styles["sidebar-title"]}>Cài đặt</h2>
            <button
              onClick={closeSidebar}
              className={styles["sidebar-close-btn"]}
              aria-label="Close sidebar"
            >
              <CircleX className={styles["sidebar-close-icon"]} />
            </button>
          </div>
          <div className={styles["sidebar-list-items"]}>{content}</div>
        </div>
      </aside>
    </>
  );
}
