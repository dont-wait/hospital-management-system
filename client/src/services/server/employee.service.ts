import "server-only";

import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens, Roles } from "@/types";

type EmployeeRoleId = Exclude<Roles, "admin" | "patient" | "guest">;

export class EmployeeService {
  public static async getAllEmployeesByRole(
    roleId: EmployeeRoleId,
    token?: string,
  ): Promise<AuthUserWithoutTokens[]> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    const response = await apiInstance.get<{ data: AuthUserWithoutTokens[] }>(
      `/employees?role=${roleId}`,
      config,
    );

    return response.data.data;
  }
}
