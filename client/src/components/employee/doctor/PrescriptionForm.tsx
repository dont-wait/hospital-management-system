"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Save, FileText, CheckCircle } from "lucide-react";
import { PrescriptionService } from "@/services";
import { PrescriptionFormData, MedicalVisitResult } from "@/types";

export interface PrescriptionFormProps {
  medicalVisitData: MedicalVisitResult;
  onComplete: () => void;
}

export default function PrescriptionForm({
  medicalVisitData,
  onComplete,
}: PrescriptionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormData>({
    defaultValues: {
      medicalVisitId: medicalVisitData?.id,
      instructions: "",
      note: "",
      prescriptionDetails: [
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          duration: "",
          route: "Uống",
          quantity: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescriptionDetails",
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    await PrescriptionService.addPrescription(data);
    onComplete();
  };

  const addMedication = () => {
    append({
      medicationName: "",
      dosage: "",
      frequency: "",
      duration: "",
      route: "Uống",
      quantity: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-truev">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-truev" />
        <h2 className="text-2xl font-bold text-martinique">
          Bước 2: Kê Đơn Thuốc
        </h2>
      </div>

      {/* Thông tin chẩn đoán đã lưu */}
      <div
        className="mb-6 p-4 rounded-lg border-mauve"
        style={{
          backgroundColor: "#f0ebff",
          borderWidth: "1px",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-truev" />
          <h3 className="font-semibold text-truev">Chẩn đoán đã lưu</h3>
        </div>
        <p className="text-sm text-martinique">
          <strong>Chẩn đoán:</strong> {medicalVisitData?.diagnosis || "N/A"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Danh sách thuốc */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={addMedication}
              className="flex bg-truev items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Thêm thuốc
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-lg border border-silver bg-[#fafafa]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-truev">
                    Thuốc #{index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 rounded-lg transition-all hover:opacity-90 text-mauve"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-truev font-medium mb-2">
                      Tên thuốc <span className="text-martinique">*</span>
                    </label>
                    <input
                      {...register(
                        `prescriptionDetails.${index}.medicationName`,
                        {
                          required: "Vui lòng nhập tên thuốc",
                        },
                      )}
                      className="w-full px-4 py-2 border border-silver rounded-lg outline-none transition-all"
                      placeholder="Nhập tên thuốc..."
                    />
                    {errors.prescriptionDetails?.[index]?.medicationName && (
                      <p className="text-sm text-red-500 mt-1">
                        {
                          errors.prescriptionDetails[index]?.medicationName
                            ?.message
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-truev font-medium mb-2">
                      Liều lượng <span className="text-martinique">*</span>
                    </label>
                    <input
                      {...register(`prescriptionDetails.${index}.dosage`, {
                        required: "Vui lòng nhập liều lượng",
                      })}
                      className="w-full px-4 py-2 border border-silver rounded-lg outline-none transition-all"
                      placeholder="VD: 500mg"
                    />
                    {errors.prescriptionDetails?.[index]?.dosage && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.prescriptionDetails[index]?.dosage?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-truev font-medium mb-2">
                      Tần suất <span className="text-martinique">*</span>
                    </label>
                    <input
                      {...register(`prescriptionDetails.${index}.frequency`, {
                        required: "Vui lòng nhập tần suất",
                      })}
                      className="w-full px-4 py-2 border border-silver rounded-lg outline-none transition-all"
                      placeholder="VD: 2 lần/ngày"
                    />
                    {errors.prescriptionDetails?.[index]?.frequency && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.prescriptionDetails[index]?.frequency?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-truev font-medium mb-2">
                      Thời gian <span className="text-martinique">*</span>
                    </label>
                    <input
                      {...register(`prescriptionDetails.${index}.duration`, {
                        required: "Vui lòng nhập thời gian",
                      })}
                      className="w-full px-4 py-2 border border-silver rounded-lg outline-none transition-all"
                      placeholder="VD: 7 ngày"
                    />
                    {errors.prescriptionDetails?.[index]?.duration && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.prescriptionDetails[index]?.duration?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-truev font-medium mb-2">
                      Đường dùng <span className="text-martinique">*</span>
                    </label>
                    <select
                      {...register(`prescriptionDetails.${index}.route`)}
                      className="w-full px-4 py-2 border border-silver rounded-lg outline-none transition-all"
                    >
                      <option value="Uống">Uống</option>
                      <option value="Tiêm">Tiêm</option>
                      <option value="Bôi">Bôi</option>
                      <option value="Nhỏ">Nhỏ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-truev font-medium mb-2">
                      Số lượng <span className="text-martinique">*</span>
                    </label>
                    <input
                      {...register(`prescriptionDetails.${index}.quantity`, {
                        required: "Vui lòng nhập số lượng",
                      })}
                      className="w-full px-4 py-2 border borders-silver rounded-lg outline-none transition-all"
                      placeholder="VD: 14 viên"
                    />
                    {errors.prescriptionDetails?.[index]?.quantity && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.prescriptionDetails[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hướng dẫn sử dụng */}
        <div>
          <label className="block text-sm font-medium mb-2 text-east-bay">
            Hướng dẫn sử dụng
          </label>
          <textarea
            {...register("instructions")}
            rows={3}
            className="w-full px-4 py-2 border border-silver rounded-lg outline-none transition-all"
            placeholder="Hướng dẫn chi tiết về cách sử dụng thuốc..."
          />
          {errors.instructions && (
            <p className="text-sm text-red-500 mt-1">
              {errors.instructions.message}
            </p>
          )}
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-sm font-medium mb-2 text-east-bay">
            Ghi chú
          </label>
          <textarea
            {...register("note")}
            rows={2}
            className="w-full px-4 py-2 border border-silver rounded-lg outline-none transition-all"
            placeholder="Ghi chú bổ sung (nếu có)..."
          />
          {errors.note && (
            <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>
          )}
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex bg-truev items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold disabled:opacity-50 transition-all hover:opacity-90"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Đang lưu..." : "Hoàn tất kê đơn"}
          </button>
        </div>
      </div>
    </div>
  );
}
