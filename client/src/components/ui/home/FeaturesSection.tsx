import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: dynamic(() => import("lucide-react").then((mod) => mod.Shield)),
    title: "Chăm sóc chuyên nghiệp",
    description:
      "Đội ngũ bác sĩ và chuyên gia giàu kinh nghiệm cung cấp dịch vụ chăm sóc y tế chất lượng cao nhất.",
    color: "text-blue-600",
  },
  {
    icon: dynamic(() => import("lucide-react").then((mod) => mod.Clock)),
    title: "Cấp cứu 24/7",
    description:
      "Dịch vụ cấp cứu suốt ngày đêm đảm bảo bạn được hỗ trợ khi cần thiết nhất.",
    color: "text-green-600",
  },
  {
    icon: dynamic(() => import("lucide-react").then((mod) => mod.User)),
    title: "Chăm sóc toàn diện",
    description:
      "Từ chăm sóc dự phòng đến điều trị chuyên khoa, chúng tôi cung cấp đầy đủ các dịch vụ y tế.",
    color: "text-purple-600",
  },
  {
    icon: dynamic(() => import("lucide-react").then((mod) => mod.Star)),
    title: "Hài lòng bệnh nhân",
    description:
      "Liên tục được bệnh nhân đánh giá 5 sao cho dịch vụ chăm sóc và phục vụ tuyệt vời.",
    color: "text-yellow-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Tại sao chọn Bệnh viện MediCare?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <Icon className={`h-12 w-12 ${feature.color} mx-auto mb-4`} />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
