"use client";

import { useState, useEffect } from "react";
import { FileText, Pill, Eye } from "lucide-react";
import { PrescriptionService } from "@/services";
import { useUserAuthContext } from "@/contexts";
import { PrescriptionResult } from "@/types";

export default function PrescriptionManagement() {
  const [selectedPrescription, setSelectedPrescription] =
    useState<PrescriptionResult | null>(null);
  const [prescriptions, setPrescriptions] = useState<
    PrescriptionResult[] | null
  >(null);
  const { user } = useUserAuthContext();
  const patientId = user && "patientId" in user ? user.patientId : "";

  useEffect(() => {
    async function fetchPrescription() {
      const response =
        await PrescriptionService.getPatientPrescription(patientId);
      setPrescriptions(response?.data ?? null);
    }

    fetchPrescription();
  }, [patientId]);

  if (!prescriptions?.length) {
    return <h3>không có đơn thuốc</h3>;
  }

  const handleViewDetail = (prescription: PrescriptionResult) => {
    setSelectedPrescription(prescription);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10" style={{ color: "#907ad6" }} />
            <h1 className="text-3xl font-bold" style={{ color: "#2c2a4a" }}>
              Quản Lý Đơn Thuốc
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List View */}
          <div className="lg:col-span-2 space-y-4">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "#4f518c" }}
            >
              Danh sách đơn thuốc
            </h2>

            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-lg p-5 border transition-all hover:shadow-md cursor-pointer"
                style={{ borderColor: "#c5c5c5" }}
                onClick={() => handleViewDetail(prescription)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#dabfff30" }}
                    >
                      <Pill className="w-6 h-6" style={{ color: "#907ad6" }} />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: "#2c2a4a" }}
                      >
                        Đơn thuốc #{prescription.id}
                      </h3>
                    </div>
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#7fdeff30", color: "#4f518c" }}
                  >
                    {prescription.prescriptionDetails.length} thuốc
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(prescription);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: "#907ad6" }}
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}

            {prescriptions.length === 0 && (
              <div className="text-center py-12">
                <FileText
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: "#c5c5c5" }}
                />
                <p style={{ color: "#4f518c" }}>Không tìm thấy đơn thuốc nào</p>
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-lg p-5 border sticky top-6"
              style={{ borderColor: "#c5c5c5" }}
            >
              {selectedPrescription ? (
                <>
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: "#2c2a4a" }}
                  >
                    Chi Tiết Đơn Thuốc #{selectedPrescription.id}
                  </h3>

                  <div
                    className="border-t pt-4 mb-4"
                    style={{ borderColor: "#c5c5c5" }}
                  >
                    <h4
                      className="font-semibold mb-3"
                      style={{ color: "#4f518c" }}
                    >
                      Danh sách thuốc
                    </h4>
                    <div className="space-y-3">
                      {selectedPrescription.prescriptionDetails.map(
                        (detail, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: "#f8f9fa" }}
                          >
                            <p
                              className="font-medium mb-2"
                              style={{ color: "#2c2a4a" }}
                            >
                              {detail.medicationName}
                            </p>
                            <div
                              className="space-y-1 text-xs"
                              style={{ color: "#4f518c" }}
                            >
                              <p>
                                Liều lượng:{" "}
                                <span className="font-medium">
                                  {detail.dosage}mg
                                </span>
                              </p>
                              <p>
                                Tần suất:{" "}
                                <span className="font-medium">
                                  {detail.frequency} lần/ngày
                                </span>
                              </p>
                              <p>
                                Thời gian:{" "}
                                <span className="font-medium">
                                  {detail.duration} ngày
                                </span>
                              </p>
                              <p>
                                Đường dùng:{" "}
                                <span className="font-medium">
                                  {detail.route}
                                </span>
                              </p>
                              <p>
                                Số lượng:{" "}
                                <span className="font-medium">
                                  {detail.quantity} viên
                                </span>
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div
                    className="border-t pt-4 mb-4"
                    style={{ borderColor: "#c5c5c5" }}
                  >
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: "#4f518c" }}
                    >
                      Hướng dẫn sử dụng
                    </h4>
                    <p className="text-sm" style={{ color: "#2c2a4a" }}>
                      {selectedPrescription.instructions}
                    </p>
                  </div>

                  <div
                    className="border-t pt-4"
                    style={{ borderColor: "#c5c5c5" }}
                  >
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: "#4f518c" }}
                    >
                      Ghi chú
                    </h4>
                    <p className="text-sm" style={{ color: "#2c2a4a" }}>
                      {selectedPrescription.note}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: "#c5c5c5" }}
                  />
                  <p className="text-sm" style={{ color: "#4f518c" }}>
                    Chọn một đơn thuốc để xem chi tiết
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
