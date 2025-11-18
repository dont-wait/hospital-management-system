import "server-only";
import { ApiResponse, ScheduleData } from "@/types";

export class AppointmentService {
  public static async getSchedules(): Promise<ApiResponse<ScheduleData>> {
    const schedules: ApiResponse<ScheduleData> = {
      status: 200,
      message: "Lấy danh sách phòng ban thành công",
      data: {
        date: "2025-11",
        departmentId: 1,
        departmentName: "Khoa Khám Bệnh",
        departmentLocation: "Tầng trệt, Khu A",
        departmentDescription:
          "Tiếp nhận khám ngoại trú và sàng lọc bệnh nhân. Điều phối khám chuyên khoa.",
        schedules: [
          {
            scheduleId: "123",
            roomName: "Phòng 6 Tòa A",
            startTime: "08:00 2025-11-20",
            endTime: "12:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "200000",
            doctor: {
              doctorId: "D001",
              fullName: "BS. Nguyễn Văn A",
              specialization: "Khoa Khám Bệnh",
            },
            slots: [
              {
                slotId: "1",
                slotStatus: "Opened",
                slotStartTime: "08:00",
                slotEndTime: "08:30",
              },
              {
                slotId: "2",
                slotStatus: "Closed",
                slotStartTime: "08:30",
                slotEndTime: "09:00",
              },
              {
                slotId: "3",
                slotStatus: "Fulled",
                slotStartTime: "09:00",
                slotEndTime: "09:30",
              },
              {
                slotId: "4",
                slotStatus: "Opened",
                slotStartTime: "09:30",
                slotEndTime: "10:00",
              },
            ],
          },
          {
            scheduleId: "124",
            roomName: "Phòng 7 Tòa A",
            startTime: "13:00 2025-11-20",
            endTime: "17:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "250000",
            doctor: {
              doctorId: "D002",
              fullName: "BS. Trần Thị B",
              specialization: "Khoa Nội - Nhiễm",
            },
            slots: [
              {
                slotId: "5",
                slotStatus: "Opened",
                slotStartTime: "13:00",
                slotEndTime: "13:30",
              },
              {
                slotId: "6",
                slotStatus: "Opened",
                slotStartTime: "13:30",
                slotEndTime: "14:00",
              },
              {
                slotId: "7",
                slotStatus: "Fulled",
                slotStartTime: "14:00",
                slotEndTime: "14:30",
              },
            ],
          },
          {
            scheduleId: "125",
            roomName: "Phòng Cấp Cứu 1",
            startTime: "00:00 2025-11-20",
            endTime: "23:59 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "300000",
            doctor: {
              doctorId: "D003",
              fullName: "BS. Lê Văn C",
              specialization: "Khoa Cấp Cứu",
            },
            slots: [
              {
                slotId: "8",
                slotStatus: "Opened",
                slotStartTime: "08:00",
                slotEndTime: "08:30",
              },
              {
                slotId: "9",
                slotStatus: "Opened",
                slotStartTime: "08:30",
                slotEndTime: "09:00",
              },
            ],
          },
          {
            scheduleId: "127",
            roomName: "Phòng 3 Lầu 2",
            startTime: "14:00 2025-11-20",
            endTime: "18:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "220000",
            doctor: {
              doctorId: "D004",
              fullName: "BS. Phạm Thị D",
              specialization: "Khoa Ngoại Tổng Quát",
            },
            slots: [
              {
                slotId: "12",
                slotStatus: "Opened",
                slotStartTime: "14:00",
                slotEndTime: "14:30",
              },
              {
                slotId: "13",
                slotStatus: "Closed",
                slotStartTime: "14:30",
                slotEndTime: "15:00",
              },
            ],
          },
          {
            scheduleId: "128",
            roomName: "Phòng 1 Lầu 3",
            startTime: "08:00 2025-11-20",
            endTime: "12:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "280000",
            doctor: {
              doctorId: "D005",
              fullName: "BS. Hoàng Văn E",
              specialization: "Ngoại khoa",
            },
            slots: [
              {
                slotId: "14",
                slotStatus: "Opened",
                slotStartTime: "08:00",
                slotEndTime: "08:30",
              },
              {
                slotId: "15",
                slotStatus: "Fulled",
                slotStartTime: "08:30",
                slotEndTime: "09:00",
              },
            ],
          },
          {
            scheduleId: "129",
            roomName: "Phòng Khám Phụ Sản",
            startTime: "07:30 2025-11-20",
            endTime: "11:30 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "250000",
            doctor: {
              doctorId: "D006",
              fullName: "BS. Nguyễn Thị F",
              specialization: "Khoa Sản - Phụ Khoa",
            },
            slots: [
              {
                slotId: "16",
                slotStatus: "Opened",
                slotStartTime: "07:30",
                slotEndTime: "08:00",
              },
              {
                slotId: "17",
                slotStatus: "Opened",
                slotStartTime: "08:00",
                slotEndTime: "08:30",
              },
            ],
          },
          {
            scheduleId: "130",
            roomName: "Phòng Khám Nhi 1",
            startTime: "08:00 2025-11-20",
            endTime: "16:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "180000",
            doctor: {
              doctorId: "D007",
              fullName: "BS. Võ Thị G",
              specialization: "khoa Nhi",
            },
            slots: [
              {
                slotId: "18",
                slotStatus: "Opened",
                slotStartTime: "08:00",
                slotEndTime: "08:30",
              },
              {
                slotId: "19",
                slotStatus: "Closed",
                slotStartTime: "08:30",
                slotEndTime: "09:00",
              },
            ],
          },
          {
            scheduleId: "131",
            roomName: "Phòng X-Quang",
            startTime: "07:00 2025-11-20",
            endTime: "17:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "150000",
            doctor: {
              doctorId: "D008",
              fullName: "BS. Đặng Văn H",
              specialization: "Khoa Chẩn Đoán Hình Ảnh",
            },
            slots: [
              {
                slotId: "20",
                slotStatus: "Opened",
                slotStartTime: "07:00",
                slotEndTime: "07:30",
              },
              {
                slotId: "21",
                slotStatus: "Fulled",
                slotStartTime: "07:30",
                slotEndTime: "08:00",
              },
            ],
          },
          {
            scheduleId: "132",
            roomName: "Phòng Lấy Mẫu",
            startTime: "06:00 2025-11-20",
            endTime: "10:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "100000",
            doctor: {
              doctorId: "D009",
              fullName: "BS. Lý Thị I",
              specialization: "Khoa Nội - Nhiễm",
            },
            slots: [
              {
                slotId: "22",
                slotStatus: "Opened",
                slotStartTime: "06:00",
                slotEndTime: "06:30",
              },
              {
                slotId: "23",
                slotStatus: "Opened",
                slotStartTime: "06:30",
                slotEndTime: "07:00",
              },
            ],
          },
          {
            scheduleId: "133",
            roomName: "Phòng Vật Lý Trị Liệu",
            startTime: "08:00 2025-11-20",
            endTime: "17:00 2025-11-20",
            scheduleStatus: "Opened",
            priceOfSchedule: "200000",
            doctor: {
              doctorId: "D010",
              fullName: "BS. Phan Văn K",
              specialization: "Khoa Ngoại Tổng Quát",
            },
            slots: [
              {
                slotId: "24",
                slotStatus: "Opened",
                slotStartTime: "08:00",
                slotEndTime: "09:00",
              },
              {
                slotId: "25",
                slotStatus: "Closed",
                slotStartTime: "09:00",
                slotEndTime: "10:00",
              },
            ],
          },
        ],
      },
    };
    return schedules;
  }
}
