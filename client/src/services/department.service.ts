import { getApiInstance, getConfig } from "@/axios";
import {  RevenueByDepartment, Room } from "@/types";

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

  public static async getRevenueStatistics(
    type: string,
    fromDate?: string,
    toDate?: string,
    token?: string,
  ): Promise<RevenueByDepartment[]> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);

    const response = await apiInstance.get<{ data: RevenueByDepartment[] }>(
      `/departments/revenue-statistics?type=${type}${
        fromDate ? `&fromDate=${fromDate}` : ""
      }${toDate ? `&toDate=${toDate}` : ""}`,
      config,
    );

    return response.data.data;
  }
}
