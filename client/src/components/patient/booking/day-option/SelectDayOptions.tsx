"use client";

import { useMemo } from "react";
import { createDays } from "@/lib/client";
import { months } from "@/config/DateConfig";
import { useBookingExamContext } from "@/contexts";
import { CalendarDay } from "@/types";

export default function SelectDayOptions() {
  const { setDate } = useBookingExamContext();
  const currentMonth = useMemo(() => new Date(), []);
  const days: (CalendarDay | null)[] = useMemo(
    () => createDays(currentMonth),
    [currentMonth],
  );
  return (
    <div className="grid grid-cols-1">
      <div
        className="
        flex items-center justify-center mb-1 text-east-bay font-bold text-2xl 
        md:text-3xl py-4"
      >
        {months[currentMonth.getMonth()].label} - {currentMonth.getFullYear()}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
          <div key={day} className="text-center text-east-bay font-bold py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 lg:gap-1">
        {days.map((day, index) =>
          !day || day.isDisabled ? (
            <div
              key={index}
              className="border-1 md:border-2 border-color-martinique text-east-bay shadow-lg aspect-square flex items-center justify-center rounded-sm bg-silver opacity-50 text-martinique"
            >
              {day?.day}
            </div>
          ) : (
            <button
              key={index}
              onClick={() => {
                setDate(day.dateString);
              }}
              className="border-1 md:border-2 border-color-martinique text-east-bay shadow-lg aspect-square flex items-center justify-center rounded-sm cursor-pointer bg-white  hover:bg-anakiwa"
            >
              {day.day}
            </button>
          ),
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="border w-4 h-4 bg-white rounded"></div>
          <span className="text-east-bay">Có lịch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="border w-4 h-4 bg-silver rounded"></div>
          <span className="text-east-bay">Không có lịch</span>
        </div>
      </div>
    </div>
  );
}
