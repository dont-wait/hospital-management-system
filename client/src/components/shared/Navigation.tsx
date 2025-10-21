"use client";

import Link from "next/link";
import Image from "next/image";
import { useUserAuthContext, useSidebar } from "@/contexts";
import { Button } from "@/components";
import PatientSidebar from "@/components/sidebars/PatientSidebar";
import { Heart, Bell } from "@/lib/client";
import styles from "@/styles/navigation.module.css";

export function Navigation() {
  const { user, isAuthenticated } = useUserAuthContext();
  const { openSidebar, setContent } = useSidebar();

  const handleOpenDetails = () => {
    setContent(<PatientSidebar />);
    openSidebar();
  };

  return (
    <nav className={styles["nav-section"]}>
      <div className={styles["nav-wrap"]}>
        <div className={styles["nav-content"]}>
          {/* Logo section */}
          <section className={styles["nav-logo"]}>
            <Link href="/" className={styles["nav-link"]}>
              <Heart className={styles["nav-link-icon"]} />
              <span className={styles["nav-link-title"]}>MediCare</span>
            </Link>
          </section>

          {/* Options section */}
          <section className={styles["nav-options"]}>
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  className={styles["nav-notify"]}
                  size="sm"
                >
                  <Bell className={styles["nav-options-icon"]} />
                </Button>

                <div className={styles["nav-avatar"]}>
                  <Image
                    src={user!.avatarUrl}
                    width={32}
                    height={32}
                    alt="avatar"
                    className={styles["nav-avatar-img"]}
                    loading="lazy"
                    onClick={handleOpenDetails}
                  />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={styles["nav-btn"]}>
                  <Button variant="outline" size="sm">
                    Đăng nhập
                  </Button>
                </Link>

                <Link href="/register" className={styles["nav-btn"]}>
                  <Button size="sm">Đăng ký</Button>
                </Link>
              </>
            )}
          </section>
        </div>
      </div>
    </nav>
  );
}
