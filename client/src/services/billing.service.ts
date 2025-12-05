import { getApiInstance, getConfig } from "@/axios";
import { RevenueTransaction, ChartLineData } from "@/types";

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
        type: "day" | "week" | "month" | "year",
        date?: string,
        token?: string,
    ) {
        const apiInstance = getApiInstance();
        const config = getConfig(token);

        const response = await apiInstance.get<{ data: ChartLineData[] }>(
            `/billings/revenues?type=${type}${date ? `&date=${date}` : ""}`,
            config,
        );

        return response.data.data;
    }
}
