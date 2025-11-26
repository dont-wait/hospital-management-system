import { api } from "@/axios";
import { ApiResponse, AppointmentDto } from "@/types";

export class AppointmentService {
  public static async createAppointment(
    appointmentDto: AppointmentDto,
  ): Promise<ApiResponse<string>> {
    const { data: response } = await api.post(`/appointments`, appointmentDto);
    return response.data;
  }
}
