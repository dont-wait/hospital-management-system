'use client';
import styles from "@/styles/create-schedule.module.css";
import { FileUser } from "lucide-react";

export function ApproveLeaveRequest() {
    return (
        <div className={`${styles["schedule-container"]} ${styles["approve-leave-container"]}`}>
            <div className={`${styles["schedule-container-header"]} ${styles["approve-leave-header"]}`}>
					<div className={styles["approve-leave-title-group"]}>
							<FileUser className={styles["approve-leave-icon"]} /> Duyệt đơn xin nghỉ
						</div>
							<div className={styles["schedule-container-header-badge"]}>
								2 yêu cầu mới
							</div>
            </div>
        </div>
    );
}