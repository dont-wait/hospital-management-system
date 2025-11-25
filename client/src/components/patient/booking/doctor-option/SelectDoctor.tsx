import { cookies } from "next/headers";
import PrevButton from "../PrevButton";
import Icon from "@/components/shared/Icon";
import SelectDoctorOptions from "./SelectDoctorOptions";
import { AppointmentService } from "@/services/server";
import { ApiResponse, ScheduleData } from "@/types";
import styles from "@/styles/booking.module.css";

interface SelectDoctorProps {
  departmentId: string;
  day: string;
}

export default async function SelectDoctor({
  departmentId,
  day,
}: SelectDoctorProps) {
  let scheduleData: ScheduleData | null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const response: ApiResponse<ScheduleData> =
      await AppointmentService.getSchedules(token, day, departmentId);
    scheduleData = response.data;
  } catch {
    scheduleData = null;
  }

  return !scheduleData?.schedules.length ? (
    <div className={styles["booking-box"]}>
      <div className="p-4 w-full h-full flex flex-col justify-center items-center">
        <Icon name="BadgeAlert" className="w-40 h-40 text-east-bay" />
        <h3 className="mt-2 text-lg text center font-medium text-martinique">
          Không tìm thấy bác sĩ phù hợp
        </h3>
      </div>

      <PrevButton />
    </div>
  ) : (
    <div className={styles["booking-box"]}>
      <h2 className={styles["booking-card-heading"]}>Chọn bác sĩ</h2>
      <div className={styles["doctor-options"]}>
        <SelectDoctorOptions schedules={scheduleData?.schedules ?? []} />
      </div>
      <PrevButton />
    </div>
  );
}
