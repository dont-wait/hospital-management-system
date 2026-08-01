"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ErrorBanner } from "@/components/employee/doctor/hod/schedule-result/ErrorBanner";
import { ParetoCard } from "@/components/employee/doctor/hod/schedule-result/ParetoCard";
import { SoftConstraintPanel } from "@/components/employee/doctor/hod/schedule-result/SoftConstraintPanel";
import { ShiftDistributionPanel } from "@/components/employee/doctor/hod/schedule-result/ShiftDistributionPanel";
import { renderRunMetrics } from "@/components/employee/doctor/hod/schedule-result/RunMetricsPanel";
import { DoctorSummaryPanel } from "@/components/employee/doctor/hod/schedule-result/DoctorSummaryPanel";
import { ScheduleResultGrid } from "@/components/employee/doctor/hod/schedule-result/ScheduleResultGrid";
import type { ShiftDetail } from "@/components/employee/doctor/hod/schedule-result/ScheduleResultGrid";
import { DoctorInfo } from "@/lib/client/scheduleResult.utils";
import { ScheduleHistorySection } from "@/components/employee/doctor/hod/schedule-result/ScheduleHistorySection";
import { useUserAuthContext } from "@/contexts";
import { EmployeeService, ScheduleService } from "@/services";
import adminStyles from "@/styles/admin.module.css";
import styles from "@/styles/create-schedule.module.css";
import {
  AuthUserWithoutTokens,
  DoctorWorkloadBalance,
  Employee,
  PreviewScheduleResult,
  ScheduleJobMetricsResult,
} from "@/types";

interface ScheduleResultDashboardProps {
  requestId?: string | null;
}

interface GridBlockProps {
  children: React.ReactNode;
  className?: string;
}

const ParetoGrid = Object.assign(
  function ParetoGrid({ children, className = "" }: GridBlockProps): React.ReactElement {
    return (
      <section className={`glass p-4 md:p-6 ${className}`}>
        {children}
      </section>
    );
  },
  {
    Header: function Header({ children, className = "" }: GridBlockProps): React.ReactElement {
      return (
        <div className={`flex items-center justify-between ${className}`}>
          {children}
        </div>
      );
    },
    Title: function Title({ children, className = "" }: GridBlockProps): React.ReactElement {
      return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
    },
    Subtitle: function Subtitle({ children, className = "" }: GridBlockProps): React.ReactElement {
      return <p className={`text-muted-foreground text-xs ${className}`}>{children}</p>;
    },
  },
);

function buildDoctorInfos(list: AuthUserWithoutTokens[]): DoctorInfo[] {
  return list
    .filter((item) => item.employee)
    .map((item) => {
      const e = item.employee as Employee;
      const experiences = e.experienceYears ?? 0;
      return {
        id: e.employeeId,
        name: `BS ${e.firstName} ${e.lastName}`,
        experiences,
        department_id: String(e.departmentId ?? ""),
        specialization: e.specialization ?? "",
        days_off: [],
        preferred_extra_days: [],
        has_valid_license: true,
        is_intern: experiences < 2,
      };
    });
}

