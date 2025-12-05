import { api } from "@/axios";
import { ApiResponse, Billing, BillingDetail  } from "@/types";

export class BillingService {
  public static async getBillings(
    page: number,
  ): Promise<ApiResponse<Billing[]>> {
    const response = await api.get(`/billings?page=${page}`);
    return response.data;
  }

  public static async getBillingDetail(
    id: number,
  ): Promise<ApiResponse<BillingDetail>> {
    const response = await api.get(`/billings/${id}`);
    return response.data;
  }
}
