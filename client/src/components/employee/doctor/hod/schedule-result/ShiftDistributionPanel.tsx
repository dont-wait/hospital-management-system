"use client";

import { useMemo } from "react";
import { DoctorWorkloadBalance } from "@/types";

interface ShiftDistributionPanelProps {
  workloads: DoctorWorkloadBalance[];
  fairnessStd: number;
}

function barColor(count: number, mean: number) {
  if (mean === 0) return "bg-sky-500";
  const ratio = count / mean;
  if (ratio < 0.7) return "bg-rose-400";
  if (ratio > 1.3) return "bg-amber-400";
  return "bg-sky-500";
}

export function ShiftDistributionPanel({ workloads, fairnessStd }: ShiftDistributionPanelProps) {
  const { max, min, mean, sorted } = useMemo(() => {
    if (workloads.length === 0) return { max: 1, min: 0, mean: 0, sorted: [] as DoctorWorkloadBalance[] };
    const counts = workloads.map((w) => w.assigned_shift_count);
    const maxVal = Math.max(...counts, 1);
    const minVal = Math.min(...counts);
    const sum = counts.reduce((a, b) => a + b, 0);
    const meanVal = sum / counts.length;
    const sorted = [...workloads].sort((a, b) => b.assigned_shift_count - a.assigned_shift_count);
    return { max: maxVal, min: minVal, mean: meanVal, sorted };
  }, [workloads]);

  if (workloads.length === 0) return null;

  const isGood = fairnessStd <= 1.0;
  const isMedium = fairnessStd <= 1.5;

  return (
    <section className="glass stagger-in p-4 md:p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-bold">Phân bố ca trực - Lệch ca</h2>
          <p className="text-muted-foreground text-xs">
            Số ca thực tế được phân cho từng bác sĩ trong kỳ. Đường đỏ đứt nét = mức trung bình ({mean.toFixed(1)} ca).
          </p>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground text-xs">Độ lệch chuẩn</span>
          <p className={`font-mono text-xl font-bold ${isGood ? "text-emerald-600" : isMedium ? "text-amber-600" : "text-rose-600"}`}>
            {fairnessStd.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2 rounded-lg bg-slate-50 p-3 text-center text-xs">
        <div>
          <span className="text-muted-foreground">Bác sĩ</span>
          <p className="font-mono font-semibold text-slate-800">{workloads.length}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Trung bình</span>
          <p className="font-mono font-semibold text-sky-700">{mean.toFixed(1)} ca</p>
        </div>
        <div>
          <span className="text-muted-foreground">Ít nhất</span>
          <p className="font-mono font-semibold text-rose-600">{min} ca</p>
        </div>
        <div>
          <span className="text-muted-foreground">Nhiều nhất</span>
          <p className="font-mono font-semibold text-amber-600">{max} ca</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-2">
        {sorted.map((w) => {
          const pct = (w.assigned_shift_count / max) * 100;
          const diff = w.assigned_shift_count - mean;
          const diffStr = Math.abs(diff) < 0.1 ? "" : diff > 0 ? `+${diff.toFixed(0)}` : diff.toFixed(0);
          return (
            <div key={w.doctor_id} className="group flex items-center gap-2 py-0.5">
              <span className="w-28 shrink-0 truncate text-right text-[11px] text-slate-600" title={w.doctor_name}>
                {w.doctor_name}
              </span>
              <div className="relative flex-1">
                <div
                  className="absolute top-0 bottom-0 z-10 w-px border-l border-dashed border-rose-300"
                  style={{ left: `${(mean / max) * 100}%` }}
                />
                <div
                  className={`h-4 rounded-r-sm transition-all ${barColor(w.assigned_shift_count, mean)}`}
                  style={{ width: `${pct}%`, minWidth: w.assigned_shift_count > 0 ? "4px" : "0px" }}
                />
              </div>
              <span className="w-6 text-right font-mono text-[11px] font-semibold text-slate-700">
                {w.assigned_shift_count}
              </span>
              <span className={`hidden w-7 text-right text-[10px] group-hover:inline ${diff > 0 ? "text-amber-600" : diff < 0 ? "text-rose-600" : "text-slate-400"}`}>
                {diffStr}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-xs">
          <thead className="border-b border-border bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-600">Bác sĩ</th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-600">Số ca</th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-600">/tuần</th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-600">/tháng</th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-600">Nghỉ</th>
            </tr>
          </thead>
          <tbody>
            {workloads.map((w) => {
              const diff = w.assigned_shift_count - mean;
              const diffColor = Math.abs(diff) <= 1 ? "text-emerald-600" : diff > 0 ? "text-amber-600" : "text-rose-600";
              return (
                <tr key={w.doctor_id} className="border-b border-border last:border-b-0 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-800">{w.doctor_name}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-mono font-semibold">
                    <span>{w.assigned_shift_count}</span>
                    {Math.abs(diff) > 1 && (
                      <span className={`ml-1 text-[10px] ${diffColor}`}>
                        ({diff > 0 ? "+" : ""}{diff.toFixed(0)})
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-slate-500">{w.weekly_shift_count}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-slate-500">{w.monthly_shift_count}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-mono text-slate-500">{w.day_off_count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
