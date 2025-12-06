"use client";
import scheduleStyles from "@/styles/schedule.module.css";
import { DoctorSchedule } from "@/types";
import { DateUtils } from "@/lib/client";
import Icon from "@/components/shared/Icon";

interface ScheduleContainerProps {
  todayShifts: DoctorSchedule[];
}

export default function ScheduleContainer({
  todayShifts,
}: ScheduleContainerProps) {
  const getComputedStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end < now) return "Completed";
    if (start > now) return "Scheduled";
    return "InProgress";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return (
          <div className="w-4 h-4">
            <Icon name="CircleAlert" className="w-4 h-4" />
          </div>
        );
      case "InProgress":
        return (
          <div className="w-4 h-4">
            <Icon name="Timer" className="w-4 h-4" />
          </div>
        );
      case "Completed":
        return (
          <div className="w-4 h-4">
            <Icon name="CircleCheck" className="w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Scheduled":
        return scheduleStyles["status-opened"];
      case "InProgress":
        return scheduleStyles["status-inprogress"];
      case "Completed":
        return scheduleStyles["status-closed"]; // màu xám
      default:
        return "";
    }
  };

  return (
    <div className={scheduleStyles["schedule-container"]}>
      <h2 className={scheduleStyles["section-title"]}>Lịch làm việc hôm nay</h2>

      {todayShifts.length === 0 ? (
        <div className={scheduleStyles["empty-state"]}>
          <p>Không có ca làm việc nào trong ngày</p>
        </div>
      ) : (
        <div className={scheduleStyles["schedule-list"]}>
          {todayShifts.map((shedule) => {
            const status = getComputedStatus(
              shedule.startTime,
              shedule.endTime,
            );

            return (
              <div
                key={shedule.scheduleId}
                className={scheduleStyles["schedule-card"]}
              >
                <div className={scheduleStyles["card-header"]}>
                  <h3 className={scheduleStyles["task-name"]}>
                    {shedule.name}
                  </h3>

                  <span
                    className={`${scheduleStyles["status-badge"]} ${getStatusClass(
                      status,
                    )}`}
                  >
                    {getStatusIcon(status)}
                    {status === "Scheduled"
                      ? "Sắp diễn ra"
                      : status === "InProgress"
                        ? "Đang diễn ra"
                        : "Đã kết thúc"}
                  </span>
                </div>

                <div className={scheduleStyles["card-body"]}>
                  <div className={scheduleStyles["time-info"]}>
                    <div className="w-4 h-4">
                      <Icon name="Clock" className="w-4 h-4" />
                    </div>
                    <span>
                      Thời gian:{" "}
                      {DateUtils.getDisplayDateTime(shedule.startTime, "Time")}{" "}
                      - {DateUtils.getDisplayDateTime(shedule.endTime, "Time")}
                    </span>
                  </div>

                  <p className={scheduleStyles["task-description"]}>
                    {shedule.description}
                  </p>
                </div>

                {shedule.scheduleStatus === "Canceled" && (
                  <div className={scheduleStyles["card-footer"]}>
                    <span className={scheduleStyles["canceled-text"]}>
                      <div className="w-4 h-4">
                        <Icon name="CircleX" className="w-4 h-4" />
                      </div>
                      Ca làm việc đã bị hủy
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
