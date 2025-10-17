import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shared/Card";
import { Heart } from "@/lib/client/utils";

export function LoginHeader() {
  return (
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-center mb-4">
        <Heart className="h-10 w-10 text-blue-600" />
      </div>
      <CardTitle className="text-2xl text-center">Đăng Nhập</CardTitle>
      <CardDescription className="text-center">
        Đăng nhập ngay với tài khoản của bạn.
      </CardDescription>
    </CardHeader>
  );
}
