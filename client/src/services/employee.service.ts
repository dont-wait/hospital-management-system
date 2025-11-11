import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens, Role } from "@/types";
import { EmployeeUpdateDto } from "@/schemas/employee";

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

    public static async updateEmployee(
        employeeId: string, 
        data: Partial<EmployeeUpdateDto>,
        token?: string
    ): Promise<AuthUserWithoutTokens> {
        const apiInstance = getApiInstance(token);
        const config = getConfig(token);
        
        const response = await apiInstance.put<{ data: AuthUserWithoutTokens }>(
            `/employees/${employeeId}`,
            data,
            config
        );
        
        return response.data.data;
    }
}
