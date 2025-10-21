import Link from "next/link";
import { Button } from "@/components";
import styles from "@/styles/not-found.module.css";

function NotFound() {
  return (
    <div className={styles["not-found-section"]}>
      <span className={styles["not-found-header"]}>404</span>

      <p className={styles["not-found-desc"]}>
        Chúng tôi không thể tìm thấy trang này!
      </p>

      <Link href="/">
        <Button size="lg" className={styles["not-found-button-back"]}>
          Quay lại trang chủ
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
