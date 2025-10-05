import { Card, CardContent } from "@/components/ui/shared/Card";
import { LoginHeader } from "./LoginHeader";
import { LoginForm } from "./LoginForm";
import { useLoginSubmit } from "@/hooks/useLoginSubmit";
import Link from "next/link";

function LoginCard() {
  const { handleSubmit, isLoading } = useLoginSubmit();

  return (
    <Card className="w-full">
      <LoginHeader />
      <CardContent className="space-y-4">
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Bạn chưa có tài khoản ?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginCard;
