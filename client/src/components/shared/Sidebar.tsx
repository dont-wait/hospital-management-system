"use client";

import { useSidebar } from "@/contexts";
import { CircleX } from "@/lib/client";
import styles from "@/styles/sidebar.module.css";

export function Sidebar() {
  const { isOpen, closeSidebar, content, showCloseButton, position, title, bgColor, closeButtonMode } = useSidebar();

  const sidebarClass = isOpen 
    ? position === "left" ? styles["sidebar-open-left"] : styles["sidebar-open-right"]
    : position === "left" ? styles["sidebar-close-left"] : styles["sidebar-close-right"];

  const closeButtonClass = closeButtonMode === "mobile-only" 
    ? `${styles["sidebar-close-btn"]} ${styles["sidebar-close-btn-mobile-only"]}`
    : styles["sidebar-close-btn"];

  return (
    <>
      {isOpen && (
        <div className={styles["overlay"]} onClick={closeSidebar} />
      )}
      <aside className={sidebarClass}>
        <div className={styles["sidebar-content"]}>
          <div className={styles["sidebar-header"]} style={{ backgroundColor: bgColor }}>
            <h2 className={styles["sidebar-title"]}>{title}</h2>
            {showCloseButton && closeButtonMode !== "never" && (
              <button
                onClick={closeSidebar}
                className={closeButtonClass}
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
