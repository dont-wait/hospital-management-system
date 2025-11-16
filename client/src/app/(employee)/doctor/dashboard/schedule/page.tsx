'use client';

import { useState, useMemo } from "react";
import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import { 
    Calendar, 
    Clock, 
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "@/lib/client";
import { formatDateDisplay, formatTime, isSameDate } from "@/lib/client";
import styles from "@/styles/admin.module.css";
import scheduleStyles from "@/styles/schedule.module.css";

interface WorkShift {
    id: number;
    name: string;
    startTime: string; // ISO datetime string
    endTime: string;   // ISO datetime string
    description: string;
    shiftStatus: 'Scheduled' | 'Completed' | 'Canceled';
}

export default function DoctorSchedulePage() {
    const { user } = useUserAuthContext();
    const doctor = user as Employee;
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);

    // Mock data - thay bằng API call thực tế (1 tháng dữ liệu)
    const allWorkShifts: WorkShift[] = [
        // Tuần 1
        {
            id: 1,
            name: "Ca sáng",
            startTime: "2025-11-16T07:00:00",
            endTime: "2025-11-16T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 2,
            name: "Ca chiều",
            startTime: "2025-11-16T13:00:00",
            endTime: "2025-11-16T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 3,
            name: "Ca sáng",
            startTime: "2025-11-17T07:00:00",
            endTime: "2025-11-17T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 4,
            name: "Ca chiều",
            startTime: "2025-11-17T13:00:00",
            endTime: "2025-11-17T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 5,
            name: "Ca sáng",
            startTime: "2025-11-18T07:00:00",
            endTime: "2025-11-18T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Completed"
        },
        {
            id: 6,
            name: "Ca chiều",
            startTime: "2025-11-18T13:00:00",
            endTime: "2025-11-18T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Completed"
        },
        // Tuần 2
        {
            id: 7,
            name: "Ca sáng",
            startTime: "2025-11-19T07:00:00",
            endTime: "2025-11-19T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Completed"
        },
        {
            id: 8,
            name: "Ca chiều",
            startTime: "2025-11-20T13:00:00",
            endTime: "2025-11-20T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 9,
            name: "Ca sáng",
            startTime: "2025-11-21T07:00:00",
            endTime: "2025-11-21T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 10,
            name: "Ca chiều",
            startTime: "2025-11-21T13:00:00",
            endTime: "2025-11-21T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 11,
            name: "Ca sáng",
            startTime: "2025-11-22T07:00:00",
            endTime: "2025-11-22T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        // Tuần 3
        {
            id: 12,
            name: "Ca chiều",
            startTime: "2025-11-23T13:00:00",
            endTime: "2025-11-23T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 13,
            name: "Ca sáng",
            startTime: "2025-11-24T07:00:00",
            endTime: "2025-11-24T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Canceled"
        },
        {
            id: 14,
            name: "Ca chiều",
            startTime: "2025-11-25T13:00:00",
            endTime: "2025-11-25T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 15,
            name: "Ca sáng",
            startTime: "2025-11-26T07:00:00",
            endTime: "2025-11-26T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 16,
            name: "Ca chiều",
            startTime: "2025-11-26T13:00:00",
            endTime: "2025-11-26T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        // Tuần 4
        {
            id: 17,
            name: "Ca sáng",
            startTime: "2025-11-27T07:00:00",
            endTime: "2025-11-27T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 18,
            name: "Ca chiều",
            startTime: "2025-11-28T13:00:00",
            endTime: "2025-11-28T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 19,
            name: "Ca sáng",
            startTime: "2025-11-29T07:00:00",
            endTime: "2025-11-29T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 20,
            name: "Ca chiều",
            startTime: "2025-11-29T13:00:00",
            endTime: "2025-11-29T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 21,
            name: "Ca sáng",
            startTime: "2025-11-30T07:00:00",
            endTime: "2025-11-30T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        // Thêm tháng 12
        {
            id: 22,
            name: "Ca sáng",
            startTime: "2025-12-01T07:00:00",
            endTime: "2025-12-01T12:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
        {
            id: 23,
            name: "Ca chiều",
            startTime: "2025-12-01T13:00:00",
            endTime: "2025-12-01T17:00:00",
            description: "Khám bệnh ngoại trú - Phòng khám số 3",
            shiftStatus: "Scheduled"
        },
    ];

    // Lọc ca làm việc theo ngày được chọn
    const todayShifts = useMemo(() => {
        return allWorkShifts.filter(shift => {
            const shiftDate = new Date(shift.startTime);
            return isSameDate(shiftDate, selectedDate);
        });
    }, [selectedDate, allWorkShifts]);

    const handleCheckIn = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        setCheckInTime(timeString);
        setIsCheckedIn(true);
    };

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
        setIsCheckedIn(false);
        setCheckInTime(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return <AlertCircle size={18} />;
            case 'Completed':
                return <CheckCircle size={18} />;
            case 'Canceled':
                return <XCircle size={18} />;
            default:
                return null;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return scheduleStyles['status-opened'];
            case 'Completed':
                return scheduleStyles['status-closed'];
            case 'Canceled':
                return scheduleStyles['status-canceled'];
            default:
                return '';
        }
    };

    return (
        <div className={styles["admin-container"]}>
            <div className={styles["dashboard-header"]}>
                <h1 className={styles["dashboard-title"]}>
                    Lịch Làm Việc - BS. {doctor?.firstName} {doctor?.lastName}
                </h1>
                <p className={styles["dashboard-subtitle"]}>
                    Chuyên khoa: {doctor?.specialization || "Đa khoa"}
                </p>
            </div>

            {/* Date Navigation & Check-in */}
            <div className={scheduleStyles["date-section"]}>
                <div className={scheduleStyles["date-navigation"]}>
                    <button 
                        onClick={() => changeDate(-1)}
                        className={scheduleStyles["nav-btn"]}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className={scheduleStyles["date-display"]}>
                        <Calendar size={20} />
                        <span>{formatDateDisplay(selectedDate)}</span>
                    </div>
                    <button 
                        onClick={() => changeDate(1)}
                        className={scheduleStyles["nav-btn"]}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className={scheduleStyles["checkin-section"]}>
                    {!isCheckedIn ? (
                        <button 
                            onClick={handleCheckIn}
                            className={scheduleStyles["checkin-btn"]}
                        >
                            <Clock size={20} />
                            <span>Chấm Công</span>
                        </button>
                    ) : (
                        <div className={scheduleStyles["checkin-status"]}>
                            <CheckCircle size={20} />
                            <span>Đã chấm công lúc {checkInTime}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Work Shifts List */}
            <div className={scheduleStyles["schedule-container"]}>
                <h2 className={scheduleStyles["section-title"]}>
                    Ca Làm Việc ({todayShifts.length} ca)
                </h2>
                
                {todayShifts.length === 0 ? (
                    <div className={scheduleStyles["empty-state"]}>
                        <Calendar size={48} />
                        <p>Không có ca làm việc nào trong ngày này</p>
                    </div>
                ) : (
                    <div className={scheduleStyles["schedule-list"]}>
                        {todayShifts.map((shift) => (
                            <div 
                                key={shift.id} 
                                className={scheduleStyles["schedule-card"]}
                            >
                                <div className={scheduleStyles["card-header"]}>
                                    <h3 className={scheduleStyles["task-name"]}>{shift.name}</h3>
                                    <span className={`${scheduleStyles["status-badge"]} ${getStatusClass(shift.shiftStatus)}`}>
                                        {getStatusIcon(shift.shiftStatus)}
                                        <span>{shift.shiftStatus}</span>
                                    </span>
                                </div>

                                <div className={scheduleStyles["card-body"]}>
                                    <div className={scheduleStyles["time-info"]}>
                                        <Clock size={16} />
                                        <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                                    </div>
                                    <p className={scheduleStyles["task-description"]}>
                                        {shift.description}
                                    </p>
                                </div>

                                <div className={scheduleStyles["card-footer"]}>
                                    {shift.shiftStatus === 'Scheduled' && (
                                        <>
                                            <button className={scheduleStyles["action-btn-complete"]}>
                                                <CheckCircle size={16} />
                                                <span>Hoàn thành ca</span>
                                            </button>
                                            <button className={scheduleStyles["action-btn-cancel"]}>
                                                <XCircle size={16} />
                                                <span>Hủy ca</span>
                                            </button>
                                        </>
                                    )}
                                    {shift.shiftStatus === 'Completed' && (
                                        <span className={scheduleStyles["completed-text"]}>
                                            ✓ Đã hoàn thành
                                        </span>
                                    )}
                                    {shift.shiftStatus === 'Canceled' && (
                                        <span className={scheduleStyles["canceled-text"]}>
                                            ✗ Đã hủy
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}