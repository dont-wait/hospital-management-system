import { Suspense } from "react";
import { ScheduleResultDashboard } from "@/components/employee/doctor/hod/schedule-result/ScheduleResultDashboard";
import styles from "@/styles/admin.module.css";

export default function ScheduleResultPage() {
  return (
    <div className={styles["admin-container"]}>
      <Suspense
        fallback={
          <section className="glass mx-auto max-w-7xl p-8 text-center">
            <p className="text-muted-foreground">Đang tải...</p>
          </section>
        }
      >
        <ScheduleResultDashboard />
      </Suspense>
    </div>
  );
}
