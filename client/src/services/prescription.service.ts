import { api } from "@/axios";
import { PrescriptionFormData } from "@/types";

export class PrescriptionService {
  public static async addPrescription(
    data: PrescriptionFormData,
  ): Promise<void> {
    api.post("/prescriptions", data);
  }
}
