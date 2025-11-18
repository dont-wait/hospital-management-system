'use client';

import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import { 
    Calendar, 
    Users, 
    Activity, 
    FileText, 
    Stethoscope
} from "@/lib/client";
import styles from "@/styles/admin.module.css";
import doctorStyles from "@/styles/doctor.module.css";

export default function DoctorDashboardPage() {
    const { user } = useUserAuthContext();
    const doctor = user as Employee;

    const quickStats = [
        { label: "BN khám tháng này", value: 142, icon: Users, color: "blue" },
        { label: "Ca khám hôm nay", value: 12, icon: Activity, color: "green" },
        { label: "Đơn thuốc đã kê", value: 8, icon: FileText, color: "purple" },
        { label: "Xét nghiệm yêu cầu", value: 5, icon: Stethoscope, color: "orange" },
        { label: "Ca tái khám", value: 3, icon: Calendar, color: "pink" },
        { label: "Đã hoàn thành", value: 5, icon: Activity, color: "teal" },
    ];

    const waitingQueue = [
        { id: 1, stt: 1, name: "Trần Thị B", symptoms: "Đau đầu, sốt nhẹ", appointmentType: "BHYT" },
        { id: 2, stt: 2, name: "Lê Văn C", symptoms: "Ho, khó thở", appointmentType: "DV Offline" },
        { id: 3, stt: 3, name: "Phạm Thị D", symptoms: "Đau bụng", appointmentType: "BHYT" },
        { id: 4, stt: 4, name: "Hoàng Văn E", symptoms: "Tái khám tiểu đường", appointmentType: "DV Online" },
    ];

    const appointmentTypeClassMap = {
        "BHYT": doctorStyles["type-insurance"],
        "DV Offline": doctorStyles["type-service-offline"],
        "DV Online": doctorStyles["type-service-online"]
    }

    return (
        <div className={styles["admin-container"]}>
            <div className={styles["dashboard-header"]}>
                <h1 className={styles["dashboard-title"]}>
                    Xin chào, BS. {doctor?.firstName} {doctor?.lastName}
                </h1>
                <p className={styles["dashboard-subtitle"]}>
                    Chuyên khoa: {doctor?.specialization || "Đa khoa"} • Ca sáng (7:00 - 15:00)
                </p>
            </div>

            <div className={doctorStyles["stats-section"]}>
                <h2 className={doctorStyles["section-title"]}>Thống Kê Nhanh</h2>
                <div className={doctorStyles["stats-grid"]}>
                    {quickStats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClass = doctorStyles[`stat-color-${stat.color}`];

                        return (
                            <div key={index} className={doctorStyles["stat-card"]}>
                                <div className={`${doctorStyles["stat-icon"]} ${colorClass}`}>
                                    <Icon size={24} />
                                </div>
                                <p className={doctorStyles["stat-value"]}>{stat.value}</p>
                                <p className={doctorStyles["stat-label"]}>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={doctorStyles["queue-container"]}>
                <div className={doctorStyles["queue-header"]}>
                    <h2 className={doctorStyles["section-title"]}>Bệnh Nhân Đang Chờ Khám</h2>
                    <span className={doctorStyles["queue-badge"]}>
                        {waitingQueue.length} người
                    </span>
                </div>
                <div className={doctorStyles["table-wrapper"]}>
                    <table className={doctorStyles["queue-table"]}>
                        <thead>
                            <tr className={doctorStyles["table-header-row"]}>
                                <th className={doctorStyles["table-header"]}>STT</th>
                                <th className={doctorStyles["table-header"]}>Tên Bệnh Nhân</th>
                                <th className={doctorStyles["table-header"]}>Triệu Chứng</th>
                                <th className={doctorStyles["table-header"]}>Loại khám</th>
                                <th className={`${doctorStyles["table-header"]} ${doctorStyles["text-center"]}`}>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitingQueue.map((patient) => {
                                const appointmentTypeClass = appointmentTypeClassMap[patient.appointmentType as keyof typeof appointmentTypeClassMap] || doctorStyles["type-default"];

                                return (
                                    <tr key={patient.id} className={doctorStyles["table-row"]}>
                                        <td className={doctorStyles["table-cell"]}>
                                            <span className={doctorStyles["stt-badge"]}>
                                                {patient.stt}
                                            </span>
                                        </td>
                                        <td className={`${doctorStyles["table-cell"]} ${doctorStyles["patient-name"]}`}>{patient.name}</td>
                                        <td className={`${doctorStyles["table-cell"]} ${doctorStyles["symptoms-text"]}`}>{patient.symptoms}</td>
                                        <td className={doctorStyles["table-cell"]}>
                                            <span className={`${doctorStyles["appointment-type-badge"]} ${appointmentTypeClass}`}>
                                                {patient.appointmentType}
                                            </span>
                                        </td>
                                        <td className={`${doctorStyles["table-cell"]} ${doctorStyles["text-center"]}`}>
                                            <button className={doctorStyles["start-btn"]}>
                                                <Stethoscope size={16} />
                                                <span>Bắt đầu khám</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}