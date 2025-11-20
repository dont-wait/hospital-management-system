import Icon from "@/components/shared/Icon";
import styles from "@/styles/admin.module.css";

export default function DashboardHistory() {
  return (
    <div className={styles["recent-activity"]}>
      <h2 className={styles["activity-title"]}>Hoạt Động Gần Đây</h2>
      <div className={styles["activity-list"]}>
        <div className={styles["activity-item"]}>
          <div className={styles["activity-icon"]}>
            <Icon name="UserRound" size={16} />
          </div>
          <div className={styles["activity-content"]}>
            <p className={styles["activity-text"]}>
              Bệnh nhân mới <strong>Nguyễn Văn A</strong> đã đăng ký
            </p>
            <span className={styles["activity-time"]}>5 phút trước</span>
          </div>
        </div>
        <div className={styles["activity-item"]}>
          <div className={styles["activity-icon"]}>
            <Icon name="Calendar" size={16} />
          </div>
          <div className={styles["activity-content"]}>
            <p className={styles["activity-text"]}>
              Lịch hẹn mới với <strong>BS. Trần Thị B</strong>
            </p>
            <span className={styles["activity-time"]}>15 phút trước</span>
          </div>
        </div>
        <div className={styles["activity-item"]}>
          <div className={styles["activity-icon"]}>
            <Icon name="Activity" size={16} />
          </div>
          <div className={styles["activity-content"]}>
            <p className={styles["activity-text"]}>
              Cập nhật hồ sơ bệnh nhân <strong>Lê Văn C</strong>
            </p>
            <span className={styles["activity-time"]}>1 giờ trước</span>
          </div>
        </div>
        <div className={styles["activity-item"]}>
          <div className={styles["activity-icon"]}>
            <Icon name="Clock" size={16} />
          </div>
          <div className={styles["activity-content"]}>
            <p className={styles["activity-text"]}>
              Lịch hẹn đã hoàn thành với <strong>Phạm Thị D</strong>
            </p>
            <span className={styles["activity-time"]}>2 giờ trước</span>
          </div>
        </div>
      </div>
    </div>
  );
}
