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
    patientId: string,
    date: string,
    token?: string,
    page: number = 1,
    size: number = 3,
  ): Promise<ApiResponseWithPaging<Appointment[]>> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    const response = await apiInstance.get("/appointments", {
      ...config,
      params: {
        patientId,
        page,
        size,
        date,
      },
    });
    return response.data;
  }
}
