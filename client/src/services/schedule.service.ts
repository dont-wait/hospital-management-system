import { getApiInstance, getConfig } from "@/axios";
import { CreateShiftPayload } from "@/schemas/create-shift";
import { CreateScheduleRequest, PreviewScheduleErrorResult, PreviewScheduleResult } from "@/types";

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

    public static async createScheduleAuto(req: CreateScheduleRequest)
        : Promise<{ 
            message: string;
            data: { request_id: string; }
            status: "completed" | "failed";
        }> 
    {
        const apiInstance = getApiInstance();
        const config = getConfig();

        const response = await apiInstance.post(
            "/schedules/auto",
            req,
            config
        );

        return response.data;
    }

    public static async getScheduleProgress(requestId: string)
        : Promise<{
            status: string;
            progress_percent: number;
            message: string;
            error?: string | null;
        }> 
    {
        const apiInstance = getApiInstance();
        const config = getConfig();

        const response = await apiInstance.get(
            `/schedules/auto/${requestId}/progress`,
            config
        );

        return response.data;
    }

    public static async getSchedule(requestId: string): Promise<PreviewScheduleResult | PreviewScheduleErrorResult> {
        const apiInstance = getApiInstance();
        const config = getConfig();

        const response = await apiInstance.get(
            `/schedules/auto/${requestId}/schedule`,
            config
        );

        return response.data;
    }
}