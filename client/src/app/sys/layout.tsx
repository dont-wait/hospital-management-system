import { ReactNode } from "react";
import { UserManagementProvider } from "@/contexts";
import styles from "@/styles/admin.module.css";
import SysAdminSidebar from "@/components/sysadmin/SysAdminSidebar";

export default function SysAdminLayout({ children }: { children: ReactNode }) {
  return (
    <UserManagementProvider>
      <div className={styles["admin-layout"]}>
        <SysAdminSidebar />
        <main className={styles["admin-main"]}>
          {children}
        </main>
      </div>
    </UserManagementProvider>
  );
}
