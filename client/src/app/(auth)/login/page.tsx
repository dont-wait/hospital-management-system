"use client";

import LazySection from "@/components/ui/shared/LazySection";
import Skeleton from "react-loading-skeleton";

export default function LoginPage() {
  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      style={{ minHeight: "calc(100vh - 64.8px)" }}
    >
      <LazySection
        importFunc={() => import("@/components/ui/login/LoginCard")}
        skeleton={
          <section className="bg-gray-50">
            <div className="text-center">
              <Skeleton width={40} height={40} className="mt-6 mb-4" />
              <Skeleton width={150} height={32} className="mb-1" />
              <Skeleton width={200} height={20} className="mb-6" />
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="px-4">
                <Skeleton width={120} height={17} className="mb-2" />
                <Skeleton width={350} height={40} className="mb-2" />
              </div>
            ))}
            <div className="px-4 text-right">
              <Skeleton width={100} height={20} className="mb-2" />
            </div>
            <div className="text-center">
              <Skeleton width={350} height={48} className="my-2" />
              <Skeleton width={200} height={20} className="mb-6" />
            </div>
          </section>
        }
        className="md:w-1/4"
      />
    </div>
  );
}
