"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { BillingService } from "@/services/billing.service";
import { ChartDataCategory } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RevenueBarChartProps {
  timeRange: "day" | "week" | "month" | "year" | "range";
  fromDate?: string;
  toDate?: string;
}

export default function RevenueBarChart({ timeRange, fromDate, toDate }: RevenueBarChartProps) {
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
        position: "top" as const,
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
          label: function (context: { dataset: { label?: string }; parsed: { y: number | null } }) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("vi-VN").format(context.parsed.y) + " triệu VNĐ";
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value: string | number) {
            return value + "tr";
          },
        },
      },
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
