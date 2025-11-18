import { z } from "zod";

export const createShiftSchema = z.object({
  shiftName: z.string().min(1, "Tên ca làm việc không được để trống"),
  room: z.string().min(1, "Phòng khám không được để trống"),
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
  startTime: z.string().min(1, "Giờ bắt đầu không được để trống"),
  endTime: z.string().min(1, "Giờ kết thúc không được để trống"),
  description: z.string().optional(),
}).refine((data) => {
  const start = new Date(`${data.startDate}T${data.startTime}`);
  const end = new Date(`${data.endDate}T${data.endTime}`);
  return end > start;
}, {
  message: "Ngày/Giờ kết thúc phải sau ngày/giờ bắt đầu",
  path: ["endDate"],
});

export type CreateShiftFormData = z.infer<typeof createShiftSchema>;