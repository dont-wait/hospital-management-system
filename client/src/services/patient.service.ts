import api from "@/axios";
import type { PatientUpdateDto } from "@/schemas/patient";
import { GENDER_OPTIONS } from "@/config/GenderConfig";

class PatientService {
  // Update patient service
  static async updatePatient(
    id: string,
    patientUpdateDto: PatientUpdateDto,
  ): Promise<PatientUpdateDto> {
    const { email, ...patientUpdateInfo } = patientUpdateDto;
    return api
      .put(`api/account/patient/${id}`, patientUpdateInfo)
      .then((response) => ({ email, ...response.data.data }));
  }

  static formatGender(c: string) {
    return GENDER_OPTIONS.find(({ value }) => value === c)!.label;
  }

  static formatDOB(dob: string) {
    const [year, month, day] = dob.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  }
}

export default PatientService;
