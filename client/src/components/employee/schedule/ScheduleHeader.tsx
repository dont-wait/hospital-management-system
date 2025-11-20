"use client";

import scheduleStyles from "@/styles/schedule.module.css";
import styles from "@/styles/admin.module.css";
import { useUserAuthContext } from "@/contexts";
import { Employee } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
  DateUtils,
} from "@/lib/client";

interface ScheduleHeaderProps {
  changeWeek: (weeks: number) => void;
  isCheckedIn: boolean;
  checkInTime: string | null;
  handleCheckIn: () => void;
  selectedDate: Date;
}

export function ScheduleHeader({
  changeWeek,
  isCheckedIn,
  checkInTime,
  handleCheckIn,
  selectedDate,
}: ScheduleHeaderProps) {
  const { user } = useUserAuthContext();
  const doctor = user as Employee;

  return (
    <>
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
            <span>
              {DateUtils.getDisplayDateTime(
                selectedDate.toString(),
                "FullDate",
              )}
            </span>
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
    </>
  );
}

