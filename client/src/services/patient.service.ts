import api from "@/axios";
import type { PatientUpdateDto } from "@/schemas/patient";

class PatientService {
  // Update patient service
  async updatePatient(
    id: string,
    patientUpdateDto: PatientUpdateDto,
  ): Promise<PatientUpdateDto> {
    return await api
      .put(`patient/${id}`, patientUpdateDto)
      .then((response) => response.data.data);
  }
}

export const patientService = new PatientService();
