import { api, getApiInstance, getConfig } from "@/axios";
import type { PatientUpdateDto } from "@/schemas";
import { AuthUserWithoutTokens } from "@/types";

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

  public static async getAllPatients(token?: string): Promise<AuthUserWithoutTokens[]> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    
    const response = await apiInstance.get<{ data: AuthUserWithoutTokens[] }>(
        "/admin/patients",
        config
    );
    
    return response.data.data;
  }
}
