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
    startTime: string; 
    endTime: string;   
    description: string;
    shiftStatus: 'Scheduled' | 'Completed' | 'Canceled';
}

export default function DoctorSchedulePage() {
    const { user } = useUserAuthContext();
    const doctor = user as Employee;
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);

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

    const getWeekDays = (date: Date) => {
        const current = new Date(date);
        const day = current.getDay();
        const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh để Thứ 2 là ngày đầu tuần
        
        const monday = new Date(current.setDate(diff));
        const weekDays = [];
        
        for (let i = 0; i < 7; i++) {
            const weekDay = new Date(monday);
            weekDay.setDate(monday.getDate() + i);
            weekDays.push(weekDay);
        }
        
        return weekDays;
    };

    const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

    // Lọc ca làm việc theo tuần
    const weekShifts = useMemo(() => {
        const shiftsMap = new Map<string, WorkShift[]>();
        
        weekDays.forEach(day => {
            const dayKey = day.toDateString();
            const dayShifts = allWorkShifts.filter(shift => {
                const shiftDate = new Date(shift.startTime);
                return isSameDate(shiftDate, day);
            });
            shiftsMap.set(dayKey, dayShifts);
        });
        
        return shiftsMap;
    }, [weekDays, allWorkShifts]);

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

    const changeWeek = (weeks: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (weeks * 7));
        setSelectedDate(newDate);
        setIsCheckedIn(false);
        setCheckInTime(null);
    };

    const selectDate = (date: Date) => {
        setSelectedDate(date);
        setIsCheckedIn(false);
        setCheckInTime(null);
    };

    const getDayName = (date: Date) => {
        return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    };

    const getDayMonth = (date: Date) => {
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
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

            <div className={scheduleStyles["date-section"]}>
                <div className={scheduleStyles["date-navigation"]}>
                    <button 
                        onClick={() => changeWeek(-1)}
                        className={scheduleStyles["nav-btn"]}
                        title="Tuần trước"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className={scheduleStyles["date-display"]}>
                        <Calendar size={20} />
                        <span>{formatDateDisplay(selectedDate)}</span>
                    </div>
                    <button 
                        onClick={() => changeWeek(1)}
                        className={scheduleStyles["nav-btn"]}
                        title="Tuần sau"
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

            <div className={scheduleStyles["week-calendar"]}>
                {weekDays.map((day, index) => {
                    const isSelected = isSameDate(day, selectedDate);
                    const isToday = isSameDate(day, new Date());
                    const dayShifts = weekShifts.get(day.toDateString()) || [];
                    
                    return (
                        <button
                            key={index}
                            onClick={() => selectDate(day)}
                            className={`${scheduleStyles["day-card"]} ${isSelected ? scheduleStyles["day-selected"] : ""} ${isToday ? scheduleStyles["day-today"] : ""}`}
                        >
                            <div className={scheduleStyles["day-header"]}>
                                <span className={scheduleStyles["day-name"]}>{getDayName(day)}</span>
                                <span className={scheduleStyles["day-date"]}>{getDayMonth(day)}</span>
                            </div>
                            <div className={scheduleStyles["day-shifts"]}>
                                {dayShifts.length > 0 ? (
                                    <span className={scheduleStyles["shift-count"]}>{dayShifts.length} ca</span>
                                ) : (
                                    <span className={scheduleStyles["no-shift"]}>Nghỉ</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className={scheduleStyles["schedule-container"]}>
                <h2 className={scheduleStyles["section-title"]}>
                    Lịch làm việc hôm nay
                </h2>
                
                {todayShifts.length === 0 ? (
                    <div className={scheduleStyles["empty-state"]}>
                        <p>Không có ca làm việc nào trong ngày</p>
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
                                        {shift.shiftStatus === 'Scheduled' ? 'Sắp diễn ra' :
                                         shift.shiftStatus === 'Completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                                    </span>
                                </div>

                                <div className={scheduleStyles["card-body"]}>
                                    <div className={scheduleStyles["time-info"]}>
                                        <Clock size={18} />
                                        <span>Thời gian: {formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                                    </div>
                                    <p className={scheduleStyles["task-description"]}>
                                        {shift.description}
                                    </p>
                                </div>

                                <div className={scheduleStyles["card-footer"]}>
                                    {shift.shiftStatus === 'Scheduled' && (
                                        <>
                                            <button className={scheduleStyles["action-btn-complete"]}>
                                                Hoàn thành
                                            </button>
                                            <button className={scheduleStyles["action-btn-cancel"]}>
                                                Hủy ca
                                            </button>
                                        </>
                                    )}

                                    {shift.shiftStatus === 'Completed' && (
                                        <span className={scheduleStyles["completed-text"]}>
                                            <CheckCircle size={18} />
                                            Ca làm việc đã hoàn thành
                                        </span>
                                    )}

                                    {shift.shiftStatus === 'Canceled' && (
                                        <span className={scheduleStyles["canceled-text"]}>
                                            <XCircle size={18} />
                                            Ca làm việc đã bị hủy
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