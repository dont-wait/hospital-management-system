"use client";

import LazySection from "@/components/shared/LazySection";
import { LoginSkeleton } from "@/components/skeletons";
import authStyles from "@/styles/auth.module.css";

export default function LoginPage() {
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
