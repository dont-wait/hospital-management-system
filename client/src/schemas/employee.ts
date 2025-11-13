import { z } from "zod";

export const employeeUpdateSchema = z.object({
  phoneNumber: z
    .string()
    .length(10, "Số điện thoại phải có đúng 10 chữ số"),
  avatarUrl: z.string().optional().or(z.literal("")),
  
  firstName: z
    .string()
    .min(1, "Họ và tên đệm là bắt buộc")
    .max(30, "Họ và tên đệm không được quá 30 ký tự")
    .optional(),
  lastName: z
    .string()
    .min(1, "Tên là bắt buộc")
    .max(150, "Tên không được quá 150 ký tự")
    .optional(),
  dateOfBirth: z.string().optional(),
  hireDate: z.string().optional(),
  gender: z.enum(["M", "F", "O"]).optional(),
  specialization: z
    .string()
    .max(100, "Chuyên khoa không được quá 100 ký tự")
    .optional()
    .or(z.literal("")),
  certificateNumber: z
    .string()
    .length(10, "Chứng chỉ hành nghề phải có đúng 10 ký tự")
    .optional(),
});

export type EmployeeUpdateDto = z.infer<typeof employeeUpdateSchema>;
