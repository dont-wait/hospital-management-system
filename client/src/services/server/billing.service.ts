import "server-only";
import { getApiInstance, getConfig } from "@/axios";
import {
  ApiResponseWithPaging,
  ApiResponse,
  Billing,
  BillingDetail,
} from "@/types";

export class BillingService {
  public static async getBillings(
    patientId: string,
    token?: string,
    page: number = 1,
    size: number = 3,
  ): Promise<ApiResponseWithPaging<Billing[]>> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    const response = await apiInstance.get("/billings", {
      ...config,
      params: {
        patientId,
        page,
        size,
      },
    });
    return response.data;
  }

  public static async getBillingDetail(
    id: number,
    token?: string,
  ): Promise<ApiResponse<BillingDetail>> {
    const apiInstance = getApiInstance();
    const config = getConfig(token);
    const response = await apiInstance.get(`/billings/${id}`, config);
    return response.data;
  }
}
