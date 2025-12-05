import { api } from "@/axios";
import {
  ApiResponse,
  AppointmentDto,
  AppointmentDetail,
  Appointment,
} from "@/types";

export class AppointmentService {
  public static async createAppointment(
    appointmentDto: AppointmentDto,
  ): Promise<ApiResponse<string>> {
    const { data: response } = await api.post(`/appointments`, appointmentDto);
    return response.data;
  }

  public static async getAppointment(
    page: number,
  ): Promise<ApiResponse<Appointment[]>> {
    const response = await api.get(`/appointments?page=${page}`);
    return response.data;
  }

  public static async getAppointmentDetail(
    id: number,
  ): Promise<ApiResponse<AppointmentDetail>> {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  }

  public static async deleteAppointment(id: number) {
    await api.delete(`/appointments/${id}`);
  }
}
