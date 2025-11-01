"use client";

import { useSidebar } from "@/contexts";
import { CircleX } from "@/lib/client";
import styles from "@/styles/sidebar.module.css";

export function Sidebar() {
  const { isOpen, closeSidebar, content, showCloseButton, position, title, bgColor } = useSidebar();

  const sidebarClass = isOpen 
    ? position === "left" ? styles["sidebar-open-left"] : styles["sidebar-open-right"]
    : position === "left" ? styles["sidebar-close-left"] : styles["sidebar-close-right"];

  return (
    <>
      {isOpen && showCloseButton && (
        <div className={styles["overlay"]} onClick={closeSidebar} />
      )}
      <aside className={sidebarClass}>
        <div className={styles["sidebar-content"]}>
          <div className={styles["sidebar-header"]} style={{ backgroundColor: bgColor }}>
            <h2 className={styles["sidebar-title"]}>{title}</h2>
            {showCloseButton && (
              <button
                onClick={closeSidebar}
                className={styles["sidebar-close-btn"]}
                aria-label="Close sidebar"
              >
                <CircleX className={styles["sidebar-close-icon"]} />
              </button>
            )}
          </div>
          <div className={styles["sidebar-list-items"]}>{content}</div>
        </div>
      </aside>
    </>
  );
}
