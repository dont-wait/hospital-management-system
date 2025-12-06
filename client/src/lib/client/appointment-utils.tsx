import { formatDateTime } from "@/lib/client";
import { Appointment, DateTime } from "@/types";

export class AppointmentUtils {
  static getStatusColor = (status: string) => {
    switch (status) {
      case "Unpaid":
        return "bg-silver text-white border border-silver";
      case "Paid":
        return "bg-green-500/20 text-green-200 border border-green-500/30";
      case "Cancelled":
        return "bg-red-500/20 text-red-200 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-200 border border-gray-500/30";
    }
  };

  static getStatusText = (status: string) => {
    switch (status) {
      case "Unpaid":
        return "Chưa thanh toán";
      case "Paid":
        return "Đã thanh toán";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };
  static formatAppointmentTime(appointment: Appointment) {
    let startTime: DateTime | string = formatDateTime(
      appointment.appointmentStartTime,
    );
    let endTime: DateTime | string = formatDateTime(
      appointment.appointmentEndTime,
    );

    if (typeof startTime !== "string") startTime = (startTime as DateTime).date;

    if (typeof endTime !== "string") endTime = (endTime as DateTime).date;

    return `${startTime} - ${endTime}`;
  }
}
