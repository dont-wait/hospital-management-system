import { getApiInstance, getConfig } from "@/axios";
import { CreateShiftPayload } from "@/schemas/create-shift";
import {
  CreateScheduleRequest,
  PreviewScheduleErrorResult,
  PreviewScheduleResult,
  ScheduleJobMetricsResult,
  ScheduleRequestHistoryParams,
  ScheduleRequestHistoryResponse,
} from "@/types";

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

    public static async getScheduleMetrics(requestId: string): Promise<ScheduleJobMetricsResult> {
        const apiInstance = getApiInstance();
        const config = getConfig();

        const response = await apiInstance.get(
            `/schedules/auto/${requestId}/metrics`,
            config
        );

        return response.data;
    }

    public static async getScheduleHistory(
        params: ScheduleRequestHistoryParams = {}
    ): Promise<ScheduleRequestHistoryResponse> {
        const apiInstance = getApiInstance();
        const config = getConfig();

        const query = new URLSearchParams();
        if (params.department_id != null) query.set("departmentId", String(params.department_id));
        if (params.status) query.set("status", params.status);
        if (params.from_date) query.set("fromDate", params.from_date);
        if (params.to_date) query.set("toDate", params.to_date);
        if (params.page) query.set("page", String(params.page));
        if (params.page_size) query.set("pageSize", String(params.page_size));

        const qs = query.toString();
        const response = await apiInstance.get(
            `/schedules/auto/history${qs ? `?${qs}` : ""}`,
            config
        );

        return response.data.data;
    }
}