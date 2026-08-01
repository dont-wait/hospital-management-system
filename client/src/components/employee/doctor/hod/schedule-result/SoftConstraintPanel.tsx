"use client";

import { SoftConstraintBreakdown } from "@/types";

interface SoftConstraintPanelProps {
  breakdown: SoftConstraintBreakdown;
  totalDoctors: number;
  softViolationScore: number;
}

const CONSTRAINTS = [
  {
    id: "SC-01",
    name: "Ngày liên tiếp",
    description: "Không làm > 5 ngày liên tiếp",
    violators: (b: SoftConstraintBreakdown) => b.consecutive_days_violators,
    detail: (b: SoftConstraintBreakdown) => `Tối đa: ${b.max_consecutive_days} ngày`,
  },
  {
    id: "SC-02",
    name: "Giờ làm/tuần",
    description: "Không vượt giờ làm tối đa/tuần",
    violators: (b: SoftConstraintBreakdown) => b.weekly_hours_violators,
    detail: (b: SoftConstraintBreakdown) => `Tối đa: ${b.max_weekly_hours}h`,
  },
  {
    id: "SC-03",
    name: "Ngày ưu tiên",
    description: "Đáp ứng ngày đăng ký ưu tiên",
    violators: (b: SoftConstraintBreakdown) => b.preferred_days_not_met,
    detail: (b: SoftConstraintBreakdown) => `Đáp ứng: ${(b.preferred_days_fulfilled_ratio * 100).toFixed(0)}%`,
  },
  {
    id: "SC-04",
    name: "Nghỉ cuối tuần",
    description: "Có ít nhất 2 ngày nghỉ cuối tuần",
    violators: (b: SoftConstraintBreakdown) => b.weekend_off_insufficient,
    detail: () => null,
  },
  {
    id: "SC-04b",
    name: "Bác sĩ 0 ca",
    description: "Tránh bác sĩ không được phân ca",
    violators: (b: SoftConstraintBreakdown) => b.zero_shift_doctors,
    detail: () => null,
  },
  {
    id: "SC-05",
    name: "Lệch ca mục tiêu",
    description: "Số ca sát mục tiêu từng bác sĩ",
    violators: (b: SoftConstraintBreakdown) => b.target_deviation_doctors,
    detail: (b: SoftConstraintBreakdown) => `Lệch tối đa: ${b.max_shift_deviation.toFixed(1)} ca`,
  },
];

export function SoftConstraintPanel({
  breakdown,
  totalDoctors,
  softViolationScore,
}: SoftConstraintPanelProps) {
  return (
    <section className="glass stagger-in p-4 md:p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-bold">Chi tiết vi phạm mềm</h2>
          <p className="text-muted-foreground text-xs">
            Thống kê số bác sĩ vi phạm từng ràng buộc mềm
          </p>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground text-xs">Tổng điểm phạt</span>
          <p className="font-mono text-xl font-bold text-rose-600">
            {softViolationScore.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3 text-center text-xs">
        <div>
          <span className="text-muted-foreground">Tổng slot ca</span>
          <p className="font-mono font-semibold text-slate-800">{breakdown.total_shift_slots}</p>
          {breakdown.shift_slots_formula && (
            <p className="mt-0.5 text-[10px] leading-tight text-slate-400">{breakdown.shift_slots_formula}</p>
          )}
        </div>
        <div>
          <span className="text-muted-foreground">Số bác sĩ</span>
          <p className="font-mono font-semibold text-slate-800">{totalDoctors}</p>
        </div>
        <div>
          <span className="text-muted-foreground">TB ca/bác sĩ</span>
          <p className="font-mono font-semibold text-slate-800">{breakdown.avg_shifts_per_doctor}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-xs">
          <thead className="border-b border-border bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Ràng buộc</th>
              <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Mô tả</th>
              <th className="whitespace-nowrap px-3 py-2 text-center font-semibold text-slate-600">Vi phạm</th>
              <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Thông số</th>
            </tr>
          </thead>
          <tbody>
            {CONSTRAINTS.map((c) => {
              const violators = c.violators(breakdown);
              const pct = totalDoctors > 0 ? Math.round((violators / totalDoctors) * 100) : 0;
              const isBad = pct > 30;
              const detail = c.detail(breakdown);
              return (
                <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                      {c.id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-700">{c.description}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`font-mono text-xs font-semibold ${isBad ? "text-rose-600" : "text-emerald-600"}`}>
                        {violators}/{totalDoctors}
                      </span>
                      <div className="h-1.5 w-14 rounded-full bg-slate-100">
                        <div
                          className={`h-1.5 rounded-full ${isBad ? "bg-rose-400" : "bg-emerald-400"}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className={`w-7 text-right text-[10px] ${isBad ? "text-rose-500" : "text-emerald-500"}`}>
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-500">
                    {detail ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
