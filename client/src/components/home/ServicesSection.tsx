import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/Card";

const services = [
  { en: "Cardiology", vi: "Tim mạch" },
  { en: "Neurology", vi: "Thần kinh" },
  { en: "Orthopedics", vi: "Chấn thương chỉnh hình" },
  { en: "Pediatrics", vi: "Nhi khoa" },
  { en: "Oncology", vi: "Ung bướu" },
  { en: "Emergency Medicine", vi: "Y học cấp cứu" },
  { en: "Surgery", vi: "Phẫu thuật" },
  { en: "Radiology", vi: "Chẩn đoán hình ảnh" },
  { en: "Laboratory Services", vi: "Dịch vụ xét nghiệm" },
];

export default function ServicesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Dịch vụ của chúng tôi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.vi}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{service.vi}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Chăm sóc và điều trị chuyên khoa {service.vi.toLowerCase()}{" "}
                  với thiết bị hiện đại nhất.
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
