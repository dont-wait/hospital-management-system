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
  timeRange: "day" | "week" | "month" | "year";
}

export default function RevenueLineChart({ timeRange }: RevenueLineChartProps) {
  const getChartData = () => {
    switch (timeRange) {
      case "day":
        return {
          labels: ["0h", "4h", "8h", "12h", "16h", "20h", "24h"],
          data: [12, 25, 35, 48, 62, 55, 45],
        };
      case "week":
        return {
          labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          data: [280, 320, 350, 390, 420, 180, 150],
        };
      case "month":
        return {
          labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
          data: [650, 720, 680, 750],
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
          data: [2100, 2300, 2450, 2200, 2500, 2650, 2400, 2550, 2700, 2800, 2900, 2450],
        };
      default:
        return { labels: [], data: [] };
    }
  };

  const chartData = getChartData();

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
