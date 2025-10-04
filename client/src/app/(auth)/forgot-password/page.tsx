"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/shared/Card";
import LazySection from "@/components/ui/shared/LazySection";
import Skeleton from "react-loading-skeleton";

function ForgotPasswordPage() {
  return (
    <LazySection
      importFunc={() => import("@/components/ui/forgot-password/MainCard")}
      skeleton={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-6">
              {/* Progress bar skeleton */}
              <Skeleton className="h-2 w-full rounded-full" />

              <div className="text-center space-y-4">
                {/* Icon skeleton */}
                <div className="flex justify-center">
                  <Skeleton
                    width={48}
                    height={48}
                    style={{ borderRadius: "50%" }}
                  />
                </div>

                {/* Title and description skeleton */}
                <div className="space-y-2">
                  <Skeleton
                    width="48%"
                    height={32}
                    className="mx-auto rounded"
                  />
                  <Skeleton
                    width="72%"
                    height={16}
                    className="mx-auto rounded"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Skeleton width="100%" height={40} className="mx-auto rounded" />
              <Skeleton width="100%" height={48} className="mx-auto rounded" />
            </CardContent>
          </Card>
        </div>
      }
    />
  );
}

export default ForgotPasswordPage;
