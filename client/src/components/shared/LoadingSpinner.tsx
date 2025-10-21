import styles from "@/styles/loading.module.css";

interface LoadingSpinnerProps {
  text: string;
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps) => (
  <div className={styles["loading-section"]}>
    <div className={styles["loading-spin"]} />
    <span>{text}</span>
  </div>
);
