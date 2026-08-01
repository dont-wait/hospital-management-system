"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ScheduleService } from "@/services";
import styles from "@/styles/create-schedule.module.css";
import type {
  ScheduleRequestHistoryItem,
  ScheduleRequestHistoryResponse,
} from "@/types";

const STATUS_LABELS: Record<string, string> = {
  QUEUED: "Đang chờ",
  RUNNING: "Đang chạy",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  PENDING: "Chờ duyệt",
  READY: "Sẵn sàng",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
};

const STATUS_STYLES: Record<string, string> = {
  QUEUED: styles["history-status-queued"],
  RUNNING: styles["history-status-running"],
  COMPLETED: styles["history-status-completed"],
  FAILED: styles["history-status-failed"],
  PENDING: styles["history-status-pending"],
  READY: styles["history-status-ready"],
  APPROVED: styles["history-status-approved"],
  REJECTED: styles["history-status-rejected"],
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function statusBadgeClass(status: string): string {
  return STATUS_STYLES[status.toUpperCase()] ?? styles["history-status-pending"];
}

function formatCreatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ScheduleHistorySectionProps {
  departmentId?: number;
}

export function ScheduleHistorySection({
  departmentId,
}: ScheduleHistorySectionProps): React.ReactElement {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<ScheduleRequestHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ScheduleService.getScheduleHistory({
        department_id: departmentId ?? null,
        status: status || null,
        from_date: fromDate || null,
        to_date: toDate || null,
        page,
        page_size: pageSize,
      });
      setData(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi tải lịch sử");
    } finally {
      setLoading(false);
    }
  }, [departmentId, status, fromDate, toDate, page, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.total ?? 0) / pageSize)),
    [data, pageSize]
  );

  const applyFilter = () => {
    setPage(1);
  };

  const openResult = (item: ScheduleRequestHistoryItem) => {
    router.push(`/doctor/schedule-result/${item.id}`);
  };

  return (
    <section className={`${styles["history-section"]} stagger-in`}>
      <div className={styles["history-header"]}>
        <div>
          <h2 className={styles["history-title"]}>Lịch sử xếp lịch</h2>
          <p className={styles["history-subtitle"]}>
            Các yêu cầu xếp lịch tự động đã tạo, kèm trạng thái xử lý.
          </p>
        </div>
        <div className={styles["history-filter-row"]}>
          <select
            className={styles["history-select"]}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="date"
            className={styles["history-date"]}
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
          />
          <span className={styles["history-filter-separator"]}>→</span>
          <input
            type="date"
            className={styles["history-date"]}
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
          />
          <button
            type="button"
            onClick={applyFilter}
            className={styles["history-primary-btn"]}
          >
            Lọc
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <div className={styles["history-table-shell"]}>
        <table className={styles["history-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khoa</th>
              <th>Người yêu cầu</th>
              <th>Khoảng ngày</th>
              <th>Số ngày</th>
              <th>Trạng thái</th>
              <th>Tiến độ</th>
              <th>Tạo lúc</th>
              <th className="text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data ? (
              <tr>
                <td colSpan={9} className={styles["history-empty"]}>
                  Đang tải lịch sử...
                </td>
              </tr>
            ) : (data?.items.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={9} className={styles["history-empty"]}>
                  Chưa có lịch xếp nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              (data?.items ?? []).map((item) => (
                <tr key={item.id}>
                  <td className={styles["history-id"]}>
                    #{item.id}
                  </td>
                  <td>{item.department_name || "—"}</td>
                  <td>{item.requested_by_name || "—"}</td>
                  <td className="whitespace-nowrap">
                    {item.start_date}
                    {item.num_days > 1 ? ` → ${item.num_days} ngày` : ""}
                  </td>
                  <td>{item.num_days}</td>
                  <td>
                    <span
                      className={`${styles["history-status-badge"]} ${statusBadgeClass(item.status)}`}
                    >
                      {STATUS_LABELS[item.status.toUpperCase()] ?? item.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles["history-progress"]}>
                      <div className={styles["history-progress-track"]}>
                        <div
                          className={styles["history-progress-fill"]}
                          style={{ width: `${Math.min(100, item.progress_percent)}%` }}
                        />
                      </div>
                      <span className={styles["history-muted"]}>
                        {item.progress_percent}%
                      </span>
                    </div>
                  </td>
                  <td className={`${styles["history-muted"]} whitespace-nowrap`}>
                    {formatCreatedAt(item.created_at)}
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => openResult(item)}
                      disabled={item.status.toUpperCase() !== "COMPLETED"}
                      className={styles["history-action-btn"]}
                    >
                      Xem kết quả
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles["history-footer"]}>
        <div className={styles["history-summary"]}>
          Tổng cộng {data?.total ?? 0} yêu cầu · trang {data?.page ?? 1}/{totalPages}
        </div>
        <div className={styles["history-pagination"]}>
          <select
            className={styles["history-select"]}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} / trang
              </option>
            ))}
          </select>
          <div className={styles["history-pagination-buttons"]}>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={styles["history-secondary-btn"]}
            >
              ← Trước
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={styles["history-secondary-btn"]}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
