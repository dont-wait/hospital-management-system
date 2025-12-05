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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RevenueBarChartProps {
  timeRange: "day" | "week" | "month" | "year" | "range";
}

export default function RevenueBarChart({ timeRange }: RevenueBarChartProps) {
  const getChartData = () => {
    switch (timeRange) {
      case "day":
        return {
          labels: ["0h", "4h", "8h", "12h", "16h", "20h", "24h"],
          appointment: [5, 12, 18, 25, 30, 28, 22],
          service: [4, 8, 12, 15, 20, 18, 15],
          medicine: [3, 5, 5, 8, 12, 9, 8],
        };
      case "week":
        return {
          labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          appointment: [120, 140, 150, 160, 180, 80, 60],
          service: [100, 110, 120, 140, 150, 60, 50],
          medicine: [60, 70, 80, 90, 90, 40, 40],
        };
      case "month":
        return {
          labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
          appointment: [280, 310, 290, 320],
          service: [240, 260, 250, 270],
          medicine: [130, 150, 140, 160],
        };
      case "year":
        return {
          labels: [
            "T1",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "T8",
            "T9",
            "T10",
            "T11",
            "T12",
          ],
          appointment: [900, 980, 1050, 950, 1100, 1150, 1000, 1100, 1200, 1250, 1300, 980],
          service: [800, 850, 900, 820, 950, 1000, 900, 980, 1050, 1100, 1150, 1120],
          medicine: [400, 470, 500, 430, 450, 500, 500, 470, 450, 450, 450, 350],
        };
      default:
        return { labels: [], appointment: [], service: [], medicine: [] };
    }
  };

  const chartData = getChartData();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Khám bệnh",
        data: chartData.appointment,
        backgroundColor: "rgba(79, 81, 140, 0.8)",
        borderColor: "rgb(79, 81, 140)",
        borderWidth: 1,
      },
      {
        label: "Dịch vụ",
        data: chartData.service,
        backgroundColor: "rgba(218, 191, 255, 0.8)",
        borderColor: "rgb(218, 191, 255)",
        borderWidth: 1,
      },
      {
        label: "Thuốc",
        data: chartData.medicine,
        backgroundColor: "rgba(144, 122, 214, 0.8)",
        borderColor: "rgb(144, 122, 214)",
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
