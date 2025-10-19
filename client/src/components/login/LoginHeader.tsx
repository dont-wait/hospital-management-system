import { CardHeader, CardTitle, CardDescription } from "@/components";
import { Heart } from "@/lib/client";
import styles from "@/styles/auth.module.css";

export function LoginHeader() {
  return (
    <CardHeader className={styles["login-header"]}>
      <div className={styles["login-header-icon-wrap"]}>
        <Heart className={styles["login-header-icon"]} />
      </div>
      <CardTitle className={styles["login-title"]}>Đăng Nhập</CardTitle>
      <CardDescription className={styles["login-desc"]}>
        Đăng nhập ngay với tài khoản của bạn.
      </CardDescription>
    </CardHeader>
  );
}
