import doctorStyles from "@/styles/doctor.module.css";

interface DashboardQueueHeader {
  queueBadge: number;
}

export default function DashboardQueueHeader({
  queueBadge,
}: DashboardQueueHeader) {
  return (
    <div className={doctorStyles["queue-header"]}>
      <h2 className={doctorStyles["section-title"]}>Bệnh Nhân Đang Chờ Khám</h2>
      <span className={doctorStyles["queue-badge"]}>{queueBadge} người</span>
    </div>
  );
}
