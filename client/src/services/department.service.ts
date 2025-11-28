import { getApiInstance, getConfig } from "@/axios";
import {  Room } from "@/types";

export class DepartmentService {
  public static async getRoomsByDepartmentId(
    departmentId: number,
    token?: string,
  ): Promise<Room[]> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);

    const response = await apiInstance.get<{ data: Room[] }>(
      `/departments/rooms?departmentId=${departmentId}`,
      config,
    );
    return response.data.data;
  }
}
