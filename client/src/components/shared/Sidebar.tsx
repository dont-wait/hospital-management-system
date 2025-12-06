"use client";

import { useSidebar } from "@/contexts";
import { X } from "lucide-react";

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

  const sidebarStyles = {
    position: "fixed" as const,
    top: 0,
    height: "calc(100vh 64px)",
    width: "320px",
    backgroundColor: "white",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease",
    zIndex: 999,
    display: "flex",
    flexDirection: "column" as const,
    ...(position === "left" ? { left: 0 } : { right: 0 }),
    transform: isOpen
      ? "translateX(0)"
      : position === "left"
        ? "translateX(-100%)"
        : "translateX(100%)",
  };

  const overlayStyles = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 998,
    cursor: "pointer",
  };

  const headerStyles = {
    backgroundColor: bgColor,
    color: "white",
    padding: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const closeButtonStyles = {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.375rem",
    transition: "background-color 0.2s",
  };

  const contentStyles = {
    flex: 1,
    overflowY: "auto" as const,
    padding: "1.5rem",
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const shouldShowCloseButton =
    showCloseButton &&
    (closeButtonMode === "always" ||
      (closeButtonMode === "mobile-only" && isMobile));

  return (
    <>
      {isOpen && showOverlay && (
        <div style={overlayStyles} onClick={closeSidebar} />
      )}
      <aside style={sidebarStyles}>
        <div style={headerStyles}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
            {title}
          </h2>
          {shouldShowCloseButton && (
            <button
              onClick={closeSidebar}
              style={closeButtonStyles}
              aria-label="Close sidebar"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <X size={24} />
            </button>
          )}
        </div>
        <div style={contentStyles}>{content}</div>
      </aside>
    </>
  );
}
