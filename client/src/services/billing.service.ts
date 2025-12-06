import { getApiInstance, getConfig, api } from "@/axios";
import { RevenueTransaction, ChartLineData, ChartDataCategory, ApiResponse, Billing, BillingDetail } from "@/types";

export class BillingService {
    public static async getRecentTransactions(
        page: number,
        count: number,
        fromDate?: string,
        toDate?: string,
        token?: string,
    ): Promise<RevenueTransaction[]> {
        const apiInstance = getApiInstance();
        const config = getConfig(token);

        const response = await apiInstance.get<{ data: RevenueTransaction[] }>(
            `/billings/transactions?page=${page}&count=${count}${
                fromDate ? `&fromDate=${fromDate}` : ""
            }${toDate ? `&toDate=${toDate}` : ""}`,
            config,
        );

        return response.data.data;
    }

    public static async getTotalRevenue(
        type: "day" | "week" | "month" | "year" | "range",
        date?: string,
        toDate?: string,
        token?: string,
    ) {
        const apiInstance = getApiInstance();
        const config = getConfig(token);

        const params = new URLSearchParams({ type });
        if (date) params.append("date", date);
        if (toDate) params.append("toDate", toDate);

        const response = await apiInstance.get<{ data: ChartLineData[] }>(
            `/billings/revenues?${params.toString()}`,
            config,
        );

        return response.data.data;
    }

    public static async getRevenueByCategory(
        type: "day" | "week" | "month" | "year" | "range",
        fromDate?: string,
        toDate?: string,
        token?: string,
    ): Promise<ChartDataCategory> {
        const apiInstance = getApiInstance();
        const config = getConfig(token);
        const params = new URLSearchParams({ type });
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);

        const response = await apiInstance.get<{ data: ChartDataCategory }>(
            `/billings/revenues/category?${params.toString()}`,
            config,
        );

        return response.data.data;
    }

    public static async exportRevenueReport(
        type: "day" | "week" | "month" | "year" | "range",
        fromDate?: string,
        toDate?: string,
        token?: string,
    ) {
        const apiInstance = getApiInstance();
        const config = getConfig(token);
        config.responseType = "blob";

        const response = await apiInstance.get<Blob>(
            `/billings/revenues/export?type=${type}${
                fromDate ? `&fromDate=${fromDate}` : ""
            }${toDate ? `&toDate=${toDate}` : ""}`,
            config,
        );

        return response.data;
    }

    public static async getBillings(
    patientId: string,
    page: number,
  ): Promise<ApiResponse<Billing[]>> {
    const response = await api.get("/billings", {
      params: {
        patientId,
        page,
      },
    });
    return response.data;
  }

  public static async getBillingDetail(
    id: number,
  ): Promise<ApiResponse<BillingDetail>> {
    const response = await api.get(`/billings/${id}`);
    return response.data;
  }
}
