import { Shield, Clock, Users, Star } from "@/lib/client";

export const features = [
  {
    icon: Shield,
    title: "Chăm sóc chuyên nghiệp",
    description:
      "Đội ngũ bác sĩ và chuyên gia giàu kinh nghiệm cung cấp dịch vụ chăm sóc y tế chất lượng cao nhất.",
    color: "text-blue-600",
  },
  {
    icon: Clock,
    title: "Cấp cứu 24/7",
    description:
      "Dịch vụ cấp cứu suốt ngày đêm đảm bảo bạn được hỗ trợ khi cần thiết nhất.",
    color: "text-green-600",
  },
  {
    icon: Users,
    title: "Chăm sóc toàn diện",
    description:
      "Từ chăm sóc dự phòng đến điều trị chuyên khoa, chúng tôi cung cấp đầy đủ các dịch vụ y tế.",
    color: "text-purple-600",
  },
  {
    icon: Star,
    title: "Hài lòng bệnh nhân",
    description:
      "Liên tục được bệnh nhân đánh giá 5 sao cho dịch vụ chăm sóc và phục vụ tuyệt vời.",
    color: "text-yellow-500",
  },
];

export const services = [
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
