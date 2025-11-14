"use client";

import { useSidebar } from "@/contexts";
import SidebarCustomContent from "@/components/shared/SidebarCustomContent";
import { useSidebarByRole } from "@/hooks";
import { ReactNode } from "react";
import styles from "@/styles/admin.module.css";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
    const { openSidebar } = useSidebar();
    const sidebarContent = useSidebarByRole();

    return (
        <div className={styles["admin-layout"]}>
            <SidebarCustomContent content={sidebarContent} />
            
            <button
                onClick={openSidebar}
                className={styles["admin-button-sidebar"]}
                aria-label="Open menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            <main className={styles["admin-main"]}>
                {children}
            </main>
        </div>
    );
}
