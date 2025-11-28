import { z } from "zod";

export const createShiftSchema = z.object({
  taskName: z.string().min(1, "Tên ca làm việc không được để trống"),
  date: z.string().min(1, "Ngày không được để trống").regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ"),
  workShift: z.enum(["0", "1"], { message: "Vui lòng chọn ca làm việc" }),
  roomId: z.string().min(1, "Phòng khám không được để trống"),
  description: z.string().optional(),
  selectedDoctors: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một bác sĩ"),
});

export type CreateShiftFormData = z.infer<typeof createShiftSchema>;

export interface CreateShiftPayload {
  taskName: string;
  date: string;
  workShift: number;
  description?: string;
  departmentId: number;
  roomId: number;
  taskRegistrations: {
    employeeId: string;
  }[];
}