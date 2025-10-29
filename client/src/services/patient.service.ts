import api from "@/axios";
import type { PatientUpdateDto } from "@/schemas";

export class PatientService {
  static async updatePatient(
    id: string,
    patientUpdateDto: PatientUpdateDto,
  ): Promise<PatientUpdateDto> {
    const { email, ...patientUpdateInfo } = patientUpdateDto;
    const { data: response } = await api.put(
      `/account/patient/${id}`,
      patientUpdateInfo,
    );
    return { ...response.data, email };
  }
}
