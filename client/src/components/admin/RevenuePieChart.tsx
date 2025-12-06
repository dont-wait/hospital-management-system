"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { BillingService } from "@/services/billing.service";
import { ChartDataCategory } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface RevenuePieChartProps {
  timeRange: "day" | "week" | "month" | "year" | "range";
  fromDate?: string;
  toDate?: string;
}

export default function RevenuePieChart({ timeRange, fromDate, toDate }: RevenuePieChartProps) {
  const [categoryData, setCategoryData] = useState<ChartDataCategory>({ appointments: 0, services: 0 });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await BillingService.getRevenueByCategory(timeRange, fromDate, toDate);
        setCategoryData(data);
      } catch {
        setCategoryData({ appointments: 0, services: 0 });
      }
    };

    fetchRevenueData();
  }, [timeRange, fromDate, toDate]);

  const data = {
    labels: ["Khám bệnh", "Dịch vụ"],
    datasets: [
      {
        label: "Doanh thu (triệu VNĐ)",
        data: [categoryData.appointments, categoryData.services],
        backgroundColor: [
          "rgba(79, 81, 140, 0.8)",
          "rgba(218, 191, 255, 0.8)",
        ],
        borderColor: ["rgb(79, 81, 140)", "rgb(218, 191, 255)"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: {
            label: string;
            parsed: number | null;
            dataset: { data: (number | null)[] };
          }) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number | null) => a + (b || 0),
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);

            const formattedValue = new Intl.NumberFormat("vi-VN").format(value) + " triệu VNĐ";

            return `${label}: ${formattedValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
