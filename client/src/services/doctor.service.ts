import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens, Employee } from "@/types";
import { EmployeeUpdateLimitedDto, EmployeeUpdateFullDto } from "@/schemas";

export class DoctorService {
    public static async getAllDoctors(token?: string): Promise<AuthUserWithoutTokens[]> {
        const apiInstance = getApiInstance(token);
        const config = getConfig(token);
        
        const response = await apiInstance.get<{ data: AuthUserWithoutTokens[] }>(
            "/admin/doctors",
            config
        );
        
        return response.data.data;
    }

    public static async getDoctorById(
        doctorId: string, 
        token?: string
    ): Promise<AuthUserWithoutTokens> {
        const apiInstance = getApiInstance(token);
        const config = getConfig(token);
        
        const response = await apiInstance.get<{ data: AuthUserWithoutTokens }>(
            `/employee/${doctorId}`,
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
