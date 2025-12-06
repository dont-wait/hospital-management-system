import { api } from "@/axios";
import { ApiResponse, PrescriptionFormData, PrescriptionResult } from "@/types";

export class PrescriptionService {
  public static async addPrescription(
    data: PrescriptionFormData,
  ): Promise<void> {
    api.post("/prescriptions", data);
  }

  public static async getPatientPrescription(
    patientId: string,
  ): Promise<ApiResponse<PrescriptionResult[]> | null> {
    try {
      const response = await api.get(`/prescriptions/patient/${patientId}`);
      return response.data;
    } catch {
      return null;
    }
  }
}
