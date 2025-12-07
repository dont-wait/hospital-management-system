"use client";

import { useSidebar } from "@/contexts";
import { X } from "lucide-react";
import styles from "@/styles/sidebar.module.css";

export function Sidebar() {
  const {
    isOpen,
    showOverlay,
    closeSidebar,
    content,
    showCloseButton,
    position,
    title,
    bgColor,
    closeButtonMode,
  } = useSidebar();

  const overlayStyles = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
    cursor: "pointer",
  };

  const sidebarClass = isOpen
    ? position === "left"
      ? styles["sidebar-open-left"]
      : styles["sidebar-open-right"]
    : position === "left"
      ? styles["sidebar-close-left"]
      : styles["sidebar-close-right"];

  const closeButtonClass =
    closeButtonMode === "mobile-only"
      ? `${styles["sidebar-close-btn"]} ${styles["sidebar-close-btn-mobile-only"]}`
      : styles["sidebar-close-btn"];

  return (
    <>
      {isOpen && showOverlay && (
        <div style={overlayStyles} onClick={closeSidebar} />
      )}
      <aside className={sidebarClass}>
        <div className={styles["sidebar-content"]}>
          <div
            className={styles["sidebar-header"]}
            style={{ backgroundColor: bgColor }}
          >
            <h2 className={styles["sidebar-title"]}>{title}</h2>
            {showCloseButton && closeButtonMode !== "never" && (
              <button
                onClick={closeSidebar}
                className={closeButtonClass}
                aria-label="Close sidebar"
              >
                <X className={styles["sidebar-close-icon"]} />
              </button>
            )}
          </div>
          <div className={styles["sidebar-list-items"]}>{content}</div>
        </div>
      </aside>
    </>
  );
}
