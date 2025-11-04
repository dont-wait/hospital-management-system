"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LazySection from "@/components/shared/LazySection";
import { LoginSkeleton } from "@/components/skeletons";
import authStyles from "@/styles/auth.module.css";

export default function LoginPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get("from");
    
    // Nếu redirect từ expired/redirect và chưa reload, force hard reload
    if (from === "expired" || from === "redirect") {
      const reloadKey = "login-reloaded";
      const hasReloaded = sessionStorage.getItem(reloadKey);
      
      if (!hasReloaded) {
        // Set flag để tránh reload loop
        sessionStorage.setItem(reloadKey, "true");
        // Force hard reload để render đúng layout
        window.location.href = "/login";
      } else {
        // Clear flag sau khi đã reload
        sessionStorage.removeItem(reloadKey);
      }
    }
  }, [searchParams]);

  return (
    <div className={authStyles["login-page"]}>
      <LazySection
        importFunc={() => import("@/components/login/LoginCard")}
        skeleton={<LoginSkeleton />}
        className={authStyles["login-card-sekeleton"]}
      />
    </div>
  );
}
