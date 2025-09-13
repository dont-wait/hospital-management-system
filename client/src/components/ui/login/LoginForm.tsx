"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/login/PasswordInput";
import { UsernameInput } from "@/components/ui/login/UsernameInput";
import { loginSchema } from "@/schemas/auth";
import type { LoginCredentials } from "@/types/index";

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Email</Label>
        <UsernameInput
          id="username"
          type="email"
          placeholder="Enter your email"
          {...register("username")}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          {...register("password")}
          error={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
