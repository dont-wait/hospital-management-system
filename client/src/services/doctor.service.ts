import api, { apiSSR } from "@/axios";
import { AuthUserWithoutTokens } from "@/types";
import type { AxiosRequestConfig } from "axios";

export class DoctorService {
    private static getConfig(token?: string): AxiosRequestConfig | undefined {
        return token ? {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        } : undefined;
    }

    private static getApiInstance(token?: string) {
        return token ? apiSSR : api;
    }
    
    public static async getAllDoctors(token?: string): Promise<AuthUserWithoutTokens[]> {
        const apiInstance = this.getApiInstance(token);
        const config = this.getConfig(token);
        
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
        const apiInstance = this.getApiInstance(token);
        const config = this.getConfig(token);
        
        const response = await apiInstance.get<{ data: AuthUserWithoutTokens }>(
            `/employee/${doctorId}`,
            config
        );
        
        return response.data.data;
    }
}
