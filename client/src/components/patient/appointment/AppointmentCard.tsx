"use client";

import Icon from "@/components/shared/Icon";
import { DateUtils, AppointmentUtils } from "@/lib/client";
import { useAppointmentManagemnt } from "@/contexts";
import { CurrencyUtils } from "@/lib/client/currency-utils";
import { Appointment } from "@/types";

interface AppointmentProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentProps) {
  const { setAppointmentId } = useAppointmentManagemnt();

  return (
    <div
      onClick={() => {
        setAppointmentId(appointment.appointmentId);
      }}
      className="p-4 border border-silver rounded cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-east-bay flex items-center justify-center">
            <div className="w-5 h-5">
              <Icon name="User" className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-martinique">{appointment.fullName}</h3>
            <p className="text-sm text-truev">
              Mã: #{appointment.appointmentId.toString().padStart(6, "0")}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs ${AppointmentUtils.getStatusColor(appointment.appointmentStatus)}`}
        >
          {AppointmentUtils.getStatusText(appointment.appointmentStatus)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-east-bay">
          <div className="w-4 h-4">
            <Icon name="Calendar" className="w-4 h-4"/>
          </div>
          <span className="text-sm">
            {DateUtils.getDisplayDateTime(
              appointment.appointmentDate,
              "DayMonthYear",
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-east-bay">
          <div className="w-4 h-4">
            <Icon name="Clock" className="w-4 h-4"/>
          </div>
          <span className="text-sm">
            {AppointmentUtils.formatAppointmentTime(appointment)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-east-bay">
          <div className="w-4 h-4">
            <Icon name="Building2" className="w-4 h-4"/>
          </div>
          <span className="text-sm">{appointment.departmentName}</span>
        </div>
        <div className="flex items-center gap-2 text-martinique font-bold">
          <span className="text-sm">
            Giá: {CurrencyUtils.formatCurrency(appointment.priceOfService)}
          </span>
        </div>
      </div>
    </div>
  );
}
