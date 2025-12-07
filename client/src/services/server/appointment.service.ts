import "server-only";
import { getApiInstance, getConfig } from "@/axios";
import {
  ApiResponse,
  ApiResponseWithPaging,
  ScheduleData,
  Appointment,
} from "@/types";

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

  public static async getAppointments(
    token?: string,
    patientId?: string,
    date?: string,
    doctorId?: string,
    page: number = 1,
    size: number = 3,
  ): Promise<ApiResponseWithPaging<Appointment[]> | null> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    try {
      const response = await apiInstance.get("/appointments", {
        ...config,
        params: {
          patientId,
          doctorId,
          page,
          size,
          date,
        },
      });
      return response.data;
    } catch {
      return null;
    }
  }
}
