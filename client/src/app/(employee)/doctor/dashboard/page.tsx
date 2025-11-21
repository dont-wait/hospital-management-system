import { cookies } from "next/headers";
import DoctorContentHeader from "@/components/employee/doctor/DoctorContentHeader";
import DashboardQueueHeader from "@/components/employee/doctor/DashboardQueueHeader";
import QueueTableHeader from "@/components/employee/doctor/QueueTableHeader";
import QueueTableBody from "@/components/employee/doctor/QueueTableBody";
import StatCard from "@/components/shared/StatCard";
import { Employee, AuthUserWithoutTokens } from "@/types";
import { DoctorService } from "@/services/server";
import styles from "@/styles/admin.module.css";
import doctorStyles from "@/styles/doctor.module.css";

const waitingQueue = [
  {
    id: 1,
    stt: 1,
    name: "Trần Thị B",
    symptoms: "Đau đầu, sốt nhẹ",
    appointmentType: "BHYT",
  },
  {
    id: 2,
    stt: 2,
    name: "Lê Văn C",
    symptoms: "Ho, khó thở",
    appointmentType: "DV Offline",
  },
  {
    id: 3,
    stt: 3,
    name: "Phạm Thị D",
    symptoms: "Đau bụng",
    appointmentType: "BHYT",
  },
  {
    id: 4,
    stt: 4,
    name: "Hoàng Văn E",
    symptoms: "Tái khám tiểu đường",
    appointmentType: "DV Online",
  },
];

export default async function DoctorDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const authData: AuthUserWithoutTokens =
    await DoctorService.getDoctorInfo(token);
  const doctor = authData.employee as Employee;

  return (
    <div className={styles["admin-container"]}>
      {doctor && <DoctorContentHeader doctor={doctor} />}

      <div className={doctorStyles["stats-section"]}>
        <h2 className={doctorStyles["section-title"]}>Thống Kê Nhanh</h2>
        <div className={doctorStyles["stats-grid"]}>
          <StatCard title="Số bệnh nhân đã khám" value="142" iconName="Users" />
          <StatCard title="Ca khám hôm nay" value="12" iconName="Activity" />
          <StatCard title="Đơn thuốc đã kê" value="8" iconName="FileText" />
          <StatCard
            title="Xét nghiệm yêu cầu"
            value="5"
            iconName="Stethoscope"
          />
          <StatCard title="Ca tái khám" value="3" iconName="Calendar" />
          <StatCard
            title="Đã hoàn thành"
            value="7"
            iconName="AlarmClockCheck"
          />
        </div>
      </div>

      <div className={doctorStyles["queue-container"]}>
        <DashboardQueueHeader queueBadge={waitingQueue.length} />
        <div className={doctorStyles["table-wrapper"]}>
          <table className={doctorStyles["queue-table"]}>
            <QueueTableHeader />
            <QueueTableBody patients={waitingQueue} />
          </table>
        </div>
      </div>
    </div>
  );
}

