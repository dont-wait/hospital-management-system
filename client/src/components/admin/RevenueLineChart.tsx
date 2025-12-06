"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";
import { BillingService } from "@/services/billing.service";
import { ChartLineData } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueLineChartProps {
  timeRange: "day" | "week" | "month" | "year" | "range";
  fromDate?: string;
  toDate?: string;
}

interface ChartDataState {
  labels: string[];
  data: number[];
}

export default function RevenueLineChart({ timeRange, fromDate, toDate }: RevenueLineChartProps) {
  const [chartData, setChartData] = useState<ChartDataState>({ labels: [], data: [] });

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

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Doanh thu (triệu VNĐ)",
        data: chartData.data,
        fill: true,
        borderColor: "rgb(79, 81, 140)",
        backgroundColor: "rgba(79, 81, 140, 0.1)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(79, 81, 140)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
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

  return <Line data={data} options={options} />;
}
