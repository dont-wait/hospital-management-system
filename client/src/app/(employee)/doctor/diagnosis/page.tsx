"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import MedicalVisitForm from "@/components/employee/doctor/MedicalVisitForm";
import PrescriptionForm from "@/components/employee/doctor/PrescriptionForm";
import { MedicalVisitResult } from "@/types";

export default function DiagnosisPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [medicalVisitData, setMedicalVisitData] =
    useState<MedicalVisitResult | null>(null);
  const appointmentId: number = 1;

  const handleMedicalVisitSuccess = (data: MedicalVisitResult) => {
    setMedicalVisitData(data);
    setCurrentStep(2);
  };

  const handlePrescriptionComplete = () => {
    setCurrentStep(1);
    setMedicalVisitData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 ${currentStep === 1 ? "text-east-bay" : "text-truev"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 1 ? "bg-east-bay text-white" : "bg-truev text-white"}`}
              >
                {currentStep === 1 ? "1" : <CheckCircle className="w-6 h-6" />}
              </div>
              <span className="font-semibold">Chẩn đoán</span>
            </div>

            <div className="w-16 h-1 bg-gray-300">
              <div
                className={`h-full transition-all ${currentStep === 2 ? "bg-truev w-full" : "bg-east-bay w-0"}`}
              ></div>
            </div>

            <div
              className={`flex items-center gap-2 ${currentStep === 2 ? "text-truev" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 2 ? "bg-truev text-white" : "bg-gray-100 text-gray-400"}`}
              >
                2
              </div>
              <span className="font-semibold">Kê đơn thuốc</span>
            </div>
          </div>
        </div>

        {/* Form Display */}
        {currentStep === 1 && (
          <MedicalVisitForm
            appointmentId={appointmentId}
            onSubmitSuccess={handleMedicalVisitSuccess}
          />
        )}

        {currentStep === 2 && medicalVisitData && (
          <PrescriptionForm
            medicalVisitData={medicalVisitData}
            onComplete={handlePrescriptionComplete}
          />
        )}
      </div>
    </div>
  );
}
