import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens } from "@/types";
import { EmployeeUpdateDto } from "@/schemas/employee";

export class EmployeeService {
  public static async updateEmployee(
    employeeId: string,
    data: Partial<EmployeeUpdateDto>,
    token?: string,
  ): Promise<AuthUserWithoutTokens> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);

    const response = await apiInstance.put<{ data: AuthUserWithoutTokens }>(
      `/employees/${employeeId}`,
      data,
      config,
    );

    return response.data.data;
  }
}
