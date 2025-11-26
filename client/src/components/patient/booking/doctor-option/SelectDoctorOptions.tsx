"use client";

import { formatDateTime } from "@/lib/client";
import { useBookingExamContext } from "@/contexts";
import { Schedule, DateTime } from "@/types";

interface SelectDoctorOptionsProps {
  schedules: Schedule[];
  price: number;
}

export default function SelectDoctorOptions({
  schedules,
  price,
}: SelectDoctorOptionsProps) {
  const { changeToStepThree } = useBookingExamContext();
  return (
    <>
      {schedules.map((schedule) => {
        const start: unknown = formatDateTime(schedule.startTime);
        const end: unknown = formatDateTime(schedule.endTime);
        return (
          <div
            key={schedule.scheduleId}
            className="w-full rounded-xl border bg-white p-4 text-left shadow-sm"
          >
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-martinique">
                {schedule.fullName}
              </h3>
            </div>

            <div className="flex flex-wrap gap-1">
              {schedule.slots.map((slot) =>
                slot.slotStatus === "Opened" ? (
                  <button
                    key={slot.slotId}
                    onClick={() => {
                      changeToStepThree(
                        {
                          doctorId: schedule.doctorId,
                          specialization: schedule.specialization,
                          fullName: schedule.fullName,
                        },
                        schedule.departmentId,
                        schedule.departmentName,
                        typeof start !== "string"
                          ? (start as DateTime).date
                          : start,
                        slot.slotId,
                        `${slot.slotStartTime} - ${slot.slotEndTime}`,
                        schedule.roomName,
                        price,
                      );
                    }}
                    className="px-3 py-1.5 rounded-sm text-sm font-medium border bg-green-50 border-green-300 text-green-700"
                  >
                    {slot.slotStartTime} – {slot.slotEndTime}
                  </button>
                ) : (
                  <div
                    key={slot.slotId}
                    className="px-3 py-1.5 rounded-sm text-sm font-medium border bg-gray-100 border-gray-300 text-gray-500"
                  >
                    {slot.slotStartTime} – {slot.slotEndTime}
                  </div>
                ),
              )}
            </div>

            <div className="space-y-1">
              <p className="text-east-bay py-2">
                <span className="font-medium">
                  {schedule.specialization} -{" "}
                </span>
                <span>{schedule.roomName}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-east-bay">
              <span className="text-east-bay font-medium">
                {typeof start !== "string" && typeof end !== "string"
                  ? `${(start as DateTime).time} – ${(end as DateTime).time} • ${(start as DateTime).date}`
                  : `${schedule.startTime} – ${schedule.endTime}`}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
