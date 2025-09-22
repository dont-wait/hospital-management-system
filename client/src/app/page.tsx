"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Shield, Clock, Users, Star, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, authUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Chào mừng đến với Bệnh viện MediCare
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi. Trải nghiệm dịch
            vụ chăm sóc y tế đẳng cấp thế giới với đội ngũ chuyên gia tận tâm,
            cơ sở vật chất hiện đại và các dịch vụ chăm sóc sức khỏe toàn diện.
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
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Đăng nhập
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {authUser && authUser.employee && (
                  <Link href="/doctor">
                    <Button size="lg">
                      Đi tới Bảng điều khiển Bác sĩ
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {authUser && authUser.patient && (
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

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tại sao chọn Bệnh viện MediCare?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Chăm sóc chuyên nghiệp</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Đội ngũ bác sĩ và chuyên gia giàu kinh nghiệm cung cấp dịch vụ
                  chăm sóc y tế chất lượng cao nhất.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Cấp cứu 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dịch vụ cấp cứu suốt ngày đêm đảm bảo bạn được hỗ trợ khi cần
                  thiết nhất.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Chăm sóc toàn diện</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Từ chăm sóc dự phòng đến điều trị chuyên khoa, chúng tôi cung
                  cấp đầy đủ các dịch vụ y tế.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>Hài lòng bệnh nhân</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Liên tục được bệnh nhân đánh giá 5 sao cho dịch vụ chăm sóc và
                  phục vụ tuyệt vời.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Dịch vụ của chúng tôi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { en: "Cardiology", vi: "Tim mạch" },
              { en: "Neurology", vi: "Thần kinh" },
              { en: "Orthopedics", vi: "Chấn thương chỉnh hình" },
              { en: "Pediatrics", vi: "Nhi khoa" },
              { en: "Oncology", vi: "Ung bướu" },
              { en: "Emergency Medicine", vi: "Y học cấp cứu" },
              { en: "Surgery", vi: "Phẫu thuật" },
              { en: "Radiology", vi: "Chẩn đoán hình ảnh" },
              { en: "Laboratory Services", vi: "Dịch vụ xét nghiệm" },
            ].map((service) => (
              <Card
                key={service.vi}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{service.vi}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Chăm sóc và điều trị chuyên khoa {service.vi.toLowerCase()}
                    với thiết bị hiện đại nhất.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Sẵn sàng trải nghiệm dịch vụ chăm sóc sức khỏe chất lượng?
            </h2>
            <p className="text-xl mb-8">
              Tham gia cùng hàng nghìn bệnh nhân tin tưởng Bệnh viện MediCare
              cho nhu cầu chăm sóc sức khỏe của họ.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Đăng ký ngay hôm nay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
