import { getApiInstance, getConfig } from "@/axios";
import { RevenueTransaction } from "@/types";

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
}
