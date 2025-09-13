"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LoginHeader } from "./LoginHeader";
import { LoginForm } from "./LoginForm";
import { useLoginSubmit } from "@/hooks/useLoginSubmit";
import Link from "next/link";

export function LoginCard() {
  const { handleSubmit, isLoading } = useLoginSubmit();

  return (
    <Card className="w-full max-w-md">
      <LoginHeader />
      <CardContent className="space-y-4">
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
