import "server-only";
import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens } from "@/types";

export class PatientService {
  public static async getPatientInfo(
    token?: string,
  ): Promise<AuthUserWithoutTokens> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    const response = await apiInstance.get("account/@me", config);
    return response.data.data;
  }
}
