"use client";

import { useState, useEffect } from "react";
import { MedicalVisitService } from "@/services";
import { useUserAuthContext } from "@/contexts";
import { MedicalVisitResult } from "@/types";
import Icon from "@/components/shared/Icon";

export default function PatientDiagnosisList() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [diagnoses, setDiagnoses] = useState<MedicalVisitResult[] | null>(null);
  const { user } = useUserAuthContext();
  const patientId = user && "patientId" in user ? user.patientId : "";

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    async function fetchPrescription() {
      const response =
        await MedicalVisitService.getPatientDiagnosisList(patientId);
      setDiagnoses(response?.data ?? null);
    }

    fetchPrescription();
  }, [patientId]);

  if (!diagnoses?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-anakiwa/20 flex items-center justify-center mb-4">
          <Icon name="FileText" className="w-10 h-10 text-truev" />
        </div>
        <h3 className="text-xl font-semibold text-martinique mb-2">
          Chưa có hồ sơ bệnh án
        </h3>
        <p className="text-eastbay text-center max-w-md">
          Bạn chưa có lịch sử khám bệnh nào. Hồ sơ bệnh án sẽ được cập nhật sau
          mỗi lần khám.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diagnoses.map((item, idx) => {
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id}
            className="bg-white border border-silver/40 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div
              onClick={() => toggleExpand(item.id)}
              className="p-5 cursor-pointer hover:bg-anakiwa/5 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-truev text-white flex items-center justify-center font-semibold shadow">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-martinique font-semibold text-lg mb-1">
                      {item.diagnosis || "Chưa có chẩn đoán"}
                    </div>
                    <div className="text-sm text-eastbay">
                      Triệu chứng: {item.symptoms || "Không có"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-truev/10 text-truev text-sm font-medium">
                    Lần khám #{item.appointmentId}
                  </span>
                  <Icon
                    name={isExpanded ? "ChevronUp" : "ChevronDown"}
                    className="w-5 h-5 text-eastbay transition-transform"
                  />
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-silver/40 bg-anakiwa/5">
                <div className="p-5 space-y-4">
                  {/* Physical Examination */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Activity" className="w-4 h-4 text-truev" />
                      <span className="font-semibold text-martinique">
                        Khám lâm sàng
                      </span>
                    </div>
                    <p className="text-eastbay pl-6">
                      {item.physicalExamination || "Không có thông tin"}
                    </p>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="FileText" className="w-4 h-4 text-truev" />
                      <span className="font-semibold text-martinique">
                        Chẩn đoán
                      </span>
                    </div>
                    <p className="text-eastbay pl-6">
                      {item.diagnosis || "Chưa có chẩn đoán"}
                    </p>
                  </div>

                  {/* Treatment */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Pill" className="w-4 h-4 text-truev" />
                      <span className="font-semibold text-martinique">
                        Phương pháp điều trị
                      </span>
                    </div>
                    <p className="text-eastbay pl-6">
                      {item.treatment || "Không có phương pháp điều trị"}
                    </p>
                  </div>

                  {/* Note */}
                  {item.note && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          name="StickyNote"
                          className="w-4 h-4 text-truev"
                        />
                        <span className="font-semibold text-martinique">
                          Ghi chú
                        </span>
                      </div>
                      <p className="text-eastbay pl-6">{item.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
