import { cookies } from "next/headers";
import DoctorContentHeader from "@/components/employee/doctor/DoctorContentHeader";
import DashboardQueueHeader from "@/components/employee/doctor/DashboardQueueHeader";
import AppointmentList from "@/components/employee/doctor/AppointmentList";
import StatCard from "@/components/shared/StatCard";
import { Employee, AuthUserWithoutTokens } from "@/types";
import { DoctorService, AppointmentService } from "@/services/server";
import styles from "@/styles/admin.module.css";
import doctorStyles from "@/styles/doctor.module.css";

export default async function DoctorDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const authData: AuthUserWithoutTokens =
    await DoctorService.getDoctorInfo(token);
  const doctor = authData.employee as Employee;
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const appointmentList = await AppointmentService.getAppointments(
    token,
    "",
    `${month}/${day}/${year}`,
    doctor.doctorId,
  );
  const appointments = appointmentList?.data ?? [];

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
        <DashboardQueueHeader queueBadge={appointments.length} />
        <AppointmentList appointments={appointments} />
      </div>
    </div>
  );
}
