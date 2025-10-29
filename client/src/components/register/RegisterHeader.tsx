import { CardDescription, CardHeader, CardTitle } from "@/components";
import { Heart } from "@/lib/client";
import styles from "@/styles/auth.module.css";

export function RegisterHeader() {
  return (
    <CardHeader className={styles["register-header"]}>
      <div className={styles["register-header-icon-wrap"]}>
        <Heart className={styles["register-header-icon"]} />
      </div>
      <CardTitle className={styles["register-title"]}>Tạo Tài khoản</CardTitle>
      <CardDescription className={styles["register-desc"]}>
        Tham gia MediCare Hospital - Đăng ký ngay!
      </CardDescription>
    </CardHeader>
  );
}
