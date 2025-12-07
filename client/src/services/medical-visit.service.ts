import { api } from "@/axios";
import { ApiResponse, MedicalVisitFormData, MedicalVisitResult } from "@/types";

export class MedicalVisitService {
  public static async createMedicalVist(
    data: MedicalVisitFormData,
  ): Promise<ApiResponse<MedicalVisitResult> | null> {
    try {
      const response = await api.post("/medical-visits", data);
      return response.data;
    } catch {
      return null;
    }
  }

  public static async getPatientDiagnosisList(
    patientId: string,
  ): Promise<ApiResponse<MedicalVisitResult[]> | null> {
    try {
      const response = await api.get(`/medical-visits/patient/${patientId}`);
      return response.data;
    } catch {
      return null;
    }
  }
}
