import { getApiInstance, getConfig } from "@/axios";
import { CreateShiftPayload } from "@/schemas/create-shift";

export class ScheduleService {
    public static async createShift(data: CreateShiftPayload, token?: string) {
        const apiInstance = getApiInstance();
        const config = getConfig(token);

        const response = await apiInstance.post(
            "/schedules",
            data,
            config
        );

        return response.data;
    }
}