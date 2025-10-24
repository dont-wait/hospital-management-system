import api from "@/axios";
import type { PatientUpdateDto } from "@/schemas/patient";
import { GENDER_OPTIONS } from "@/config/GenderConfig";

export class PatientService {
  static async updatePatient(
    id: string,
    patientUpdateDto: PatientUpdateDto,
  ): Promise<PatientUpdateDto> {
    const { email, ...patientUpdateInfo } = patientUpdateDto;
    const { data: response } = await api.put(
      `api/account/patient/${id}`,
      patientUpdateInfo,
    );
    return { ...response.data, email };
  }

  static formatGender(c: string) {
    return GENDER_OPTIONS.find(({ value }) => value === c)!.label;
  }

  static formatDOB(dob: string) {
    const [year, month, day] = dob.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  }
}
