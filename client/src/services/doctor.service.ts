import { getApiInstance, getConfig } from "@/axios";
import { AuthUserWithoutTokens } from "@/types";

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
}
