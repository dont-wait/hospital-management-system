"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface RevenuePieChartProps {
  appointmentRevenue: number;
  serviceRevenue: number;
  medicineRevenue: number;
}

export default function RevenuePieChart({
  appointmentRevenue,
  serviceRevenue,
  medicineRevenue,
}: RevenuePieChartProps) {
  const data = {
    labels: ["Khám bệnh", "Dịch vụ", "Thuốc"],
    datasets: [
      {
        label: "Doanh thu",
        data: [appointmentRevenue, serviceRevenue, medicineRevenue],
        backgroundColor: [
          "rgba(79, 81, 140, 0.8)",
          "rgba(218, 191, 255, 0.8)",
          "rgba(144, 122, 214, 0.8)",
        ],
        borderColor: ["rgb(79, 81, 140)", "rgb(218, 191, 255)", "rgb(144, 122, 214)"],
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

            const formattedValue = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);

            return `${label}: ${formattedValue} (${percentage}%)`;
          },
          afterLabel: function (context: { dataIndex: number }) {
            const total = [appointmentRevenue, serviceRevenue, medicineRevenue].reduce(
              (a, b) => a + b,
              0
            );
            const value = [appointmentRevenue, serviceRevenue, medicineRevenue][
              context.dataIndex
            ];
            const percentage = ((value / total) * 100).toFixed(1);
            return `(${percentage}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
