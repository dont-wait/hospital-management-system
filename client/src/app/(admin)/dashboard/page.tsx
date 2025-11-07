'use client';

import { StatCard } from "@/components/admin/StatCard";
import { Users, UserRound, Stethoscope, Calendar, Activity, Clock } from "@/lib/client";
import styles from "@/styles/admin.module.css";

function AdminPage() {
    return (
        <div className={styles["admin-container"]}>
            <div className={styles["admin-content"]}>
                {/* Dashboard Header */}
                <div className={styles["dashboard-header"]}>
                    <h1 className={styles["dashboard-title"]}>Dashboard</h1>
                    <p className={styles["dashboard-subtitle"]}>
                        Chào mừng bạn đến với trang quản trị bệnh viện
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className={styles["stats-grid"]}>
                    <StatCard
                        title="Tổng Bệnh Nhân"
                        value="1,234"
                        icon={UserRound}
                        color="blue"
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="Bác Sĩ"
                        value="56"
                        icon={Stethoscope}
                        color="green"
                        trend={{ value: 3, isPositive: true }}
                    />
                    <StatCard
                        title="Lịch Hẹn Hôm Nay"
                        value="42"
                        icon={Calendar}
                        color="purple"
                        trend={{ value: 8, isPositive: false }}
                    />
                    <StatCard
                        title="Tổng Người Dùng"
                        value="1,523"
                        icon={Users}
                        color="orange"
                        trend={{ value: 5, isPositive: true }}
                    />
                </div>

                {/* Charts Section */}
                <div className={styles["charts-section"]}>
                    <div className={styles["chart-card"]}>
                        <h2 className={styles["chart-title"]}>Thống Kê Bệnh Nhân Theo Tháng</h2>
                        <div className={styles["chart-placeholder"]}>
                            Biểu đồ sẽ được thêm ở đây
                        </div>
                    </div>
                    <div className={styles["chart-card"]}>
                        <h2 className={styles["chart-title"]}>Lịch Hẹn Theo Tuần</h2>
                        <div className={styles["chart-placeholder"]}>
                            Biểu đồ sẽ được thêm ở đây
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={styles["recent-activity"]}>
                    <h2 className={styles["activity-title"]}>Hoạt Động Gần Đây</h2>
                    <div className={styles["activity-list"]}>
                        <div className={styles["activity-item"]}>
                            <div className={styles["activity-icon"]}>
                                <UserRound size={16} />
                            </div>
                            <div className={styles["activity-content"]}>
                                <p className={styles["activity-text"]}>
                                    Bệnh nhân mới <strong>Nguyễn Văn A</strong> đã đăng ký
                                </p>
                                <span className={styles["activity-time"]}>5 phút trước</span>
                            </div>
                        </div>
                        <div className={styles["activity-item"]}>
                            <div className={styles["activity-icon"]}>
                                <Calendar size={16} />
                            </div>
                            <div className={styles["activity-content"]}>
                                <p className={styles["activity-text"]}>
                                    Lịch hẹn mới với <strong>BS. Trần Thị B</strong>
                                </p>
                                <span className={styles["activity-time"]}>15 phút trước</span>
                            </div>
                        </div>
                        <div className={styles["activity-item"]}>
                            <div className={styles["activity-icon"]}>
                                <Activity size={16} />
                            </div>
                            <div className={styles["activity-content"]}>
                                <p className={styles["activity-text"]}>
                                    Cập nhật hồ sơ bệnh nhân <strong>Lê Văn C</strong>
                                </p>
                                <span className={styles["activity-time"]}>1 giờ trước</span>
                            </div>
                        </div>
                        <div className={styles["activity-item"]}>
                            <div className={styles["activity-icon"]}>
                                <Clock size={16} />
                            </div>
                            <div className={styles["activity-content"]}>
                                <p className={styles["activity-text"]}>
                                    Lịch hẹn đã hoàn thành với <strong>Phạm Thị D</strong>
                                </p>
                                <span className={styles["activity-time"]}>2 giờ trước</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;