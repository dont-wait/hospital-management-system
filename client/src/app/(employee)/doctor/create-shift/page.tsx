'use client';

import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import styles from "@/styles/admin.module.css";
import dynamic from "next/dynamic";

const CreateShiftFormContainer = dynamic(
    () => import("@/components/employee/doctor/hod/CreateShiftFormContainer"),
    { 
        ssr: false,
        loading: () => (
            <div className={styles["admin-container"]}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    Đang tải...
                </div>
            </div>
        )
    }
);

export default function CreateShiftPage() {
    const { user } = useUserAuthContext();
    const hod = user as Employee;

    return (
        <div className={styles["admin-container"]}>
            <div className={styles["dashboard-header"]}>
                <h1 className={styles["dashboard-title"]}>
                    Tạo Ca Làm Việc
                </h1>
                <p className={styles["dashboard-subtitle"]}>
                    Khoa: {hod?.departmentName || "Đa khoa"}
                </p>
            </div>

            <CreateShiftFormContainer hod={hod} />
        </div>
    );
}
