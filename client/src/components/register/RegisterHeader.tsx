import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/Card";
import { Heart } from "@/lib/client/utils";

export function RegisterHeader() {
  return (
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-center mb-4">
        <Heart className="h-10 w-10 text-blue-600" />
      </div>
      <CardTitle className="text-2xl text-center">Tạo Tài khoản</CardTitle>
      <CardDescription className="text-center">
        Tham gia MediCare Hospital - Đăng ký ngay!
      </CardDescription>
    </CardHeader>
  );
}
