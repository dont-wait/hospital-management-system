"use client";

import { useForm } from "react-hook-form";
import { Save, FileText, ArrowRight } from "lucide-react";
import { MedicalVisitService } from "@/services";
import { MedicalVisitFormData, MedicalVisitResult } from "@/types";

interface MedicalVisitFormProps {
  appointmentId: number;
  onSubmitSuccess: (data: MedicalVisitResult) => void;
}

export default function MedicalVisitForm({
  appointmentId,
  onSubmitSuccess,
}: MedicalVisitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MedicalVisitFormData>({
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

  const onSubmit = async (data: MedicalVisitFormData) => {
    const response = await MedicalVisitService.createMedicalVist(data);
    if (response?.data) {
      onSubmitSuccess(response.data);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-east-bay">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-east-bay" />
        <h2 className="text-2xl font-bold text-east-bay">
          Bước 1: Ghi Nhận Chẩn Đoán
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-east-bay">
            Triệu chứng <span className="text-martinique">*</span>
          </label>
          <textarea
            {...register("symptoms", {
              required: "Vui lòng nhập triệu chứng",
            })}
            rows={4}
            className="w-full px-4 py-2 border border-silver rounded-lg focus:ring-2 focus:outline-none"
            placeholder="Mô tả các triệu chứng của bệnh nhân..."
          />
          {errors.symptoms && (
            <p className="text-sm mt-1 text-red-500">
              {errors.symptoms.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-east-bay font-medium mb-2">
            Chuẩn đoán lâm sàng <span className="text-martinique">*</span>
          </label>
          <textarea
            {...register("physicalExamination", {
              required: "Vui lòng nhập chuẩn đoán lâm sàng",
            })}
            rows={4}
            className="w-full px-4 py-2 border border-silver rounded-lg focus:ring-2 focus:outline-none"
            placeholder="Kết quả khám lâm sàng..."
          />
          {errors.physicalExamination && (
            <p className="text-sm mt-1 text-red-500">
              {errors.physicalExamination.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-east-bay font-medium mb-2">
            Chẩn đoán <span className="text-martinique">*</span>
          </label>
          <textarea
            {...register("diagnosis", {
              required: "Vui lòng nhập chẩn đoán",
            })}
            rows={3}
            className="w-full px-4 py-2 border border-silver rounded-lg focus:ring-2 focus:outline-none"
            placeholder="Chẩn đoán bệnh..."
          />
          {errors.diagnosis && (
            <p className="text-sm mt-1 text-red-500">
              {errors.diagnosis.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-east-bay font-medium mb-2">
            Điều trị <span className="text-martinique">*</span>
          </label>
          <textarea
            {...register("treatment", {
              required: "Vui lòng nhập phương pháp điều trị",
            })}
            rows={3}
            className="w-full px-4 py-2 border border-silver rounded-lg focus:ring-2 focus:outline-none"
            placeholder="Phương pháp điều trị..."
          />
          {errors.treatment && (
            <p className="text-sm mt-1 text-red-500">
              {errors.treatment.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-east-bay font-medium mb-2">
            Ghi chú
          </label>
          <textarea
            {...register("note")}
            rows={2}
            className="w-full px-4 py-2 border border-silver rounded-lg focus:ring-2 focus:outline-none"
            placeholder="Ghi chú bổ sung (nếu có)..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center bg-east-bay gap-2 px-6 py-3 text-white rounded-lg font-semibold disabled:opacity-50 transition-all hover:opacity-90"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Đang lưu..." : "Lưu và tiếp tục kê đơn"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
