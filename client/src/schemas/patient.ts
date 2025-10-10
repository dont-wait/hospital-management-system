import { z } from "zod";

export const patientUpdateSchema = z.object({
  firstName: z.string().min(1, "Tên không được để trống"),
  lastName: z.string().min(1, "Họ và tên đệm không được để trống"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
  nationality: z.string().min(1, "Quốc tịch không được để trống"),
  gender: z.string().min(1, "Giới tính không được để trống"),
  placeOfResidence: z.string().min(1, "Nơi sinh không được để trống"),
  address: z.string().min(1, "Địa chỉ thường trú không được để trống"),
  avatarUrl: z.string(),
});

export type PatientUpdateDto = z.infer<typeof patientUpdateSchema>;
