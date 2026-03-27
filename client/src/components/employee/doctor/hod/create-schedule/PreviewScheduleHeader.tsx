import styles from "@/styles/create-schedule.module.css";
import { CalendarDays, FileDown } from "lucide-react";

interface PreviewScheduleHeaderProps {
    activeWeekIndex: number;
    weekRangeLabel: string;
}

export function PreviewScheduleHeader({
    activeWeekIndex,
    weekRangeLabel,
}: PreviewScheduleHeaderProps) {
    return (
        <div className={`${styles["schedule-container-header"]} ${styles["preview-schedule-header"]}`}>
            <div className={styles["preview-schedule-title-group"]}>
                <CalendarDays className={styles["preview-schedule-icon"]} />
                <div>
                    <p className={styles["preview-schedule-title"]}>
                        Xem trước lịch trực (Tuần {activeWeekIndex + 1}: {weekRangeLabel})
                    </p>
                    <p className={styles["preview-schedule-subtitle"]}>
                        Lịch trực dự kiến trong 1 tháng, tạo tự động theo ràng buộc hiện tại
                    </p>
                </div>
            </div>

            <div className={styles["preview-schedule-actions"]}>
                <button type="button" className={styles["preview-secondary-btn"]}>
                    <FileDown size={16} /> Xuất PDF
                </button>
                <button type="button" className={styles["preview-primary-btn"]}>
                    Áp dụng lịch trực
                </button>
            </div>
        </div>
    );
}
