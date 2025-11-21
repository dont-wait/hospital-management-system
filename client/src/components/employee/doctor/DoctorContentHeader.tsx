import styles from "@/styles/admin.module.css";
import { Employee } from "@/types";

interface DoctorContentHeaderProps {
  doctor: Employee;
}

export default function DoctorContentHeader({
  doctor,
}: DoctorContentHeaderProps) {
  return (
    <div className={styles["dashboard-header"]}>
      <h1 className={styles["dashboard-title"]}>
        Xin chào, BS. {doctor?.firstName} {doctor?.lastName}
      </h1>
      <p className={styles["dashboard-subtitle"]}>
        Chuyên khoa: {doctor?.specialization || "Đa khoa"} • Ca sáng (7:00 -
        15:00)
      </p>
    </div>
  );
}
