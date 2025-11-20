import AdminContentHeader from "@/components/admin/AdminContentHeader";
import DashboardCharts from "@/components/admin/DashboardCharts";
import DashboardHistory from "@/components/admin/DashboardHistory";
import StatCard from "@/components/admin/StatCard";
import styles from "@/styles/admin.module.css";

export default function AdminPage() {
  return (
    <div className={styles["admin-container"]}>
      <AdminContentHeader
        title="Dashboard"
        description="Chào mừng bạn đến với trang quản trị bệnh viện"
      />
      <div className={styles["stats-grid"]}>
        <StatCard title="Tổng Bệnh Nhân" value="1,234" iconName="UserRound" />
        <StatCard title="Bác Sĩ" value="56" iconName="Stethoscope" />
        <StatCard title="Lịch Hẹn Hôm Nay" value="42" iconName="Calendar" />
        <StatCard title="Tổng Người Dùng" value="1,523" iconName="Users" />
      </div>
      <DashboardCharts />
      <DashboardHistory />
    </div>
  );
}
