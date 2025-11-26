import { ReactNode } from "react";
import DoctorSidebar from "@/components/employee/doctor/DoctorSidebar";
import styles from "@/styles/admin.module.css";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles["admin-layout"]}>
      <DoctorSidebar />
      <main className={styles["admin-main"]}>{children}</main>
    </div>
  );
}
