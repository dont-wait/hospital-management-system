'use client';
import styles from "@/styles/create-schedule.module.css";
import { FileUser } from "lucide-react";

export function ApproveLeaveRequest() {
    return (
        <div className={styles["schedule-container"] + " w-full lg:w-2/3"}>
            <div className={styles["schedule-container-header"]}>
        			<FileUser className="text-east-bay" /> Duyệt đơn xin nghỉ
            </div>
        </div>
    );
}