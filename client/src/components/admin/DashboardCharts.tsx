import styles from "@/styles/admin.module.css";

export default function DashboardCharts() {
  return (
    <div className={styles["charts-section"]}>
      <div className={styles["chart-card"]}>
        <h2 className={styles["chart-title"]}>Thống Kê Bệnh Nhân Theo Tháng</h2>
        <div className={styles["chart-placeholder"]}>
          Biểu đồ sẽ được thêm ở đây
        </div>
      </div>
      <div className={styles["chart-card"]}>
        <h2 className={styles["chart-title"]}>Lịch Hẹn Theo Tuần</h2>
        <div className={styles["chart-placeholder"]}>
          Biểu đồ sẽ được thêm ở đây
        </div>
      </div>
    </div>
  );
}
