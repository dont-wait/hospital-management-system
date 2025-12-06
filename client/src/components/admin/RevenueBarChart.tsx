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
import { ChartLineData } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RevenueBarChartProps {
  timeRange: "day" | "week" | "month" | "year" | "range";
  fromDate?: string;
  toDate?: string;
}

interface ChartData {
  labels: string[];
  data: number[];
}

export default function RevenueBarChart({ timeRange, fromDate, toDate }: RevenueBarChartProps) {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], data: [] });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await BillingService.getTotalRevenue(timeRange, fromDate, toDate);
        setChartData({
          labels: data.map((item: ChartLineData) => item.label),
          data: data.map((item: ChartLineData) => item.revenue),
        });
      } catch {
        setChartData({ labels: [], data: [] });
      }
    };

    fetchRevenueData();
  }, [timeRange, fromDate, toDate]);

  const getChartData = () => {
    return {
      labels: chartData.labels,
      data: chartData.data,
    };
  };

  const chartDataConfig = getChartData();

  const data = {
    labels: chartDataConfig.labels,
    datasets: [
      {
        label: "Doanh thu (triệu VNĐ)",
        data: chartDataConfig.data,
        backgroundColor: "rgba(79, 81, 140, 0.8)",
        borderColor: "rgb(79, 81, 140)",
        borderWidth: 1,
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
