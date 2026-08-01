import { Suspense } from "react";
import { ScheduleResultDashboard } from "@/components/employee/doctor/hod/schedule-result/ScheduleResultDashboard";
import styles from "@/styles/admin.module.css";

interface ScheduleResultDetailPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export default async function ScheduleResultDetailPage({
  params,
}: ScheduleResultDetailPageProps) {
  const { requestId } = await params;

  return (
    <div className={styles["admin-container"]}>
      <Suspense
        fallback={
          <section className="glass mx-auto max-w-7xl p-8 text-center">
            <p className="text-muted-foreground">Đang tải...</p>
          </section>
        }
      >
        <ScheduleResultDashboard requestId={requestId} />
      </Suspense>
    </div>
  );
}
