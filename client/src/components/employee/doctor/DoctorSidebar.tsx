"use client";

import SidebarCustomContent from "@/components/shared/SidebarCustomContent";
import Icon from "@/components/shared/Icon";
import { useSidebar } from "@/contexts";
import { useSidebarByRole } from "@/hooks";
import styles from "@/styles/admin.module.css";

export default function DoctorSidebar() {
  const { openSidebar } = useSidebar();
  const sidebarContent = useSidebarByRole();
  return (
    <>
      <SidebarCustomContent content={sidebarContent} />

      <button
        onClick={openSidebar}
        className={styles["admin-button-sidebar"]}
        aria-label="Open menu"
      >
        <Icon name="Menu" className="w-6 h-6" />
      </button>
    </>
  );
}
