import Link from "next/link";
import styles from "@/styles/auth.module.css";

export function LoginFooterLink() {
  return (
    <div className={styles["footer-link-section"]}>
      <p className={styles["footer-link-content"]}>
        Bạn chưa có tài khoản?{" "}
        <Link href="/register" className={styles["footer-link"]}>
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
