import Icon from "@/components/shared/Icon";
import { IconNames } from "@/types";
import styles from "@/styles/admin.module.css";

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: IconNames;
}

export default function StatCard({ title, value, iconName }: StatCardProps) {
  return (
    <div className={`${styles["stat-card"]}`}>
      <div className={styles["stat-card-content"]}>
        <div className={styles["stat-card-header"]}>
          <h3 className={styles["stat-card-title"]}>{title}</h3>
          <div className={`${styles["stat-card-icon"]}`}>
            <Icon name={iconName} />
          </div>
        </div>
        <div className={styles["stat-card-body"]}>
          <p className={styles["stat-card-value"]}>{value}</p>
        </div>
      </div>
    </div>
  );
}
