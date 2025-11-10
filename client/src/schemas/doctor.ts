import { z } from "zod";

export const employeeUpdateLimitedSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
    .max(10, "Số điện thoại không được quá 10 chữ số"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Email là bắt buộc"),
  avatarUrl: z.string().url("URL avatar không hợp lệ").optional(),
});

export const employeeUpdateFullSchema = z.object({
  firstName: z
    .string()
    .min(1, "Họ và tên đệm là bắt buộc")
    .max(50, "Họ và tên đệm không được quá 50 ký tự"),
  lastName: z
    .string()
    .min(1, "Tên là bắt buộc")
    .max(50, "Tên không được quá 50 ký tự"),
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
    .max(10, "Số điện thoại không được quá 10 chữ số"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Email là bắt buộc"),
  dateOfBirth: z.string().min(1, "Ngày sinh là bắt buộc"),
  gender: z.enum(["M", "F", "O"], {
    message: "Giới tính là bắt buộc",
  }),
  specialization: z
    .string()
    .min(1, "Chuyên khoa là bắt buộc")
    .max(100, "Chuyên khoa không được quá 100 ký tự"),
  certificateNumber: z
    .string()
    .min(1, "Chứng chỉ hành nghề là bắt buộc")
    .max(50, "Chứng chỉ hành nghề không được quá 50 ký tự"),
  avatarUrl: z.string().url("URL avatar không hợp lệ").optional(),
});

export type EmployeeUpdateLimitedDto = z.infer<typeof employeeUpdateLimitedSchema>;
export type EmployeeUpdateFullDto = z.infer<typeof employeeUpdateFullSchema>;
