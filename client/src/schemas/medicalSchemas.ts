import { z } from "zod";

export const medicalVisitSchema = z.object({
  symptoms: z.string().min(1, "Triệu chứng không được để trống"),
  physicalExamination: z.string().optional(),
  diagnosis: z.string().min(1, "Chẩn đoán không được để trống"),
  treatment: z.string().min(1, "Điều trị không được để trống"),
  note: z.string().optional(),
  imageResult: z.string().optional(),
  appointmentId: z.number().min(1, "ID lịch hẹn không hợp lệ"),
});

export const prescriptionDetailSchema = z.object({
  medicineId: z.number().min(1, "Vui lòng chọn thuốc"),
  medicineName: z.string().min(1, "Tên thuốc không được để trống"),
  dosage: z.number().min(1, "Liều dùng phải lớn hơn 0"),
  frequency: z.number().min(1, "Tần suất phải lớn hơn 0"),
  duration: z.number().min(1, "Thời gian điều trị phải lớn hơn 0"),
  route: z.string().min(1, "Đường dùng không được để trống"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

export const prescriptionSchema = z.object({
  instructions: z.string().min(1, "Hướng dẫn sử dụng không được để trống"),
  note: z.string().min(1, "Ghi chú không được để trống"),
  medicalVisitId: z.number().min(1, "ID lần khám không hợp lệ"),
  prescriptionDetails: z
    .array(prescriptionDetailSchema)
    .min(1, "Phải có ít nhất 1 loại thuốc"),
});

export type MedicalVisitForm = z.infer<typeof medicalVisitSchema>;
export type PrescriptionForm = z.infer<typeof prescriptionSchema>;
