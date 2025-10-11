import api from "@/axios";
import type { PatientUpdateDto } from "@/schemas/patient";

class PatientService {
  // Update patient service
  async updatePatient(
    id: string,
    patientUpdateDto: PatientUpdateDto,
  ): Promise<PatientUpdateDto> {
    const { email, ...patientUpdateInfo } = patientUpdateDto;
    void email;
    return api
      .put(`api/account/patient/${id}`, patientUpdateInfo)
      .then((response) => response.data.data);
  }
}

export const patientService = new PatientService();
