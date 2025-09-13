"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load the RegisterCard component
const RegisterCard = dynamic(
  () =>
    import("@/components/ui/register/RegisterCard").then((mod) => ({
      default: mod.RegisterCard,
    })),
  {
    loading: () => (
      <div className="w-full max-w-md">
        <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
      </div>
    ),
  },
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md">
            <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
          </div>
        }
      >
        <RegisterCard />
      </Suspense>
    </div>
  );
}
