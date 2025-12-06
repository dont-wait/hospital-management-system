"use client";

import { MedicalVisitForm } from "@/components/employee/doctor/MedicalVisitForm";

export default function DiagnosisPage() {
  const handleSubmit = async () => {
    // api
  };

  return (
    <div className="container mx-auto p-6">
      <MedicalVisitForm appointmentId={1} onSubmit={handleSubmit} />
    </div>
  );
}
