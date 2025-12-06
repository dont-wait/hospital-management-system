"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Save, FileText } from "lucide-react";

export default function PrescriptionForm() {
  const [submittedData, setSubmittedData] = useState(null);
  void setSubmittedData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      instructions: "",
      note: "",
      medicalVisit: {
        patientName: "",
        visitDate: "",
        diagnosis: "",
      },
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

  const onSubmit = () => {
    //setSubmittedData(data);
    alert("Đã lưu đơn thuốc thành công!");
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
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md border border-silver p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-east-bay" />
            <h1 className="text-3xl font-bold text-east-bay">
              Đơn Thuốc Điện Tử
            </h1>
          </div>
          <p className="text-martinique/50">Hệ thống kê đơn thuốc cho bác sĩ</p>
        </div>

        <div className="space-y-6">
          {/* Thông tin bệnh nhân */}
          <div className="bg-white rounded-lg shadow-md border border-silver p-6">
            <h2 className="text-xl font-semibold text-martinique mb-4 pb-2 border-b-2 border-martinique/50">
              Thông Tin Lần Khám
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-martinique mb-2">
                  Họ và tên bệnh nhân <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("medicalVisit.patientName", {
                    required: "Vui lòng nhập tên bệnh nhân",
                  })}
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:ring-2 focus:border-transparent"
                  placeholder="Nguyễn Văn A"
                />
                {errors.medicalVisit?.patientName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.medicalVisit.patientName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-martinique mb-2">
                  Ngày khám <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("medicalVisit.visitDate", {
                    required: "Vui lòng chọn ngày khám",
                  })}
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:ring-2  focus:border-transparent"
                />
                {errors.medicalVisit?.visitDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.medicalVisit.visitDate.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-martinique mb-2">
                  Chẩn đoán <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("medicalVisit.diagnosis", {
                    required: "Vui lòng nhập chẩn đoán",
                  })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  placeholder="Nhập chẩn đoán bệnh..."
                />
                {errors.medicalVisit?.diagnosis && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.medicalVisit.diagnosis.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chi tiết đơn thuốc */}
          <div className="bg-white rounded-lg shadow-md border border-silver p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-east-bay">
              <h2 className="text-xl font-semibold text-martinique">
                Danh Sách Thuốc
              </h2>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center gap-2 px-4 py-2 bg-east-bay text-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Thêm thuốc
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700">
                      Thuốc #{index + 1}
                    </h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên thuốc <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register(
                          `prescriptionDetails.${index}.medicationName`,
                          {
                            required: "Vui lòng nhập tên thuốc",
                          },
                        )}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Paracetamol 500mg"
                      />
                      {errors.prescriptionDetails?.[index]?.medicationName && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors.prescriptionDetails[index].medicationName
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Liều dùng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`prescriptionDetails.${index}.dosage`, {
                          required: "Vui lòng nhập liều dùng",
                          min: {
                            value: 1,
                            message: "Liều dùng phải lớn hơn 0",
                          },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="500"
                      />
                      {errors.prescriptionDetails?.[index]?.dosage && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.prescriptionDetails[index].dosage.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tần suất (lần/ngày){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`prescriptionDetails.${index}.frequency`, {
                          required: "Vui lòng nhập tần suất",
                          min: { value: 1, message: "Tần suất phải lớn hơn 0" },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3"
                      />
                      {errors.prescriptionDetails?.[index]?.frequency && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.prescriptionDetails[index].frequency.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian (ngày) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`prescriptionDetails.${index}.duration`, {
                          required: "Vui lòng nhập thời gian điều trị",
                          min: {
                            value: 1,
                            message: "Thời gian phải lớn hơn 0",
                          },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="7"
                      />
                      {errors.prescriptionDetails?.[index]?.duration && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.prescriptionDetails[index].duration.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đường dùng <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register(`prescriptionDetails.${index}.route`, {
                          required: "Vui lòng chọn đường dùng",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Uống">Uống</option>
                        <option value="Tiêm">Tiêm</option>
                        <option value="Bôi">Bôi</option>
                        <option value="Nhỏ mắt">Nhỏ mắt</option>
                        <option value="Nhỏ tai">Nhỏ tai</option>
                        <option value="Xịt mũi">Xịt mũi</option>
                      </select>
                      {errors.prescriptionDetails?.[index]?.route && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.prescriptionDetails[index].route.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`prescriptionDetails.${index}.quantity`, {
                          required: "Vui lòng nhập số lượng",
                          min: { value: 1, message: "Số lượng phải lớn hơn 0" },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="21"
                      />
                      {errors.prescriptionDetails?.[index]?.quantity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.prescriptionDetails[index].quantity.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hướng dẫn và ghi chú */}
          <div className="bg-white rounded-lg shadow-md border border-silver p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-east-bay">
              Hướng Dẫn Sử Dụng
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hướng dẫn sử dụng <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("instructions", {
                    required: "Vui lòng nhập hướng dẫn sử dụng thuốc",
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Uống thuốc sau ăn, uống đủ nước..."
                />
                {errors.instructions && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.instructions.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-martinique mb-2">
                  Ghi chú <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("note", {
                    required: "Vui lòng nhập ghi chú",
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tái khám sau 7 ngày nếu không đỡ..."
                />
                {errors.note && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.note.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-east-bay text-white rounded-lgfont-semibold shadow-lg"
            >
              <Save className="w-5 h-5" />
              Lưu Đơn Thuốc
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 bg-mauve text-white rounded-lg font-semibold"
            >
              Làm mới
            </button>
          </div>
        </div>

        {/* Preview submitted data */}
        {submittedData && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Dữ liệu đã lưu (Console Preview):
            </h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
