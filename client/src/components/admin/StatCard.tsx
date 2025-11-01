import { ComponentType } from "react";
import { LucideProps } from "lucide-react";
import styles from "@/styles/admin.module.css";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<LucideProps>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange";
}

export function StatCard({ title, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  return (
    <div className={`${styles["stat-card"]} ${styles[`stat-card-${color}`]}`}>
      <div className={styles["stat-card-content"]}>
        <div className={styles["stat-card-header"]}>
          <h3 className={styles["stat-card-title"]}>{title}</h3>
          <div className={`${styles["stat-card-icon"]} ${styles[`stat-card-icon-${color}`]}`}>
            <Icon size={24} />
          </div>
        </div>
        <div className={styles["stat-card-body"]}>
          <p className={styles["stat-card-value"]}>{value}</p>
          {trend && (
            <span
              className={`${styles["stat-card-trend"]} ${
                trend.isPositive ? styles["trend-positive"] : styles["trend-negative"]
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
