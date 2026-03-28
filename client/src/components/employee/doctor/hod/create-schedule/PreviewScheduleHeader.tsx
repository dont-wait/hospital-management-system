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
                        Lịch trực (Tuần {activeWeekIndex + 1}: {weekRangeLabel})
                    </p>
                    <p className={styles["preview-schedule-subtitle"]}>
                        Lịch trực được tạo tự động dựa trên các tiêu chí đã chọn.
                    </p>
                </div>
            </div>

            <div className={styles["preview-schedule-actions"]}>
                <button type="button" className={styles["preview-secondary-btn"]}>
                    <FileDown size={16} /> Xuất PDF
                </button>
            </div>
        </div>
    );
}
