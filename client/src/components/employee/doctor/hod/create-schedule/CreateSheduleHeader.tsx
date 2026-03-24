'use client';

import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";

import styles from "@/styles/admin.module.css";
import createScheduleStyles from "@/styles/create-schedule.module.css";

export function CreateSheduleHeader() {
    const { user } = useUserAuthContext();
    const doctor = user as Employee;

    return (
        <div className={styles["dashboard-header"] + " flex justify-between items-center"}>
            <div>
                <h1 className={styles["dashboard-title"]}>
                    Điều phối lịch trực
                </h1>
                <p className={styles["dashboard-subtitle"]}>
                    Chuyên khoa: {doctor?.specialization || "Đa khoa"}
                </p>
            </div>
            <button className={createScheduleStyles["auto-schedule-button"]}>
                Xếp lịch tự động
            </button>
      </div>
    );
}