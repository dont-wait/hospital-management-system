import Link from "next/link";
import Icon from "@/components/shared/Icon";
import { DateUtils, PatientUtils } from "@/lib/client";
import { Appointment } from "@/types";

interface AppointmentProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments }: AppointmentProps) {
  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-anakiwa/20 flex items-center justify-center mb-4">
          <Icon name="CalendarX2" className="w-10 h-10 text-truev" />
        </div>
        <h3 className="text-xl font-semibold text-martinique mb-2">
          Không có bệnh nhân nào
        </h3>
        <p className="text-eastbay text-center max-w-md">
          Hiện tại chưa có lịch hẹn nào. Danh sách sẽ được cập nhật khi có bệnh
          nhân đặt lịch khám.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((item, idx) => (
        <div
          key={item.appointmentId}
          className="
            bg-white border border-silver/40 
            rounded-xl shadow-sm 
            hover:shadow-md hover:bg-anakiwa/10
            transition p-5
          "
        >
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-truev text-white flex items-center justify-center font-semibold shadow">
                {idx + 1}
              </div>
              <div className="text-martinique font-semibold text-lg">
                {item.fullName}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-1 text-eastbay">
              <div className="font-medium">
                {DateUtils.getDisplayDateTime(
                  item.appointmentDate,
                  "DayMonthYear",
                )}
              </div>
              <div className="flex gap-2 items-center text-sm">
                <span className="px-2 py-0.5 rounded-md bg-mauve/40 text-martinique">
                  {PatientUtils.formatGender(item.gender)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-eastbay/20 text-eastbay">
                  {item.appointmentStartTime} – {item.appointmentEndTime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/doctor/diagnosis"
                className="flex items-center gap-2 bg-truev text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-truev/90 transition"
              >
                <Icon name="Stethoscope" className="w-4" />
                Bắt đầu khám
              </Link>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-truev text-white flex items-center justify-center font-semibold shadow">
                {idx + 1}
              </div>
              <div className="text-martinique font-semibold text-lg flex-1">
                {item.fullName}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-eastbay">
                {DateUtils.getDisplayDateTime(
                  item.appointmentDate,
                  "DayMonthYear",
                )}
              </div>
              <div className="flex gap-2 items-center text-sm flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-mauve/40 text-martinique">
                  {PatientUtils.formatGender(item.gender)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-eastbay/20 text-eastbay">
                  {item.appointmentStartTime} – {item.appointmentEndTime}
                </span>
              </div>
            </div>

            <Link
              href="/doctor/diagnosis"
              className="flex items-center justify-center gap-2 bg-truev text-white font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-truev/90 transition w-full"
            >
              <Icon name="Stethoscope" className="w-4" />
              Bắt đầu khám
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
