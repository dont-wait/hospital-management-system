'use client'
import scheduleStyles from "@/styles/schedule.module.css";
import { WorkShift } from "@/types";
import { 
    Clock, 
    CheckCircle,
    XCircle,
    AlertCircle,
    formatTime
} from "@/lib/client";

interface ScheduleContainerProps {
    todayShifts: WorkShift[];
}


export function ScheduleContainer({ todayShifts }: ScheduleContainerProps) {
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

    const getAttendanceStatusInfo = (attendanceStatus?: string, actualCheckInTime?: string) => {
        switch (attendanceStatus) {
            case 'checked-in':
                return {
                    icon: <CheckCircle size={18} />,
                    text: `Đã chấm công${actualCheckInTime ? ` lúc ${actualCheckInTime}` : ''}`,
                    className: scheduleStyles['attendance-checked-in']
                };
            case 'late':
                return {
                    icon: <AlertCircle size={18} />,
                    text: `Đi trễ - Chấm công lúc ${actualCheckInTime || 'N/A'}`,
                    className: scheduleStyles['attendance-late']
                };
            case 'not-checked-in':
                return {
                    icon: <XCircle size={18} />,
                    text: 'Chưa chấm công',
                    className: scheduleStyles['attendance-not-checked']
                };
            case 'checked-out':
                return {
                    icon: <CheckCircle size={18} />,
                    text: `Đã hoàn thành ca - Chấm công lúc ${actualCheckInTime || 'N/A'}`,
                    className: scheduleStyles['attendance-checked-out']
                };
            default:
                return {
                    icon: <Clock size={18} />,
                    text: 'Chưa có thông tin',
                    className: scheduleStyles['attendance-not-checked']
                };
        }
    };

    return (
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
                    {todayShifts.map((shift) => {
                        const attendanceStatusInfo = getAttendanceStatusInfo(shift.attendanceStatus, shift.actualCheckInTime);

                        return (
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
                                    {shift.shiftStatus === 'Canceled' ? (
                                        <span className={scheduleStyles["canceled-text"]}>
                                            <XCircle size={18} />
                                            Ca làm việc đã bị hủy
                                        </span>
                                    ) : (
                                        <div className={scheduleStyles["attendance-info"]}>
                                            <span className={attendanceStatusInfo.className}>
                                                {attendanceStatusInfo.icon}
                                                {attendanceStatusInfo.text}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}