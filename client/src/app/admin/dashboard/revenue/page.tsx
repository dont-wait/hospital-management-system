"use client";

import { useState } from "react";
import AdminContentHeader from "@/components/admin/AdminContentHeader";
import Icon from "@/components/shared/Icon";
import RevenueLineChart from "@/components/admin/RevenueLineChart";
import RevenueBarChart from "@/components/admin/RevenueBarChart";
import RevenuePieChart from "@/components/admin/RevenuePieChart";
import styles from "@/styles/revenue.module.css";

interface RevenueData {
  totalRevenue: number;
  appointmentRevenue: number;
  serviceRevenue: number;
  medicineRevenue: number;
  growthRate: number;
}

interface RevenueByDepartment {
  id: number;
  name: string;
  revenue: number;
  appointments: number;
  growth: number;
}

interface RevenueTransaction {
  id: number;
  patientName: string;
  service: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("month");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("line");

  const revenueData: RevenueData = {
    totalRevenue: 2450000000, // 2.45 tỷ VNĐ
    appointmentRevenue: 980000000,
    serviceRevenue: 1120000000,
    medicineRevenue: 350000000,
    growthRate: 12.5,
  };

  const departmentRevenue: RevenueByDepartment[] = [
    { id: 1, name: "Khoa Nội", revenue: 650000000, appointments: 342, growth: 8.5 },
    { id: 2, name: "Khoa Ngoại", revenue: 580000000, appointments: 289, growth: 15.2 },
    { id: 3, name: "Khoa Sản", revenue: 420000000, appointments: 198, growth: 6.8 },
    { id: 4, name: "Khoa Nhi", revenue: 380000000, appointments: 456, growth: 10.3 },
    { id: 5, name: "Khoa Mắt", revenue: 220000000, appointments: 167, growth: -2.1 },
    { id: 6, name: "Khoa Răng Hàm Mặt", revenue: 200000000, appointments: 234, growth: 18.9 },
  ];

  const recentTransactions: RevenueTransaction[] = [
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      service: "Khám tổng quát + Xét nghiệm máu",
      amount: 1500000,
      date: "2025-12-03 09:30",
      status: "completed",
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      service: "Phẫu thuật nội soi",
      amount: 25000000,
      date: "2025-12-03 08:15",
      status: "completed",
    },
    {
      id: 3,
      patientName: "Lê Văn C",
      service: "Siêu âm thai + Khám sản",
      amount: 800000,
      date: "2025-12-02 15:45",
      status: "completed",
    },
    {
      id: 4,
      patientName: "Phạm Thị D",
      service: "Điều trị răng sứ",
      amount: 12000000,
      date: "2025-12-02 14:20",
      status: "pending",
    },
    {
      id: 5,
      patientName: "Hoàng Văn E",
      service: "Khám mắt + Đo thị lực",
      amount: 500000,
      date: "2025-12-02 11:00",
      status: "completed",
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return styles["status-completed"];
      case "pending":
        return styles["status-pending"];
      case "cancelled":
        return styles["status-cancelled"];
      default:
        return "";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
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

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon-wrap-secondary"]}>
            <Icon name="Package" />
          </div>
          <div className={styles["stat-content"]}>
            <h3 className={styles["stat-label"]}>Doanh Thu Thuốc</h3>
            <p className={styles["stat-value"]}>{formatCurrency(revenueData.medicineRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Department Revenue */}
      <div className={styles["section-card"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>Doanh Thu Theo Khoa</h2>
          <button className={styles["export-btn"]}>
            <Icon name="Download" />
            Xuất báo cáo
          </button>
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
                          <span className={styles["growth-negative"]}>{dept.growth}%</span>
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
          <button className={styles["view-all-btn"]}>Xem tất cả</button>
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
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className={styles["patient-name"]}>{transaction.patientName}</td>
                  <td className={styles["service-name"]}>{transaction.service}</td>
                  <td className={styles["transaction-amount"]}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className={styles["transaction-date"]}>{transaction.date}</td>
                  <td>
                    <span className={`${styles["status-badge"]} ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))}
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
              medicineRevenue={revenueData.medicineRevenue}
            />
          )}
        </div>
      </div>
    </div>
  );
}
