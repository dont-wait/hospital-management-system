import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens, Roles } from "@/types";
import { EmployeeUpdateDto } from "@/schemas";

type EmployeeRoleId = Exclude<Roles, "admin" | "patient" | "guest">;

export class EmployeeService {
  public static async getAllEmployees(
    roleId?: EmployeeRoleId,
    departmentId?: number,
    token?: string,
  ): Promise<AuthUserWithoutTokens[]> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);

    const roleQuery = roleId ? `role=${roleId}` : "";
    const departmentQuery = departmentId ? `departmentId=${departmentId}` : "";
    const queryParams = [roleQuery, departmentQuery].filter(param => param).join("&");

    const response = await apiInstance.get<{ data: AuthUserWithoutTokens[] }>(
      `/employees${queryParams ? `?${queryParams}` : ""}`,
      config,
    );

    return response.data.data;
  }

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
