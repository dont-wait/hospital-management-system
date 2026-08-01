import { useMemo } from "react";
import { DoctorInfo } from "@/lib/client/scheduleResult.utils";
import { DoctorWorkloadBalance } from "@/types";

interface PanelBlockProps {
  children: React.ReactNode;
  className?: string;
}

interface DoctorSummaryTableProps {
  workloads: DoctorWorkloadBalance[];
  assignments: Array<{ date: string; doctor_ids: string[] }>;
  doctors: DoctorInfo[];
  className?: string;
}

const SHIFT_HOURS = 4.5;

interface DoctorRow {
  stt: number;
  doctor_id: string;
  doctor_name: string;
  assigned_shift_count: number;
  registered_days_off: string;
  no_shift_days_off: string;
  total_work_hours: number;
  extra_day_status: Array<{ date: string; fulfilled: boolean }>;
}

function computeDoctorRows(
  workloads: DoctorWorkloadBalance[],
  assignments: Array<{ date: string; doctor_ids: string[] }>,
  doctors: DoctorInfo[],
): DoctorRow[] {
  const allDates = Array.from(new Set(assignments.map((a) => a.date))).sort((a, b) =>
    a.localeCompare(b),
  );
  const allDateSet = new Set(allDates);
  const doctorInputById = new Map(doctors.map((d) => [d.id, d]));

  const assignedDatesPerDoctor = new Map<string, Set<string>>();
  const assignedShiftCountByDoctor = new Map<string, number>();

  for (const w of workloads) {
    assignedDatesPerDoctor.set(w.doctor_id, new Set());
    assignedShiftCountByDoctor.set(w.doctor_id, 0);
  }

  for (const a of assignments) {
    const uniqueIds = new Set(a.doctor_ids);
    for (const did of uniqueIds) {
      const dset = assignedDatesPerDoctor.get(did);
      if (dset) {
        dset.add(a.date);
        assignedShiftCountByDoctor.set(did, (assignedShiftCountByDoctor.get(did) ?? 0) + 1);
      }
    }
  }

  return workloads.map((w, idx) => {
    const assignedDates = assignedDatesPerDoctor.get(w.doctor_id) ?? new Set();
    const doc = doctorInputById.get(w.doctor_id);
    const registeredDaysOff = Array.from(
      new Set((doc?.days_off ?? []).filter((d) => allDateSet.has(d))),
    ).sort((a, b) => a.localeCompare(b));
    const regSet = new Set(registeredDaysOff);
    const noShiftDaysOff = allDates.filter((d) => !assignedDates.has(d) && !regSet.has(d));

    const shiftCount = assignedShiftCountByDoctor.get(w.doctor_id) ?? 0;
    const registeredExtraDays = Array.from(
      new Set((doc?.preferred_extra_days ?? []).filter((d) => allDateSet.has(d))),
    ).sort((a, b) => a.localeCompare(b));
    const extraDayStatus = registeredExtraDays.map((d) => ({
      date: d,
      fulfilled: assignedDates.has(d),
    }));

    return {
      stt: idx + 1,
      doctor_id: w.doctor_id,
      doctor_name: w.doctor_name,
      assigned_shift_count: shiftCount,
      registered_days_off: registeredDaysOff.join(", "),
      no_shift_days_off: noShiftDaysOff.join(", "),
      total_work_hours: shiftCount * SHIFT_HOURS,
      extra_day_status: extraDayStatus,
    };
  });
}

const DoctorSummaryPanel = Object.assign(
  function DoctorSummaryPanel({ children, className = "" }: PanelBlockProps): React.ReactElement {
    return (
      <section className={`glass stagger-in p-4 md:p-6 ${className}`}>
        {children}
      </section>
    );
  },
  {
    Title: function Title({ children, className = "" }: PanelBlockProps): React.ReactElement {
      return <h2 className={`mb-1 text-lg font-bold ${className}`}>{children}</h2>;
    },

    Description: function Description({ children, className = "" }: PanelBlockProps): React.ReactElement {
      return <p className={`text-muted-foreground mb-4 text-sm ${className}`}>{children}</p>;
    },

    Table: function Table({
      workloads,
      assignments,
      doctors,
      className = "",
    }: DoctorSummaryTableProps): React.ReactElement {
      const rows = useMemo(
        () => computeDoctorRows(workloads, assignments, doctors),
        [workloads, assignments, doctors],
      );

      if (rows.length === 0) {
        return (
          <div className="rounded-lg border border-dashed border-border bg-slate-50 p-4 text-center text-sm text-slate-500">
            Chưa có dữ liệu bác sĩ.
          </div>
        );
      }

      return (
        <div className={`overflow-x-auto rounded-lg border border-border bg-white ${className}`}>
          <table className="min-w-280 w-full text-sm">
            <thead className="border-b border-border bg-slate-50">
              <tr>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-700">STT</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-700">Bác sĩ</th>
                <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-700">Ca trực (kỳ này)</th>
                <th className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-700">Tổng giờ làm</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Ngày đăng ký nghỉ</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Ngày nghỉ do không có ca</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Ngày đăng ký trực thêm (đáp ứng)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.doctor_id} className="border-b border-border last:border-b-0 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2 text-slate-600">{row.stt}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">{row.doctor_name}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-mono font-semibold text-emerald-700">
                    {row.assigned_shift_count}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right font-mono font-semibold text-amber-700">
                    {row.total_work_hours.toFixed(1)}h
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {row.registered_days_off ? (
                      <span className="font-mono text-xs">{row.registered_days_off}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {row.no_shift_days_off ? (
                      <span className="font-mono text-xs">{row.no_shift_days_off}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {row.extra_day_status.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {row.extra_day_status.map((item) => (
                          <div key={`${row.doctor_id}-${item.date}`} className="font-mono text-xs">
                            <span>{item.date}</span>
                            <span
                              className={
                                item.fulfilled
                                  ? "ml-1 font-semibold text-emerald-700"
                                  : "ml-1 font-semibold text-rose-700"
                              }
                            >
                              ({item.fulfilled ? "Đáp ứng" : "Chưa đáp ứng"})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
);

export { DoctorSummaryPanel };
