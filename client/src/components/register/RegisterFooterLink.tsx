import Link from "next/link";
import styles from "@/styles/auth.module.css";

export function RegisterFooterLink() {
  return (
    <div className={styles["footer-link-section"]}>
      <p className={styles["footer-link-content"]}>
        Bạn đã có tài khoản?{" "}
        <Link href="/login" className={styles["footer-link"]}>
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
