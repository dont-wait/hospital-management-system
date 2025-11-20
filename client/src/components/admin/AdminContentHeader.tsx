import styles from "@/styles/admin.module.css";

interface AdminContentHeaderProps {
  title: string;
  description: string;
}

export default function AdminContentHeader({
  title,
  description,
}: AdminContentHeaderProps) {
  return (
    <div className={styles["dashboard-header"]}>
      <h1 className={styles["dashboard-title"]}>{title}</h1>
      <p className={styles["dashboard-subtitle"]}>{description}</p>
    </div>
  );
}
