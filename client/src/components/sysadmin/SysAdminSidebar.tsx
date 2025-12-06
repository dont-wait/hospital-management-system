"use client";

import { useMemo } from "react";
import SidebarCustomContent from "@/components/shared/SidebarCustomContent";
import SysAdminSidebarBody from "./SysAdminSidebarBody";
import Icon from "@/components/shared/Icon";
import { useSidebar } from "@/contexts";
import styles from "@/styles/admin.module.css";

export default function SysAdminSidebar() {
  const { openSidebar } = useSidebar();
  const sidebarBody = useMemo(() => <SysAdminSidebarBody />, []);

  return (
    <>
      <SidebarCustomContent content={sidebarBody} />
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
