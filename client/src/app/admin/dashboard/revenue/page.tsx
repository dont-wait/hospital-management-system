"use client";

import { useEffect, useState } from "react";
import AdminContentHeader from "@/components/admin/AdminContentHeader";
import Icon from "@/components/shared/Icon";
import RevenueLineChart from "@/components/admin/RevenueLineChart";
import RevenueBarChart from "@/components/admin/RevenueBarChart";
import RevenuePieChart from "@/components/admin/RevenuePieChart";
import styles from "@/styles/revenue.module.css";
import { RevenueByDepartment, RevenueTransaction } from "@/types";
import { DepartmentService } from "@/services/department.service";
import { BillingService } from "@/services/billing.service";
import { formatDateTime } from "@/lib/client/date-utils";

interface RevenueData {
  totalRevenue: number;
  appointmentRevenue: number;
  serviceRevenue: number;
  growthRate: number;
}

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year" | "range">("month");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("line");
  const [fromDateDept, setFromDateDept] = useState<string>("");
  const [toDateDept, setToDateDept] = useState<string>("");
  const [fromDateTrans, setFromDateTrans] = useState<string>("");
  const [toDateTrans, setToDateTrans] = useState<string>("");
  const [departmentRevenue, setDepartmentRevenue] = useState<RevenueByDepartment[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RevenueTransaction[]>([]);

  const revenueData: RevenueData = {
    totalRevenue: 2450000000, // 2.45 tỷ VNĐ
    appointmentRevenue: 980000000,
    serviceRevenue: 1120000000,
    growthRate: 12.5,
  };

  useEffect(() => {
    const fetchRevenueStatistics = async () => {
      const response = await DepartmentService.getRevenueStatistics(timeRange, fromDateDept, toDateDept);
      setDepartmentRevenue(response);
    };

    fetchRevenueStatistics();
  }, [timeRange, fromDateDept, toDateDept]);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      const response = await BillingService.getRecentTransactions(1, 5, fromDateTrans, toDateTrans);
      setRecentTransactions(response);
    };
    fetchRecentTransactions();
  }, [fromDateTrans, toDateTrans]);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "paid":
        return styles["status-completed"];
      case "pending":
        return styles["status-pending"];
      case "failed":
        return styles["status-cancelled"];
      case "unpaid":
        return styles["status-unpaid"];
      default:
        return "";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "paid":
        return "Hoàn thành";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Đã hủy";
      case "unpaid":
        return "Chưa thanh toán";
      default:
        return status;
    }
  };

  return (
    <div className={styles["revenue-container"]}>
      <AdminContentHeader
        title="Quản Lý Doanh Thu"
        description="Theo dõi và quản lý doanh thu của bệnh viện"
      />

      <div className={styles["time-filter"]}>
        <button
          className={`${styles["time-btn"]} ${timeRange === "day" ? styles["active"] : ""}`}
          onClick={() => setTimeRange("day")}
        >
          Hôm nay
        </button>
        <button
          className={`${styles["time-btn"]} ${timeRange === "week" ? styles["active"] : ""}`}
          onClick={() => setTimeRange("week")}
        >
          Tuần này
        </button>
        <button
          className={`${styles["time-btn"]} ${timeRange === "month" ? styles["active"] : ""}`}
          onClick={() => setTimeRange("month")}
        >
          Tháng này
        </button>
        <button
          className={`${styles["time-btn"]} ${timeRange === "year" ? styles["active"] : ""}`}
          onClick={() => setTimeRange("year")}
        >
          Năm nay
        </button>
      </div>

      {/* Revenue Stats */}
      <div className={styles["revenue-stats"]}>
        <div className={styles["stat-card-large"]}>
          <div className={styles["stat-icon-wrap"]}>
            <Icon name="DollarSign" />
          </div>
          <div className={styles["stat-content"]}>
            <h3 className={styles["stat-label"]}>Tổng Doanh Thu</h3>
            <p className={styles["stat-value-large"]}>{formatCurrency(revenueData.totalRevenue)}</p>
            <div className={styles["stat-growth"]}>
              <Icon name="TrendingUp" />
              <span className={styles["growth-positive"]}>+{revenueData.growthRate}%</span>
              <span className={styles["growth-text"]}>so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon-wrap-secondary"]}>
            <Icon name="Calendar" />
          </div>
          <div className={styles["stat-content"]}>
            <h3 className={styles["stat-label"]}>Doanh Thu Khám Bệnh</h3>
            <p className={styles["stat-value"]}>{formatCurrency(revenueData.appointmentRevenue)}</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon-wrap-secondary"]}>
            <Icon name="Activity" />
          </div>
          <div className={styles["stat-content"]}>
            <h3 className={styles["stat-label"]}>Doanh Thu Dịch Vụ</h3>
            <p className={styles["stat-value"]}>{formatCurrency(revenueData.serviceRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Department Revenue */}
      <div className={styles["section-card"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Doanh Thu Theo Khoa</h2>
          <div className={styles["header-actions"]}>
            <div className={styles["date-range-picker"]}>
              <div className={styles["date-input-group"]}>
                <label className={styles["date-label"]}>Từ ngày:</label>
                <input
                  type="date"
                  className={styles["date-input"]}
                  value={fromDateDept}
                  onChange={(e) => {
                    setFromDateDept(e.target.value);
                    setTimeRange("range");
                  }}
                />
              </div>
              <div className={styles["date-input-group"]}>
                <label className={styles["date-label"]}>Đến ngày:</label>
                <input
                  type="date"
                  className={styles["date-input"]}
                  value={toDateDept}
                  onChange={(e) => {
                    setToDateDept(e.target.value);
                    setTimeRange("range");
                  }}
                />
              </div>
              {(fromDateDept || toDateDept) && (
                <button
                  className={styles["clear-dates-btn"]}
                  onClick={() => {
                    setFromDateDept("");
                    setToDateDept("");
                    setTimeRange("month");
                  }}
                  title="Xóa bộ lọc ngày"
                >
                  <Icon name="X" />
                </button>
              )}
            </div>
            <button className={styles["export-btn"]}>
              <Icon name="Download" />
              Xuất báo cáo
            </button>
          </div>
        </div>
        <div className={styles["table-wrapper"]}>
          <table className={styles["revenue-table"]}>
            <thead>
              <tr>
                <th>Tên Khoa</th>
                <th>Doanh Thu</th>
                <th>Số Lượt Khám</th>
                <th>Tăng Trưởng</th>
              </tr>
            </thead>
            <tbody>
              {departmentRevenue.map((dept) => (
                <tr key={dept.id}>
                  <td className={styles["dept-name"]}>{dept.name}</td>
                  <td className={styles["revenue-amount"]}>{formatCurrency(dept.revenue)}</td>
                  <td className={styles["appointment-count"]}>{dept.appointments} lượt</td>
                  <td>
                    <div className={styles["growth-badge"]}>
                      {dept.growth >= 0 ? (
                        <>
                          <Icon name="TrendingUp" />
                          <span className={styles["growth-positive"]}>+{dept.growth}%</span>
                        </>
                      ) : (
                        <>
                          <Icon name="TrendingDown" />
                          <span className={styles["growth-negative"]}>{dept.growth ?? 0}%</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles["section-card"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Giao Dịch Gần Đây</h2>
          <div className={styles["header-actions"]}>
            <div className={styles["date-range-picker"]}>
              <div className={styles["date-input-group"]}>
                <label className={styles["date-label"]}>Từ ngày:</label>
                <input
                  type="date"
                  className={styles["date-input"]}
                  value={fromDateTrans}
                  onChange={(e) => {
                    setFromDateTrans(e.target.value);
                    setTimeRange("range");
                  }}
                />
              </div>
              <div className={styles["date-input-group"]}>
                <label className={styles["date-label"]}>Đến ngày:</label>
                <input
                  type="date"
                  className={styles["date-input"]}
                  value={toDateTrans}
                  onChange={(e) => {
                    setToDateTrans(e.target.value);
                    setTimeRange("range");
                  }}
                />
              </div>
              {(fromDateTrans || toDateTrans) && (
                <button
                  className={styles["clear-dates-btn"]}
                  onClick={() => {
                    setFromDateTrans("");
                    setToDateTrans("");
                    setTimeRange("month");
                  }}
                  title="Xóa bộ lọc ngày"
                >
                  <Icon name="X" />
                </button>
              )}
            </div>
            <button className={styles["view-all-btn"]}>Xem tất cả</button>
          </div>
        </div>
        <div className={styles["table-wrapper"]}>
          <table className={styles["transaction-table"]}>
            <thead>
              <tr>
                <th>Bệnh Nhân</th>
                <th>Dịch Vụ</th>
                <th>Số Tiền</th>
                <th>Thời Gian</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => {
                const time = formatDateTime(transaction.transactionDate);

                return (
                  <tr key={transaction.patientName + transaction.transactionDate}>
                    <td className={styles["patient-name"]}>{transaction.patientName}</td>
                    <td className={styles["service-name"]}>{transaction.serviceName}</td>
                    <td className={styles["transaction-amount"]}>
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className={styles["transaction-date"]}>{typeof time === "string" || time.date}</td>
                    <td>
                      <span className={`${styles["status-badge"]} ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles["section-card"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Biểu Đồ Doanh Thu</h2>
          <div className={styles["chart-controls"]}>
            <button
              className={`${styles["chart-btn"]} ${chartType === "bar" ? styles["chart-btn-active"] : ""}`}
              onClick={() => setChartType("bar")}
            >
              <Icon name="ChartBar" />
              Cột
            </button>
            <button
              className={`${styles["chart-btn"]} ${chartType === "line" ? styles["chart-btn-active"] : ""}`}
              onClick={() => setChartType("line")}
            >
              <Icon name="ChartLine" />
              Đường
            </button>
            <button
              className={`${styles["chart-btn"]} ${chartType === "pie" ? styles["chart-btn-active"] : ""}`}
              onClick={() => setChartType("pie")}
            >
              <Icon name="ChartPie" />
              Tròn
            </button>
          </div>
        </div>
        <div className={styles["chart-container"]}>
          {chartType === "bar" && <RevenueBarChart timeRange={timeRange} />}
          {chartType === "line" && <RevenueLineChart timeRange={timeRange} />}
          {chartType === "pie" && (
            <RevenuePieChart
              appointmentRevenue={revenueData.appointmentRevenue}
              serviceRevenue={revenueData.serviceRevenue}
            />
          )}
        </div>
      </div>
    </div>
  );
}
