import Link from "next/link";
import { useUserAuthContext } from "@/contexts/UserAuthContext";
import { Button } from "@/components/ui/shared/Button";
import { ArrowRight } from "@/lib/client/utils";

function Banner() {
  const { isAuthenticated, user } = useUserAuthContext();
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Chào mừng đến với Bệnh viện MediCare
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi. Trải nghiệm dịch
          vụ chăm sóc y tế đẳng cấp thế giới với đội ngũ chuyên gia tận tâm, cơ
          sở vật chất hiện đại và các dịch vụ chăm sóc sức khỏe toàn diện.
        </p>

        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Đăng nhập
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user && "employeeId" in user && (
                <Link href="/doctor">
                  <Button size="lg">
                    Đi tới Bảng điều khiển Bác sĩ
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              {user && "patientId" in user && (
                <Link href="/patient">
                  <Button size="lg">
                    Đi tới Cổng thông tin Bệnh nhân
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Banner;
