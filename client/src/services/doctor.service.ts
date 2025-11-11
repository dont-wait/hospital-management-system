import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens, Role } from "@/types";
import { EmployeeUpdateLimitedDto, EmployeeUpdateFullDto } from "@/schemas";

type EmployeeRoleId = Exclude<Role, "admin" | "patient" | "guest">;

export class EmployeeService {
    public static async getAllEmployeesByRole(roleId: EmployeeRoleId, token?: string): Promise<AuthUserWithoutTokens[]> {
        const apiInstance = getApiInstance(token);
        const config = getConfig(token);
        
        const response = await apiInstance.get<{ data: AuthUserWithoutTokens[] }>(
            `/employees?role=${roleId}`,
            config
        );
        
        return response.data.data;
    }

    public static async updateEmployeeLimited(
        employeeId: string,
        employeeUpdateDto: EmployeeUpdateLimitedDto,
        token?: string
    ): Promise<AuthUserWithoutTokens> {
        const apiInstance = getApiInstance(token);
        const config = getConfig(token);
        
        const response = await apiInstance.put<{ data: AuthUserWithoutTokens }>(
            `/employee/${employeeId}`,
            employeeUpdateDto,
            config
        );
        
        return response.data.data;
    }

    public static async updateEmployeeFull(
        employeeId: string,
        employeeUpdateDto: EmployeeUpdateFullDto,
        token?: string
    ): Promise<AuthUserWithoutTokens> {
        const apiInstance = getApiInstance(token);
        const config = getConfig(token);
        
        const response = await apiInstance.put<{ data: AuthUserWithoutTokens }>(
            `/employee/${employeeId}`,
            employeeUpdateDto,
            config
        );
        
        return response.data.data;
    }
}
