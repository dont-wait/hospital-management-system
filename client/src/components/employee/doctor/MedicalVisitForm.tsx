"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  medicalVisitSchema,
  type MedicalVisitForm,
} from "@/schemas/medicalSchemas";

import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { Save, FileText } from "lucide-react";

interface MedicalVisitFormProps {
  appointmentId: number;
  onSubmit: (data: MedicalVisitForm) => Promise<void>;
}

export function MedicalVisitForm({
  appointmentId,
  onSubmit,
}: MedicalVisitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MedicalVisitForm>({
    resolver: zodResolver(medicalVisitSchema),
    defaultValues: {
      appointmentId,
      symptoms: "",
      physicalExamination: "",
      diagnosis: "",
      treatment: "",
      note: "",
      imageResult: "",
    },
  });

  const onSubmitForm = async (data: MedicalVisitForm) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const fields = [
    {
      id: "symptoms",
      label: "Triệu chứng",
      placeholder: "Mô tả các triệu chứng của bệnh nhân...",
      rows: 4,
    },
    {
      id: "physicalExamination",
      label: "Chuẩn đoán lâm sàn",
      placeholder: "Kết quả khám lâm sàng...",
      rows: 4,
    },
    {
      id: "diagnosis",
      label: "Chuẩn đoán",
      placeholder: "Chẩn đoán bệnh...",
      rows: 3,
    },
    {
      id: "treatment",
      label: "Điều trị",
      placeholder: "Phương pháp điều trị...",
      rows: 3,
    },
    {
      id: "note",
      label: "Ghi chú",
      placeholder: "Ghi chú bổ sung (nếu có)...",
      rows: 2,
    },
  ] as const;

  return (
    <div className="bg-white rounded-md shadow-lg p-6 border-t-8 border-east-bay">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-east-bay" />
        <h2 className="text-2xl font-bold text-gray-800">
          Ghi Nhận Chuẩn Đoán
        </h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.id}
            id={field.id}
            type="textarea"
            label={field.label}
            placeholder={field.placeholder}
            rows={field.rows}
            errors={errors}
            register={register}
          />
        ))}
      </div>

      {/* Submit */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit(onSubmitForm)} disabled={isSubmitting}>
          <Save className="w-5 h-5" />
          {isSubmitting ? "Đang lưu..." : "Lưu chuẩn đoán"}
        </Button>
      </div>
    </div>
  );
}
