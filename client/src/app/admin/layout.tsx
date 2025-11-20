import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserDetailModal from "@/components/admin/UserDetailModal";
import UserUpdateModal from "@/components/admin/UserUpdateModal";
import { UserManagementProvider } from "@/contexts";
import styles from "@/styles/admin.module.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <UserManagementProvider>
      <div className={styles["admin-layout"]}>
        <AdminSidebar />
        <main className={styles["admin-main"]}>
          {children}
          <UserDetailModal />
          <UserUpdateModal />
        </main>
      </div>
    </UserManagementProvider>
  );
}
