import { BookingSteps, PriorityOption } from "@/types";
import momoPng from "@/public/images/momo.png";
import vnPayPng from "@/public/images/vnpay.png";
import vietQrPng from "@/public/images/vietqr.png";
import zaloPayPng from "@/public/images/zalopay.png";

export const bookingSteps: BookingSteps[] = [
  { id: "record", label: "Hồ sơ" },
  { id: "priority", label: "Chọn ưu tiên" },
  { id: "details", label: "Thông tin khám" },
  { id: "confirm", label: "Xác nhận thông tin" },
  { id: "payment", label: "Thanh toán" },
  { id: "success", label: "Hoàn tất" },
];

export const priorityOptions: PriorityOption[] = [
  {
    id: "specialty" as const,
    label: "Chọn theo Chuyên khoa",
    description: "Tìm bác sĩ theo chuyên môn",
    iconName: "Stethoscope",
  },
  {
    id: "date" as const,
    label: "Chọn theo Ngày khám",
    description: "Chọn ngày và xem bác sĩ có lịch",
    iconName: "Calendar",
  },
  {
    id: "doctor" as const,
    label: "Chọn theo Bác sĩ",
    description: "Tìm theo tên bác sĩ cụ thể",
    iconName: "User",
  },
];

export const defaultBookingData = {
  step: 0,
  patient: null,
  priority: null,
  specialty: "",
  doctor: null,
  date: "",
  timeSlot: "",
  roomName: "",
  price: 200000,
  records: [],
  insurance: "",
};

export const paymentMethods = [
  {
    id: "momo",
    name: "Ví MoMo",
    logo: momoPng,
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    logo: zaloPayPng,
  },
  {
    id: "vnpay",
    name: "VNPay",
    logo: vnPayPng,
  },
  {
    id: "vietqr",
    name: "VietQR",
    logo: vietQrPng,
  },
];
