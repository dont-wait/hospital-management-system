"use client";

import LazySection from "@/components/ui/shared/LazySection";
import Skeleton from "react-loading-skeleton";

export default function LoginPage() {
  return (
    <div
      className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      style={{ minHeight: "calc(100vh - 64.8px)" }}
    >
      <LazySection
        importFunc={() => import("@/components/ui/login/LoginCard")}
        skeleton={
          <div className="w-full mx-auto p-6 space-y-4 bg-white">
            {/* Form Title Area */}
            <div className="space-y-2 mb-6 text-center">
              <Skeleton width={40} height={40} className="mb-4" />
              <Skeleton width={128} height={24} />
              <Skeleton width={192} height={16} />
            </div>

            {/* CitizenID Field */}
            <div className="space-y-2">
              <Skeleton width={144} height={16} />
              <Skeleton height={40} />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Skeleton width={80} height={16} />
              <div className="relative">
                <Skeleton height={40} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Skeleton height={40} />
            </div>

            {/* Additional Links Area */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <Skeleton width={96} height={12} />
              <Skeleton width={80} height={12} />
            </div>
          </div>
        }
        className="w-full md:w-1/2 lg:w-2/6"
      />
    </div>
  );
}