export function ScheduleResultDashboard({ requestId: requestIdProp }: ScheduleResultDashboardProps): React.ReactElement {
  const searchParams = useSearchParams();
  const requestId = requestIdProp ?? searchParams.get("requestId");
  const isDetailPage = Boolean(requestId);

  const { user } = useUserAuthContext();
  const employee = user && "employeeId" in user ? (user as Employee) : null;

  const [scheduleData, setScheduleData] = useState<PreviewScheduleResult | null>(null);
  const [metricsData, setMetricsData] = useState<ScheduleJobMetricsResult | null>(null);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shiftDetail, setShiftDetail] = useState<ShiftDetail | null>(null);

  const loadResults = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const scheduleResponse = await ScheduleService.getSchedule(id);

      if (!("selected" in scheduleResponse)) {
        throw new Error(scheduleResponse.message || "Không thể lấy dữ liệu lịch trực");
      }

      const schedule = scheduleResponse as PreviewScheduleResult;
      setScheduleData(schedule);

      try {
        const metrics = await ScheduleService.getScheduleMetrics(id);
        setMetricsData(metrics);
      } catch {
        setMetricsData(null);
      }

      const doctorsData = await EmployeeService.getAllEmployees(
        "doctor",
        employee?.departmentId,
      );
      setDoctors(buildDoctorInfos(doctorsData));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi tải kết quả");
    } finally {
      setLoading(false);
    }
  }, [employee?.departmentId]);

  useEffect(() => {
    if (requestId) {
      void loadResults(requestId);
    }
  }, [requestId, loadResults]);

  useEffect(() => {
    setShiftDetail(null);
  }, [scheduleData?.selected_option_id]);

  const appliedOptionId = useMemo(
    () => scheduleData?.selected_option_id ?? scheduleData?.pareto_options?.[0]?.option_id ?? null,
    [scheduleData]
  );

  const options = useMemo(() => {
    if (!scheduleData) return [];
    return (scheduleData.pareto_options ?? []).map((opt) => {
      const met = metricsData?.pareto_options.find((x) => x.option_id === opt.option_id);
      return { option: opt, metrics: met?.metrics ?? null };
    });
  }, [scheduleData, metricsData]);

  const selectedSchedule = useMemo(() => {
    const pareto = scheduleData?.pareto_options ?? [];
    if (pareto.length === 0) return null;
    const id = appliedOptionId;
    return pareto.find((o) => o.option_id === id) ?? pareto[0];
  }, [scheduleData, appliedOptionId]);

  const selectedMetrics = useMemo(() => {
    if (!selectedSchedule || !metricsData) return null;
    const met = metricsData.pareto_options.find((x) => x.option_id === selectedSchedule.option_id);
    return met?.metrics ?? null;
  }, [selectedSchedule, metricsData]);

  const selectedWorkloads = useMemo(() => {
    if (!selectedSchedule) return [] as DoctorWorkloadBalance[];

    const assignmentCounts = new Map<string, number>();
    for (const assignment of selectedSchedule.assignments ?? []) {
      for (const doctorId of assignment.doctor_ids ?? []) {
        assignmentCounts.set(doctorId, (assignmentCounts.get(doctorId) ?? 0) + 1);
      }
    }

    return (selectedSchedule.doctor_workload_balances ?? []).map((workload) => {
      const assignedShiftCount = Number.isFinite(workload.assigned_shift_count)
        ? workload.assigned_shift_count
        : assignmentCounts.get(workload.doctor_id) ?? 0;

      const weeklyShiftCount = Number.isFinite(workload.weekly_shift_count)
        ? workload.weekly_shift_count
        : assignedShiftCount;

      const monthlyShiftCount = Number.isFinite(workload.monthly_shift_count)
        ? workload.monthly_shift_count
        : assignedShiftCount;

      return {
        ...workload,
        assigned_shift_count: assignedShiftCount,
        weekly_shift_count: weeklyShiftCount,
        monthly_shift_count: monthlyShiftCount,
        yearly_estimated_shift_count: Number.isFinite(workload.yearly_estimated_shift_count)
          ? workload.yearly_estimated_shift_count
          : assignedShiftCount,
        holiday_shift_count: Number.isFinite(workload.holiday_shift_count)
          ? workload.holiday_shift_count
          : 0,
        day_off_count: Number.isFinite(workload.day_off_count)
          ? workload.day_off_count
          : 0,
      };
    });
  }, [selectedSchedule]);

  const nameLookup = useMemo(() => {
    const m = new Map<string, string>();
    if (selectedSchedule) {
      for (const w of selectedSchedule.doctor_workload_balances) {
        m.set(w.doctor_id, w.doctor_name);
      }
    }
    return m;
  }, [selectedSchedule]);

  const doctorLookup = useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);

  const shiftDetailDoctors = useMemo(() => {
    if (!shiftDetail) return [] as Array<DoctorInfo & { role: string }>;
    return shiftDetail.doctorIds.map((did) => {
      const d = doctorLookup.get(did);
      const exp = d?.experiences ?? 0;
      return {
        id: d?.id ?? did,
        name: d?.name ?? did,
        experiences: exp,
        department_id: d?.department_id ?? "—",
        specialization: d?.specialization ?? "—",
        days_off: d?.days_off ?? [],
        preferred_extra_days: d?.preferred_extra_days ?? [],
        has_valid_license: d?.has_valid_license ?? true,
        is_intern: d?.is_intern ?? false,
        role: exp < 2 ? "Bác sĩ thực tập" : "Bác sĩ chính thức",
      };
    });
  }, [doctorLookup, shiftDetail]);

  if (!requestId) {
    return (
      <main className="w-full px-4 py-8">
        <header className={adminStyles["dashboard-header"]}>
          <h1 className={adminStyles["dashboard-title"]}>Kết quả xếp lịch</h1>
          <p className={adminStyles["dashboard-subtitle"]}>
            Chọn một yêu cầu trong lịch sử bên dưới để xem chi tiết kết quả
            (Pareto · Chỉ số · Thống kê).
          </p>
        </header>
        <div className="mt-4">
          <ScheduleHistorySection
            departmentId={employee?.roleId === "admin" ? undefined : employee?.departmentId}
          />
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="w-full px-4 py-8">
        <div className="mb-4">
          <Link href="/doctor/schedule-result" className="text-sm font-medium text-teal-700 hover:underline">
            ← Quay lại lịch sử xếp lịch
          </Link>
        </div>
        <section className={styles["schedule-result-hero"]}>
          <p className={styles["schedule-result-hero-subtitle"]}>
            Đang tải kết quả cho <strong>{requestId}</strong>...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full px-4 py-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href="/doctor/schedule-result" className="text-sm font-medium text-teal-700 hover:underline">
            ← Quay lại lịch sử xếp lịch
          </Link>
        </div>
        <ErrorBanner error={error} />
        <div className="mt-4">
          <Link href="/doctor/create-schedule" className="text-teal-700 hover:underline">
            Về trang tạo lịch
          </Link>
        </div>
      </main>
    );
  }

  const runMetrics = metricsData?.algorithm_run_metrics ?? null;

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-8">
      {isDetailPage ? (
        <div className="flex items-center justify-between gap-3">
          <Link href="/doctor/schedule-result" className="text-sm font-medium text-teal-700 hover:underline">
            ← Quay lại lịch sử xếp lịch
          </Link>
          <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
            Request #{requestId}
          </code>
        </div>
      ) : null}

      {runMetrics ? renderRunMetrics(runMetrics) : null}

      {!metricsData ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Lịch này vẫn xem được, nhưng các chỉ số Pareto và metrics thuật toán chưa còn khả dụng.
          Nguyen nhan thuong gap la request cu da duoc luu lich trong Hospital, nhung job tam thoi tren serverless da mat sau khi restart.
        </section>
      ) : null}

      <ParetoGrid className="stagger-in">
        <ParetoGrid.Header>
          <div>
            <ParetoGrid.Title>Các phương án Pareto - lịch trực</ParetoGrid.Title>
            {selectedSchedule ? (
              <ParetoGrid.Subtitle className="mt-1">
                Phương án tốt nhất đã được áp dụng: <strong className="text-indigo-700">{selectedSchedule.option_id}</strong>
              </ParetoGrid.Subtitle>
            ) : null}
          </div>
          <ParetoGrid.Subtitle>
            {options.length} phương án · request:{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">{requestId}</code>
          </ParetoGrid.Subtitle>
        </ParetoGrid.Header>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {options.map(({ option, metrics }) => {
            const featured = option.option_id === appliedOptionId;

            return (
              <ParetoCard
                key={option.option_id}
                featured={featured}
              >
                <ParetoCard.Header>
                  <ParetoCard.Header.Id>{option.option_id}</ParetoCard.Header.Id>
                </ParetoCard.Header>

                {metrics ? (
                  <>
                    <ParetoCard.MetricPanel>
                      <ParetoCard.MetricRow label="JFI">
                        <span className="text-emerald-700">{(metrics.jfi_overall ?? 0).toFixed(4)}</span>
                      </ParetoCard.MetricRow>
                      <ParetoCard.MetricRow label="Gini">
                        <span className="text-amber-700">{(metrics.gini_workload ?? 0).toFixed(4)}</span>
                      </ParetoCard.MetricRow>
                      <ParetoCard.MetricRow label="Vi phạm mềm">
                        <span className="text-rose-700">{(metrics.soft_violation_score ?? 0).toFixed(1)}</span>
                      </ParetoCard.MetricRow>
                      <ParetoCard.MetricRow label="Lệch ca">
                        <span className="text-slate-700">{(metrics.fairness_std ?? 0).toFixed(1)}</span>
                      </ParetoCard.MetricRow>
                    </ParetoCard.MetricPanel>
                    <ParetoCard.Divider />
                    <ParetoCard.Footer>
                      <ParetoCard.Footer.Jfi value={metrics.jfi_overall ?? 0} />
                      <ParetoCard.Footer.Gini value={metrics.gini_workload ?? 0} />
                    </ParetoCard.Footer>
                    {metrics.compliance ? (
                      <>
                        <ParetoCard.Divider />
                        <div className="space-y-1 text-xs">
                          <p className="font-semibold text-slate-700">Bac si dap ung:</p>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gio lam</span>
                            <span className="font-mono font-semibold text-emerald-700">
                              {metrics.compliance.meet_weekly_hours}/{metrics.compliance.total_doctors}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ngay lien tiep</span>
                            <span className="font-mono font-semibold text-emerald-700">
                              {metrics.compliance.meet_consecutive_days}/{metrics.compliance.total_doctors}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ngay uu tien</span>
                            <span className="font-mono font-semibold text-teal-700">
                              {(metrics.compliance.meet_preferred_days_ratio * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs">Chưa có chỉ số cho phương án này.</p>
                )}
              </ParetoCard>
            );
          })}
        </div>
      </ParetoGrid>

      {selectedMetrics?.soft_breakdown ? (
        <SoftConstraintPanel
          breakdown={selectedMetrics.soft_breakdown}
          totalDoctors={selectedMetrics.compliance.total_doctors}
          softViolationScore={selectedMetrics.soft_violation_score}
        />
      ) : null}

      {selectedSchedule ? (
        <ShiftDistributionPanel
          workloads={selectedWorkloads}
          fairnessStd={selectedMetrics?.fairness_std ?? 0}
        />
      ) : null}

      {selectedSchedule ? (
        <DoctorSummaryPanel>
          <DoctorSummaryPanel.Title>Bác sĩ - Thống kê ca trực</DoctorSummaryPanel.Title>
          <DoctorSummaryPanel.Description>
            Danh sách bác sĩ theo phương án đang chọn: số ca trực, tổng giờ làm, 2 loại ngày nghỉ và trạng thái đáp ứng ngày đăng ký trực thêm.
          </DoctorSummaryPanel.Description>
          <DoctorSummaryPanel.Table
            workloads={selectedWorkloads}
            assignments={selectedSchedule.assignments}
            doctors={doctors}
          />
        </DoctorSummaryPanel>
      ) : null}

      {selectedSchedule ? (
        <ScheduleResultGrid>
          <ScheduleResultGrid.Timetable
            schedule={selectedSchedule}
            nameLookup={nameLookup}
            onSelectShift={setShiftDetail}
          />
          {shiftDetail ? (
            <ScheduleResultGrid.ShiftDetail
              detail={shiftDetail}
              doctors={shiftDetailDoctors}
              onClose={() => setShiftDetail(null)}
            />
          ) : null}
        </ScheduleResultGrid>
      ) : null}

      <div className="text-right">
        <Link href="/doctor/create-schedule" className="text-teal-700 text-sm hover:underline">
          Về trang tạo lịch
        </Link>
      </div>
    </main>
  );
}
