import "server-only";
import { getApiInstance, getConfig } from "@/axios";
import { ApiResponse, ScheduleData } from "@/types";

export class AppointmentService {
  public static async getSchedules(
    token?: string,
    day: string = "",
    departmentId: string = "",
    doctorId: string = "",
  ): Promise<ApiResponse<ScheduleData>> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    const response = await apiInstance.get("/appointments/available-slots", {
      ...config,
      params: {
        d: day,
        "dp-id": departmentId,
        "doc-id": doctorId,
      },
    });
    return response.data;
  }
}
