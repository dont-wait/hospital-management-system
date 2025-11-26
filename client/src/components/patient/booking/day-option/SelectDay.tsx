import { cookies } from "next/headers";
import PrevButton from "@/components/patient/booking/PrevButton";
import SelectDayOptions from "./SelectDayOptions";
import { AppointmentService } from "@/services/server";
import { AppointmentUtils } from "@/lib/server";
import { ApiResponse, ScheduleData } from "@/types";
import styles from "@/styles/booking.module.css";

export default async function SelectDay() {
  let days: string[];
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const response: ApiResponse<ScheduleData> =
      await AppointmentService.getSchedules(token);
    days = AppointmentUtils.extractDays(response.data.schedules);
  } catch {
    days = [];
  }
  return (
    <div className={`${styles["booking-box"]} md:mx-24 lg:mx-48`}>
      <SelectDayOptions scheduleDays={days} />
      <PrevButton />
    </div>
  );
}
