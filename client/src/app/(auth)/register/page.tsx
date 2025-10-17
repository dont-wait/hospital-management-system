"use client";

import LazySection from "@/components/shared/LazySection";
import Skeleton from "react-loading-skeleton";

function RegisterPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      style={{ minHeight: "calc(100vh - 64.8px)" }}
    >
      <LazySection
        importFunc={() => import("@/components/register/RegisterCard")}
        skeleton={
          <div className="w-full max-w-2xl mx-auto p-6 space-y-6 bg-white">
            {/* Form Title Area */}
            <div className="space-y-2 text-center">
              <Skeleton width={40} height={40} className="mb-4" />
              <Skeleton width={150} height={24} />
              <Skeleton width={200} height={16} />
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CitizenID Field */}
              <div className="space-y-2">
                <Skeleton width={128} height={16} />
                <Skeleton height={40} />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Skeleton width={64} height={16} />
                <Skeleton height={40} />
              </div>

              {/* First Name Field */}
              <div className="space-y-2">
                <Skeleton width={80} height={16} />
                <Skeleton height={40} />
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <Skeleton width={96} height={16} />
                <Skeleton height={40} />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Skeleton width={80} height={16} />
                <div className="relative">
                  <Skeleton height={40} />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Skeleton width={128} height={16} />
                <div className="relative">
                  <Skeleton height={40} />
                </div>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Skeleton width={112} height={16} />
              <Skeleton height={40} />
            </div>

            {/* Submit Button */}
            <Skeleton height={40} />
          </div>
        }
        className="w-full md:w-3/4 lg:w-2/5"
      />
    </div>
  );
}

export default RegisterPage;
