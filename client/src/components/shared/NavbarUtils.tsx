"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components";
import { PatientSidebar } from "@/components/patient/sidebar/PatientSidebar";
import { useUserAuthContext, useSidebar } from "@/contexts";
import { Bell } from "@/lib/client";
import defautlAvatar from "@/public/images/df-avatar.webp";
import styles from "@/styles/navbar.module.css";

export function NavbarUtils() {
  const { user, isAuthenticated } = useUserAuthContext();
  const defaultAvatarUrl = user?.avatarUrl ?? defautlAvatar;
  const { openSidebar, setContent, setTitle, setColorBackground } =
    useSidebar();

  const handleOpenDetails = () => {
    setTitle("Cài đặt");
    setColorBackground("#6a7282");
    setContent(<PatientSidebar />);
    openSidebar();
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <Button variant="outline" className={styles["nav-btn"]} size="sm">
            <Bell className={styles["nav-options-icon"]} />
          </Button>

          <div className={styles["nav-avatar"]}>
            <Image
              src={defaultAvatarUrl}
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
          <Button
            asChild
            variant="outline"
            size="sm"
            className={styles["nav-btn"]}
          >
            <Link href="/login">Đăng nhập</Link>
          </Button>

          <Button asChild size="sm" className={styles["nav-btn"]}>
            <Link href="/register">Đăng ký</Link>
          </Button>
        </>
      )}
    </>
  );
}
