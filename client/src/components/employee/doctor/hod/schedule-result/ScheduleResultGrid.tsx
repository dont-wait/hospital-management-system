import { useCallback, useMemo, useState, useEffect } from "react";
import {
  formatWeekdayLong,
  parseLocalDate,
  SHIFT_LABELS,
  SHIFT_ORDER,
  toDateStrLocal,
} from "@/lib/client/scheduleResult.utils";
import type { DoctorInfo } from "@/lib/client/scheduleResult.utils";
import { ParetoScheduleOption } from "@/types";

interface PanelBlockProps {
  children: React.ReactNode;
  className?: string;
}

interface WeekRow {
  shift: string;
  cells: Array<Array<{ room: string; doctorIds: string[] }>>;
}

interface ShiftDetail {
  date: string;
  shift: string;
  room: string;
  doctorIds: string[];
}

function mondayOf(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - (day - 1));
  return toDateStrLocal(date);
}

const ScheduleResultGrid = Object.assign(
  function ScheduleResultGrid({ children, className = "" }: PanelBlockProps): React.ReactElement {
    return (
      <section className={`glass stagger-in overflow-hidden p-4 md:p-6 ${className}`}>
        {children}
      </section>
    );
  },
  {
    Header: function Header({ children, className = "" }: PanelBlockProps): React.ReactElement {
      return (
        <div className={`mb-4 flex items-center justify-between ${className}`}>
          {children}
        </div>
      );
    },

    Title: function Title({ children, className = "" }: PanelBlockProps): React.ReactElement {
      return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
    },

    WeekNav: function WeekNav({
      weekIndex,
      totalWeeks,
      onPrev,
      onNext,
      className = "",
    }: {
      weekIndex: number;
      totalWeeks: number;
      onPrev: () => void;
      onNext: () => void;
      className?: string;
    }): React.ReactElement {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <p className="text-muted-foreground text-xs">
            Tuần {totalWeeks === 0 ? 0 : weekIndex + 1}/{totalWeeks}
          </p>
          <button
            type="button"
            onClick={onPrev}
            disabled={weekIndex === 0}
            className="border-border rounded-md border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            Trước
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={weekIndex >= totalWeeks - 1 || totalWeeks === 0}
            className="border-border rounded-md border bg-white px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      );
    },

    Timetable: function Timetable({
      schedule,
      nameLookup,
      onSelectShift,
    }: {
      schedule: ParetoScheduleOption;
      nameLookup: Map<string, string>;
      onSelectShift: (detail: ShiftDetail) => void;
    }): React.ReactElement {
      const { dates, rows } = useMemo(() => {
        const d = Array.from(new Set(schedule.assignments.map((a) => a.date))).sort((a, b) =>
          a.localeCompare(b),
        );
        const r: WeekRow[] = SHIFT_ORDER.map((shift) => ({
          shift,
          cells: d.map((date) =>
            schedule.assignments
              .filter((a) => a.date === date && a.shift === shift)
              .sort((a, b) => (a.room ?? "").localeCompare(b.room ?? ""))
              .map((a) => ({ room: a.room ?? "P-01", doctorIds: a.doctor_ids })),
          ),
        }));
        return { dates: d, rows: r };
      }, [schedule]);

      const weekStartDates = useMemo(() => {
        if (dates.length === 0) return [] as string[];
        const first = dates[0];
        const last = dates[dates.length - 1];
        const starts: string[] = [];
        const cursor = parseLocalDate(mondayOf(first));
        const endDate = parseLocalDate(last);
        while (cursor <= endDate) {
          starts.push(toDateStrLocal(cursor));
          cursor.setDate(cursor.getDate() + 7);
        }
        return starts;
      }, [dates]);

      const totalWeeks = weekStartDates.length;
      const [weekIndex, setWeekIndex] = useState(0);

      useEffect(() => {
        if (weekIndex >= totalWeeks) setWeekIndex(0);
      }, [totalWeeks, weekIndex]);

      const visibleWeekDates = useMemo(() => {
        const ws = weekStartDates[weekIndex];
        if (!ws) return Array.from({ length: 7 }, () => "");
        const available = new Set(dates);
        const start = parseLocalDate(ws);
        return Array.from({ length: 7 }, (_, offset) => {
          const current = new Date(start);
          current.setDate(start.getDate() + offset);
          const ds = toDateStrLocal(current);
          return available.has(ds) ? ds : "";
        });
      }, [weekStartDates, weekIndex, dates]);

      const weekRows = useMemo(() => {
        if (visibleWeekDates.length === 0) return [] as WeekRow[];
        const idxMap = new Map(dates.map((d, i) => [d, i]));
        return rows.map((row) => ({
          shift: row.shift,
          cells: visibleWeekDates.map((date) => {
            if (!date) return [];
            const gi = idxMap.get(date);
            return gi === undefined ? [] : (row.cells[gi] ?? []);
          }),
        }));
      }, [dates, rows, visibleWeekDates]);

      return (
        <>
          <ScheduleResultGrid.Header>
            <ScheduleResultGrid.Title>Thời khóa biểu ca trực theo tuần</ScheduleResultGrid.Title>
            <ScheduleResultGrid.WeekNav
              weekIndex={weekIndex}
              totalWeeks={totalWeeks}
              onPrev={() => setWeekIndex((p) => Math.max(p - 1, 0))}
              onNext={() => setWeekIndex((p) => Math.min(p + 1, Math.max(totalWeeks - 1, 0)))}
            />
          </ScheduleResultGrid.Header>

          <div className="overflow-x-auto">
            <table className="min-w-180 w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border-border w-28 border px-3 py-2">Ca trực</th>
                  {visibleWeekDates.map((date, index) => (
                    <th key={date || `placeholder-${index}`} className="border-border w-32 border px-3 py-2 text-center">
                      {date ? formatWeekdayLong(date) : ""}
                      <div className="text-muted-foreground font-mono text-xs">{date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekRows.map((row) => (
                  <tr key={row.shift} className="border-border border-b align-top">
                    <td className="border-border bg-amber-50 px-3 py-3 font-semibold">
                      {SHIFT_LABELS[row.shift as keyof typeof SHIFT_LABELS]}
                    </td>
                    {row.cells.map((roomAssignments, idx) => (
                      <td
                        key={`${row.shift}-${visibleWeekDates[idx] || idx}`}
                        className="border-border min-h-30 border px-2 py-2 align-top"
                      >
                        {visibleWeekDates[idx] ? (
                          roomAssignments.length > 0 ? (
                            <div className="flex min-h-25 flex-col gap-2">
                              {roomAssignments.map((roomItem) => (
                                <button
                                  key={`${row.shift}-${visibleWeekDates[idx]}-${roomItem.room}`}
                                  type="button"
                                  onClick={() =>
                                    onSelectShift({
                                      date: visibleWeekDates[idx],
                                      shift: row.shift,
                                      room: roomItem.room,
                                      doctorIds: roomItem.doctorIds,
                                    })
                                  }
                                  className="border-border w-full rounded-md border bg-white p-2 text-left transition hover:border-cyan-500 hover:bg-cyan-50"
                                >
                                  <p className="text-xs font-semibold text-slate-700">
                                    {SHIFT_LABELS[row.shift as keyof typeof SHIFT_LABELS]} {roomItem.room} · {roomItem.doctorIds.length} bác sĩ
                                  </p>
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                    {roomItem.doctorIds
                                      .slice(0, 3)
                                      .map((id) => nameLookup.get(id) ?? id)
                                      .join(", ") || "—"}
                                  </p>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400">—</div>
                          )
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    },

    ShiftDetail: function ShiftDetail({
      detail,
      doctors,
      onClose,
    }: {
      detail: ShiftDetail;
      doctors: Array<DoctorInfo & { role: string }>;
      onClose: () => void;
    }): React.ReactElement {
      const closeRef = useCallback(onClose, [onClose]);

      return (
        <article className="border-border mt-4 rounded-xl border bg-white p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Ca trực {SHIFT_LABELS[detail.shift as keyof typeof SHIFT_LABELS]} — {formatWeekdayLong(detail.date)} ({detail.date})
              </p>
              <p className="text-muted-foreground text-xs">{doctors.length} bác sĩ tham gia</p>
            </div>
            <button
              type="button"
              onClick={() => closeRef()}
              className="border-border rounded-md border bg-white px-2 py-1 text-xs"
            >
              Đóng
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {doctors.map((doctor) => (
              <article key={`${detail.date}-${detail.shift}-${doctor.id}`} className="border-border rounded-md border p-3 text-xs">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{doctor.name}</p>
                  <p
                    className={`rounded-full px-2 py-0.5 font-semibold ${
                      doctor.experiences < 2
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {doctor.role}
                  </p>
                </div>
                <p className="font-mono text-slate-600">{doctor.id}</p>
                <p className="text-slate-600">Kinh nghiệm: {doctor.experiences} năm</p>
                <p className="text-slate-600">Khoa: {doctor.department_id}</p>
                <p className="text-slate-600">Chuyên khoa: {doctor.specialization}</p>
              </article>
            ))}
          </div>
        </article>
      );
    },
  },
);

export { ScheduleResultGrid };
export type { ShiftDetail };
